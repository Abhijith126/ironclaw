import { useEffect, useRef, ReactNode } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className = '' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-sm bg-carbon border border-steel rounded-2xl shadow-2xl overflow-hidden ${className}`}>
        {children}
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  danger = false 
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 flex flex-col items-center text-center">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${danger ? 'bg-danger/15' : 'bg-lime/15'}`}>
          {danger ? (
            <AlertTriangle size={28} className="text-danger" />
          ) : (
            <CheckCircle size={28} className="text-lime" />
          )}
        </div>
        <h3 className="font-display text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-silver mb-6">{message}</p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-steel text-chalk font-semibold rounded-xl hover:bg-iron transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 font-semibold rounded-xl transition-colors ${
              danger
                ? 'bg-danger text-white hover:bg-danger/80'
                : 'bg-lime text-obsidian hover:bg-lime-dim'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error';
}

export function AlertModal({ isOpen, onClose, title, message, type = 'success' }: AlertModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 flex flex-col items-center text-center">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${type === 'success' ? 'bg-lime/15' : 'bg-danger/15'}`}>
          {type === 'success' ? (
            <CheckCircle size={28} className="text-lime" />
          ) : (
            <AlertTriangle size={28} className="text-danger" />
          )}
        </div>
        <h3 className="font-display text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-silver mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-lime text-obsidian font-semibold rounded-xl hover:bg-lime-dim transition-colors"
        >
          OK
        </button>
      </div>
    </Modal>
  );
}

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  videoUrl?: string;
  children?: ReactNode;
  notes?: string;
}

export function VideoModal({ isOpen, onClose, title, subtitle, videoUrl, children, notes }: VideoModalProps) {
  if (!isOpen) return null;

  const videoId = videoUrl?.includes('youtube.com') 
    ? videoUrl.split('v=')[1]?.split('&')[0]
    : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col">
        <div className="p-4 border-b border-steel">
          <h3 className="font-display text-lg font-bold text-white">{title}</h3>
          {subtitle && <p className="text-xs text-silver mt-1">{subtitle}</p>}
        </div>
        
        <div className="aspect-video bg-obsidian">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-silver">
              <p>Video not available</p>
            </div>
          )}
        </div>

        {(notes || children) && (
          <div className="p-4">
            {notes && <p className="text-sm text-silver">{notes}</p>}
            {children}
          </div>
        )}

        <div className="p-4 pt-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-steel text-chalk font-semibold rounded-xl hover:bg-iron transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default Modal;
