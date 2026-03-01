import { useEffect, useRef } from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';

export function Modal({ isOpen, onClose, children }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
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
      <div className="relative w-full max-w-sm bg-carbon border border-steel rounded-2xl shadow-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', danger = false }) {
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

export function AlertModal({ isOpen, onClose, title, message, type = 'success' }) {
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
