import { Copy } from 'lucide-react';

import type { Match } from '#utils/types.ts';

import { useNotification } from '#context/notificationContext.tsx';
import { matchToText } from '#utils/share.ts';

type ShareMatchProps = {
  match: Match;
};

const BUTTON_CLASS: string =
  'flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white font-semibold transition-colors duration-200 ease-in-out cursor-pointer hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500';

const ShareMatch = ({ match }: ShareMatchProps) => {
  const { notify } = useNotification();

  const copyText = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(matchToText(match));
      notify('Partido copiado!', 'success');
    } catch {
      notify('No pudimos copiar el partido.');
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <h3 className='text-lg font-semibold black-text text-center'>Compartir partido</h3>

      <button type='button' className={BUTTON_CLASS} onClick={() => void copyText()}>
        <Copy size={16} aria-hidden='true' />
        Copiar texto
      </button>
    </div>
  );
};

export { BUTTON_CLASS, ShareMatch };
