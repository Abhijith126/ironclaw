import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import ChartTooltip from './ChartTooltip';

interface WeightChartProps {
  data: { date: string; weight: number }[];
  height?: number;
  gradientId?: string;
  showDots?: boolean;
}

export default function WeightChart({
  data,
  height = 180,
  gradientId = 'weightGradient',
  showDots = false,
}: WeightChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#c6f135" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#c6f135" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: '#888888' }}
          axisLine={{ stroke: '#2a2a2a' }}
          tickLine={false}
          dy={10}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#888888' }}
          axisLine={false}
          tickLine={false}
          domain={['dataMin - 1', 'dataMax + 1']}
        />
        <Tooltip content={<ChartTooltip valueLabel="kg" />} />
        <Area
          type="monotone"
          dataKey="weight"
          stroke="#c6f135"
          strokeWidth={2}
          fillOpacity={1}
          fill={`url(#${gradientId})`}
          dot={showDots ? { r: 3, fill: '#c6f135', stroke: '#080808', strokeWidth: 1.5 } : false}
          activeDot={{ r: 5, fill: '#c6f135', stroke: '#080808', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
