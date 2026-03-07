import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, TrendingDown, TrendingUp, Scale as ScaleIcon } from 'lucide-react';
import { userAPI } from '../../services/api';
import { PageHeader, Card, Button, Input, EmptyState, WeightChart } from '../../components/ui';
import { sortByDate, formatDateShort, getWeightTrend } from '../../utils';

function WeightTracker() {
  const { t } = useTranslation();
  const [inputWeight, setInputWeight] = useState('');
  const [inputDate, setInputDate] = useState(new Date().toISOString().split('T')[0]);
  const [weightLog, setWeightLog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeightLog();
  }, []);

  const fetchWeightLog = async () => {
    try {
      const response = await userAPI.getWeightLog();
      setWeightLog(response.data.weightLog || []);
    } catch (error) {
      console.error('Error fetching weight log:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputWeight || parseFloat(inputWeight) <= 0) return;

    try {
      const response = await userAPI.addWeight(parseFloat(inputWeight), inputDate);
      setWeightLog(response.data.weightLog || []);
      setInputWeight('');
    } catch (error) {
      console.error('Error adding weight:', error);
    }
  };

  const sortedLogs = useMemo(() => sortByDate(weightLog, 'date'), [weightLog]);

  const recentLogs = sortedLogs.slice(-10).reverse();

  const trend = useMemo(() => getWeightTrend(sortedLogs), [sortedLogs]);
  const currentWeight = sortedLogs.length > 0 ? sortedLogs[sortedLogs.length - 1].weight : null;

  const weightData = useMemo(
    () =>
      sortedLogs.map((w) => ({
        date: formatDateShort(w.date),
        weight: parseFloat(w.weight),
      })),
    [sortedLogs]
  );

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t('weight.title')} subtitle={t('weight.trackWeight')} />

      <Card>
        <h3 className="font-display text-xs font-bold uppercase tracking-wider text-silver mb-4">
          {t('weight.logWeight')}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t('weight.weightKg')}
              type="number"
              step="0.1"
              min="0"
              value={inputWeight}
              onChange={(e) => setInputWeight(e.target.value)}
              placeholder="0.0"
              required
            />
            <Input
              label={t('weight.date')}
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={!inputWeight}>
            <Plus size={18} />
            <span>{t('weight.addEntry')}</span>
          </Button>
        </form>
      </Card>

      {currentWeight && (
        <Card variant="secondary">
          <div className="flex justify-between items-center">
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-silver mr-2">
                {t('weight.current')}
              </span>
              <span className="font-display text-4xl font-bold text-white leading-none">
                {currentWeight.toFixed(1)}
              </span>
              <span className="text-sm text-silver">kg</span>
            </div>
            {trend !== null && (
              <div
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold ${trend <= 0 ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}
              >
                {trend <= 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                <span>{Math.abs(trend).toFixed(1)}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {weightData.length > 0 && (
        <Card>
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-silver mb-4">
            {t('weight.title')}
          </h3>
          <WeightChart data={weightData} gradientId="weightTrackerGrad" showDots />
        </Card>
      )}

      {recentLogs.length > 0 && (
        <Card>
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-silver mb-3">
            {t('weight.recent')}
          </h3>
          <div className="flex flex-col gap-1">
            {recentLogs.map((entry, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded-xl">
                <div className="flex flex-col">
                  <span className="font-display font-bold text-white">
                    {parseFloat(entry.weight).toFixed(1)} kg
                  </span>
                  <span className="text-[10px] text-silver">{formatDateShort(entry.date)}</span>
                </div>
                {idx === 0 && trend !== null && (
                  <span
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${trend <= 0 ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}
                  >
                    {trend <= 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                    {Math.abs(trend).toFixed(1)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {weightLog.length === 0 && !loading && (
        <EmptyState
          icon={ScaleIcon}
          title={t('weight.noData')}
          message={t('weight.noDataMessage')}
        />
      )}
    </div>
  );
}

export default WeightTracker;
