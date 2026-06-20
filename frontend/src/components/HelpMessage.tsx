import { X } from 'lucide-react';
import { useState } from 'react';

const HelpMessage = () => {
  const [showHelpMessage, setShowHelpMessage] = useState<boolean>(false);

  return (
    <>
      <button
        className='mt-1 text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2 cursor-pointer transition'
        onClick={() => setShowHelpMessage(true)}
      >
        ¿Cómo funciona?
      </button>

      {showHelpMessage && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
          <div className='relative bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4'>
            <button
              className='absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-gray-700 transition'
              onClick={() => setShowHelpMessage(false)}
            >
              <X size={20} />
            </button>
            <h2 className='text-lg font-bold mb-3'>¿Cómo funciona?</h2>
            <p className='text-sm text-gray-700'>
              Ingresá los nombres y puntajes de los jugadores. Cuando empieces a escribir el nombre
              de un jugador se habilitará el cuadro del siguiente. Luego hacé clic en{' '}
              <span className='font-semibold'>Armar equipos</span> para generar. ¡Listo!
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpMessage;
