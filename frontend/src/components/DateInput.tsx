import { CalendarDays, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useState } from 'react';

import { isoToDisplay } from '#utils/date.ts';

type DateInputProps = {
  value: string;
  onChange: (isoDate: string) => void;
  className?: string;
};

type ViewMonth = {
  year: number;
  month: number;
};

const MONTHS: string[] = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const WEEKDAYS: string[] = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

const pad: (n: number) => string = (n: number): string => n.toString().padStart(2, '0');

const toIso: (year: number, month: number, day: number) => string = (
  year: number,
  month: number,
  day: number
): string => `${year.toString().padStart(4, '0')}-${pad(month + 1)}-${pad(day)}`;

const todayIso: () => string = (): string => {
  const now: Date = new Date();
  return toIso(now.getFullYear(), now.getMonth(), now.getDate());
};

const initialView: (isoDate: string) => ViewMonth = (isoDate: string): ViewMonth => {
  const [year, month]: string[] = (isoDate || todayIso()).split('-');
  return { year: Number(year), month: Number(month) - 1 };
};

const monthCells: (view: ViewMonth) => (number | null)[] = (view: ViewMonth): (number | null)[] => {
  const offset: number = (new Date(Date.UTC(view.year, view.month, 1)).getUTCDay() + 6) % 7;
  const days: number = new Date(Date.UTC(view.year, view.month + 1, 0)).getUTCDate();
  return [
    ...Array.from({ length: offset }, (): null => null),
    ...Array.from({ length: days }, (_: unknown, i: number): number => i + 1),
  ];
};

const shiftMonths: (view: ViewMonth, delta: number) => ViewMonth = (
  view: ViewMonth,
  delta: number
): ViewMonth => {
  const total: number = view.year * 12 + view.month + delta;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
};

const navButton: string =
  'p-1 rounded-md text-gray-600 hover:bg-gray-100 transition-colors duration-200 ease-in-out cursor-pointer';

const DateInput = ({ value, onChange, className }: DateInputProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [view, setView] = useState<ViewMonth>(initialView(value));

  const today: string = todayIso();

  return (
    <div className='flex flex-col items-center gap-2'>
      <button
        type='button'
        aria-label='Fecha del partido'
        aria-expanded={open}
        className={`flex items-center justify-center gap-2 cursor-pointer ${className ?? ''}`}
        onClick={() => {
          if (!open) {
            setView(initialView(value));
          }
          setOpen(!open);
        }}
      >
        <CalendarDays size={16} aria-hidden='true' />
        <span className={value ? '' : 'text-gray-400'}>
          {value ? isoToDisplay(value) : 'día/mes/año'}
        </span>
      </button>

      {open && (
        <div className='w-64 bg-white border border-gray-200 rounded-lg shadow-md p-3 black-text'>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex'>
              <button
                type='button'
                aria-label='Año anterior'
                className={navButton}
                onClick={() => {
                  setView(shiftMonths(view, -12));
                }}
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                type='button'
                aria-label='Mes anterior'
                className={navButton}
                onClick={() => {
                  setView(shiftMonths(view, -1));
                }}
              >
                <ChevronLeft size={16} />
              </button>
            </div>

            <span className='text-sm font-semibold'>
              {MONTHS[view.month]} {view.year}
            </span>

            <div className='flex'>
              <button
                type='button'
                aria-label='Mes siguiente'
                className={navButton}
                onClick={() => {
                  setView(shiftMonths(view, 1));
                }}
              >
                <ChevronRight size={16} />
              </button>
              <button
                type='button'
                aria-label='Año siguiente'
                className={navButton}
                onClick={() => {
                  setView(shiftMonths(view, 12));
                }}
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>

          <div className='grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1'>
            {WEEKDAYS.map(
              (weekday: string): React.JSX.Element => (
                <span key={weekday}>{weekday}</span>
              )
            )}
          </div>

          <div className='grid grid-cols-7 gap-1 text-center text-sm'>
            {monthCells(view).map((day: number | null, index: number): React.JSX.Element => {
              if (day === null) {
                return <span key={`empty-${index.toString()}`} />;
              }

              const iso: string = toIso(view.year, view.month, day);
              const selected: boolean = iso === value;

              return (
                <button
                  key={iso}
                  type='button'
                  aria-pressed={selected}
                  className={`py-1 rounded-md transition-colors duration-200 ease-in-out cursor-pointer ${selected ? 'bg-blue-600 white-text' : 'hover:bg-gray-100'} ${iso === today && !selected ? 'border border-blue-400' : ''}`}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {value && (
            <button
              type='button'
              className='mt-2 w-full text-sm text-gray-500 hover:text-gray-800 transition-colors duration-200 ease-in-out cursor-pointer'
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
            >
              Quitar fecha
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export { DateInput };
