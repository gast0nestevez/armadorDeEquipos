import type { Match, Player, Result } from '#utils/types.ts';

import { isoToDisplay } from '#utils/date.ts';
import { RESULT_LABELS, teamPlayers } from '#utils/share.ts';
import { capitalize } from '#utils/string.ts';

const WIDTH: number = 1080;
const PADDING: number = 60;
const HEADER_HEIGHT: number = 190;
const SCORE_HEIGHT: number = 260;
const ROW_HEIGHT: number = 60;
const FOOTER_HEIGHT: number = 120;
const FONT_FAMILY: string = 'Roboto, sans-serif';
const SITE_HOST: string = 'armador-de-equipos.vercel.app';

const RESULT_COLORS: Record<Result, string> = {
  Win: '#16a34a',
  Draw: '#ca8a04',
  Lose: '#dc2626',
  '': '#1e3a8a',
};

const fitText: (context: CanvasRenderingContext2D, text: string, maxWidth: number) => string = (
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string => {
  if (context.measureText(text).width <= maxWidth) {
    return text;
  }

  let trimmed: string = text;
  while (trimmed.length > 1 && context.measureText(`${trimmed}…`).width > maxWidth) {
    trimmed = trimmed.slice(0, -1);
  }

  return `${trimmed}…`;
};

const canvasToBlob: (canvas: HTMLCanvasElement) => Promise<Blob> = (
  canvas: HTMLCanvasElement
): Promise<Blob> =>
  new Promise<Blob>((resolve: (blob: Blob) => void, reject: (reason: Error) => void): void => {
    canvas.toBlob((blob: Blob | null): void => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Could not render image'));
      }
    }, 'image/png');
  });

const renderMatchImage: (match: Match) => Promise<Blob> = async (match: Match): Promise<Blob> => {
  await Promise.all([
    document.fonts.load(`700 40px ${FONT_FAMILY}`),
    document.fonts.load(`400 40px ${FONT_FAMILY}`),
  ]);

  const team1: Player[] = teamPlayers(match.players, 1);
  const team2: Player[] = teamPlayers(match.players, 2);
  const rows: number = Math.max(team1.length, team2.length, 1);
  const height: number = HEADER_HEIGHT + SCORE_HEIGHT + rows * ROW_HEIGHT + FOOTER_HEIGHT;

  const canvas: HTMLCanvasElement = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = height;

  const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas is not supported');
  }

  const columnWidth: number = (WIDTH - PADDING * 2) / 2 - 20;

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, WIDTH, height);

  context.fillStyle = RESULT_COLORS[match.result];
  context.fillRect(0, 0, WIDTH, HEADER_HEIGHT);

  context.fillStyle = '#ffffff';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = `700 56px ${FONT_FAMILY}`;
  context.fillText(
    match.result ? RESULT_LABELS[match.result] : 'Partido',
    WIDTH / 2,
    HEADER_HEIGHT / 2 - 20
  );
  context.font = `400 36px ${FONT_FAMILY}`;
  context.fillText(
    match.date ? isoToDisplay(match.date) : 'Sin fecha',
    WIDTH / 2,
    HEADER_HEIGHT / 2 + 45
  );

  const scoreY: number = HEADER_HEIGHT + SCORE_HEIGHT / 2;
  context.fillStyle = '#111827';
  context.font = `700 150px ${FONT_FAMILY}`;
  context.fillText(`${match.goals1.toString()} - ${match.goals2.toString()}`, WIDTH / 2, scoreY);

  const teamsY: number = HEADER_HEIGHT + SCORE_HEIGHT - 20;
  context.fillStyle = '#374151';
  context.font = `700 40px ${FONT_FAMILY}`;
  context.textAlign = 'left';
  context.fillText('Equipo 1', PADDING, teamsY);
  context.textAlign = 'right';
  context.fillText('Equipo 2', WIDTH - PADDING, teamsY);

  context.font = `400 38px ${FONT_FAMILY}`;
  context.fillStyle = '#1f2937';
  const firstRowY: number = HEADER_HEIGHT + SCORE_HEIGHT + ROW_HEIGHT / 2 + 10;

  team1.forEach((player: Player, index: number): void => {
    context.textAlign = 'left';
    context.fillText(
      fitText(context, capitalize(player.name), columnWidth),
      PADDING,
      firstRowY + index * ROW_HEIGHT
    );
  });

  team2.forEach((player: Player, index: number): void => {
    context.textAlign = 'right';
    context.fillText(
      fitText(context, capitalize(player.name), columnWidth),
      WIDTH - PADDING,
      firstRowY + index * ROW_HEIGHT
    );
  });

  context.textAlign = 'center';
  context.fillStyle = '#9ca3af';
  context.font = `400 28px ${FONT_FAMILY}`;
  context.fillText(SITE_HOST, WIDTH / 2, height - FOOTER_HEIGHT / 2);

  return canvasToBlob(canvas);
};

type ShareOutcome = 'cancelled' | 'downloaded' | 'shared';

const shareImage: (blob: Blob, fileName: string) => Promise<ShareOutcome> = async (
  blob: Blob,
  fileName: string
): Promise<ShareOutcome> => {
  const file: File = new File([blob], fileName, { type: blob.type });

  if ('canShare' in navigator && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return 'shared';
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return 'cancelled';
      }
      throw err;
    }
  }

  const url: string = URL.createObjectURL(blob);
  const link: HTMLAnchorElement = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);

  return 'downloaded';
};

export type { ShareOutcome };

export { renderMatchImage, shareImage };
