import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';
import type { Equipment } from '../types';

interface EquipmentCardProps {
  item: Equipment;
  onVideoClick: () => void;
}

export default function EquipmentCard({ item, onVideoClick }: EquipmentCardProps) {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white">{item.machineName}</h3>

          {item.difficultyLevel && (
            <span
              className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                item.difficultyLevel.includes('Beginner')
                  ? 'bg-success/15 text-success'
                  : item.difficultyLevel.includes('Intermediate')
                    ? 'bg-lime/15 text-lime'
                    : 'bg-danger/15 text-danger'
              }`}
            >
              {item.difficultyLevel}
            </span>
          )}

          {item.primaryMuscles && item.primaryMuscles.length > 0 && (
            <div className="mt-2">
              <p className="text-[10px] text-silver uppercase tracking-wider mb-1">{t('equipment.primary')}</p>
              <div className="flex flex-wrap gap-1">
                {item.primaryMuscles.map((muscle) => (
                  <span key={muscle} className="px-2 py-1 bg-lime/10 text-lime text-xs rounded">{muscle}</span>
                ))}
              </div>
            </div>
          )}

          {item.secondaryMuscles && item.secondaryMuscles.length > 0 && (
            <div className="mt-2">
              <p className="text-[10px] text-silver uppercase tracking-wider mb-1">{t('equipment.secondary')}</p>
              <div className="flex flex-wrap gap-1">
                {item.secondaryMuscles.map((muscle) => (
                  <span key={muscle} className="px-2 py-1 bg-steel text-silver text-xs rounded">{muscle}</span>
                ))}
              </div>
            </div>
          )}

          {item.movementPattern && (
            <p className="mt-2 text-xs text-silver">
              <span className="text-silver/60">{t('equipment.movement')}: </span>
              {item.movementPattern}
            </p>
          )}

          {item.notes && <p className="mt-2 text-xs text-silver/70 line-clamp-2">{item.notes}</p>}
        </div>

        {item.videoUrl && (
          <button
            onClick={onVideoClick}
            className="shrink-0 w-10 h-10 rounded-full bg-lime flex items-center justify-center hover:bg-lime-dim transition-colors"
          >
            <Play size={16} className="text-obsidian ml-0.5" fill="currentColor" />
          </button>
        )}
      </div>
    </div>
  );
}
