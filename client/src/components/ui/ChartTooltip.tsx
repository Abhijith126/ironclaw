interface ChartTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  valueLabel?: string;
  formatter?: (value: number) => string;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  valueLabel = 'kg',
  formatter,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-carbon border border-steel rounded-lg px-3 py-2">
        <p className="text-[10px] text-silver uppercase">{label}</p>
        <p className="text-lime font-display font-bold">
          {formatter ? formatter(payload[0].value) : `${payload[0].value} ${valueLabel}`}
        </p>
      </div>
    );
  }
  return null;
};

export default ChartTooltip;
