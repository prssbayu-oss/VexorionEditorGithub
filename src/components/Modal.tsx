import React, { useEffect } from 'react';
import { X } from '../icons';
import { motion, AnimatePresence } from 'motion/react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const maxWMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`relative w-full ${maxWMap[maxWidth]} bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#30363d] bg-[#161b22]">
              <div>
                <h3 className="text-sm font-semibold text-[#f0f6fc]">{title}</h3>
                {subtitle && <p className="text-xs text-[#8b949e] mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="text-[#8b949e] hover:text-[#f0f6fc] p-1 rounded-md hover:bg-[#21262d] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 max-h-[75vh] overflow-y-auto">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[#30363d] bg-[#0d1117]/50">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
