import { useTranslation } from 'react-i18next';
import { Modal } from '../../../components/ui';
import { extractYouTubeVideoId } from '../utils';
import type { Equipment } from '../types';

interface VideoModalProps {
  equipment: Equipment | null;
  onClose: () => void;
}

export default function VideoModal({ equipment, onClose }: VideoModalProps) {
  const { t } = useTranslation();
  if (!equipment) return null;

  const videoId = extractYouTubeVideoId(equipment.videoUrl);

  return (
    <Modal isOpen={!!equipment} onClose={onClose}>
      <div className="flex flex-col">
        <div className="p-4 border-b border-steel">
          <h3 className="font-display text-lg font-bold text-white">{equipment.machineName}</h3>
          <p className="text-xs text-silver mt-1">{equipment.category}</p>
        </div>

        <div className="aspect-video bg-obsidian">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={equipment.machineName}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-silver">
              <p>{t('equipment.videoNotAvailable')}</p>
            </div>
          )}
        </div>

        <div className="p-4">
          {equipment.notes && <p className="text-sm text-silver">{equipment.notes}</p>}
        </div>

        <div className="p-4 pt-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-steel text-chalk font-semibold rounded-xl hover:bg-iron transition-colors"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
