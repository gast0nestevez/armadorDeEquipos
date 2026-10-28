import { Copy, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

import type { ShareOutcome } from '#utils/matchImage.ts';
import type { Match } from '#utils/types.ts';

import { useNotification } from '#context/notificationContext.tsx';
import { renderMatchImage, shareImage } from '#utils/matchImage.ts';
import { matchToText } from '#utils/share.ts';

type ShareMatchProps = {
  match: Match;
};

const BUTTON_CLASS: string =
  'flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white font-semibold transition-colors duration-200 ease-in-out cursor-pointer hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500';

const ShareMatch = ({ match }: ShareMatchProps) => {
  const { notify } = useNotification();
  const [generating, setGenerating] = useState<boolean>(false);

  const copyText = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(matchToText(match));
      notify('Partido copiado!', 'success');
    } catch {
      notify('No pudimos copiar el partido.');
    }
  };

  const shareAsImage = async (): Promise<void> => {
    setGenerating(true);

    try {
      const blob: Blob = await renderMatchImage(match);
      const outcome: ShareOutcome = await shareImage(
        blob,
        `partido-${match.date || match._id}.png`
      );

      if (outcome === 'downloaded') {
        notify('Imagen descargada!', 'success');
      }
    } catch {
      notify('No pudimos generar la imagen.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <h3 className='text-lg font-semibold black-text text-center'>Compartir partido</h3>

      <button type='button' className={BUTTON_CLASS} onClick={() => void copyText()}>
        <Copy size={16} aria-hidden='true' />
        Copiar texto
      </button>

      <button
        type='button'
        disabled={generating}
        className={BUTTON_CLASS}
        onClick={() => void shareAsImage()}
      >
        <ImageIcon size={16} aria-hidden='true' />
        {generating ? 'Generando...' : 'Compartir imagen'}
      </button>
    </div>
  );
};

export { ShareMatch };
