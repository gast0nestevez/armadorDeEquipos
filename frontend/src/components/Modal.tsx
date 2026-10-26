import { motion } from 'framer-motion';
import { X } from 'lucide-react';

import { useDialog } from '#hooks/useDialog.ts';

type ModalProps = {
  label: string;
  className: string;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ label, className, onClose, children }: ModalProps) => {
  const dialogRef: React.RefObject<HTMLDivElement | null> = useDialog(onClose);

  return (
    <motion.div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-label={label}
        tabIndex={-1}
        className={`relative mx-4 w-full rounded-xl bg-white p-6 shadow-xl focus:outline-none ${className}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          e.stopPropagation();
        }}
      >
        <button
          type='button'
          aria-label='Cerrar'
          className='absolute top-3 right-3 cursor-pointer text-gray-400 transition-colors duration-200 ease-in-out hover:text-gray-700'
          onClick={onClose}
        >
          <X size={20} aria-hidden='true' />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
};

export { Modal };
