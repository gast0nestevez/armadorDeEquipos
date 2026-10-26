import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';

import { Modal } from '#components/Modal.tsx';

const HelpMessage = () => {
  const [showHelpMessage, setShowHelpMessage] = useState<boolean>(false);

  const close = (): void => {
    setShowHelpMessage(false);
  };

  return (
    <>
      <button
        type='button'
        className='mt-1 text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2 cursor-pointer transition-colors duration-200 ease-in-out'
        onClick={() => {
          setShowHelpMessage(true);
        }}
      >
        ¿Cómo funciona?
      </button>

      <AnimatePresence>
        {showHelpMessage && (
          <Modal label='¿Cómo funciona?' className='max-w-sm' onClose={close}>
            <h2 className='mb-3 text-lg font-bold'>¿Cómo funciona?</h2>
            <p className='text-sm text-gray-700'>
              Ingresá los nombres y puntajes de los jugadores. Cuando empieces a escribir el nombre
              de un jugador se habilitará el cuadro del siguiente. Luego hacé clic en{' '}
              <span className='font-semibold'>Armar equipos</span> para generar. ¡Listo!
            </p>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export { HelpMessage };
