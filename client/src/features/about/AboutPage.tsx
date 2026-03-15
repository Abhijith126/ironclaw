import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Target, TrendingUp, Calendar, ArrowLeft } from 'lucide-react';
import { PageHeader, Card, Badge, ListItem } from '../../components/ui';
import { APP_NAME, APP_TAGLINE } from '../../constants';
import { DownloadAPK } from '../../components/DownloadAPK';

const AboutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    { icon: Dumbbell, title: t('about.workoutTracking'), desc: t('about.workoutTrackingDesc') },
    { icon: Target, title: t('about.prManagement'), desc: t('about.prManagementDesc') },
    { icon: TrendingUp, title: t('about.progressCharts'), desc: t('about.progressChartsDesc') },
    { icon: Calendar, title: t('about.weeklySchedule'), desc: t('about.weeklyScheduleDesc') },
  ];

  const tips = [t('about.tip1'), t('about.tip2'), t('about.tip3'), t('about.tip4')];

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => navigate('/settings')}
        className="flex items-center gap-2 text-silver hover:text-chalk transition-colors self-start py-1"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">{t('nav.settings')}</span>
      </button>

      <PageHeader title={t('about.title')} subtitle={t('about.yourCompanion')} />

      <Card className="text-center py-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-lime flex items-center justify-center text-obsidian">
          <Dumbbell size={36} strokeWidth={2.5} />
        </div>
        <h2 className="font-display text-2xl font-extrabold text-white mb-2">{APP_NAME}</h2>
        <p className="text-silver text-sm mb-4">{APP_TAGLINE}</p>
        <Badge variant="primary">{t('about.version')} 1.0.0</Badge>
      </Card>

      <Card>
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-silver mb-4">
          {t('about.features')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature, idx) => (
            <div key={idx} className="p-3 bg-muted rounded-xl">
              <feature.icon size={20} className="text-lime mb-2" />
              <p className="font-semibold text-white text-sm">{feature.title}</p>
              <p className="text-xs text-silver mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-silver mb-4">
          {t('about.tips')}
        </h3>
        <ul className="space-y-2">
          {tips.map((tip, idx) => (
            <ListItem key={idx}>{tip}</ListItem>
          ))}
        </ul>
      </Card>

      <DownloadAPK />
    </div>
  );
};

export default AboutPage;
