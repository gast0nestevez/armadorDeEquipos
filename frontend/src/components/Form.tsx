import { Trash2 } from 'lucide-react';

import type { Field, PlayerInput } from '#utils/types.ts';

import { HelpMessage } from '#components/HelpMessage.tsx';
import { findMissingSkillIndex } from '#utils/players.ts';

type FormProps = {
  players: PlayerInput[];
  handleChange: (index: number, field: Field, value: string) => void;
  deletePlayer: (index: number) => void;
  submitPlayers: () => void;
  submitted: boolean;
};

const Form = ({ players, handleChange, deletePlayer, submitPlayers, submitted }: FormProps) => {
  const missingSkillIndex: number = submitted ? findMissingSkillIndex(players) : -1;

  return (
    <div className='form flex flex-col justify-between max-[600px]:flex-1 p-6 w-full relative'>
      <div className='flex flex-col items-center mb-4 gap-3'>
        <h2 className='text-3xl font-bold text-center'>Jugadores</h2>
        <HelpMessage />
      </div>

      <div className='m-[10px] p-[8px] overflow-y-auto [scrollbar-gutter:stable] [scrollbar-color:theme(colors.gray.400/0.6)_transparent]'>
        {players.map((player: PlayerInput, index: number) => (
          <div key={index} className='flex justify-center items-center gap-2 mt-2 mb-2'>
            <label
              htmlFor={`name-${index.toString(10)}`}
              className='min-w-[5%] mr-[10px] text-base font-bold text-center'
            >
              {index + 1}
            </label>
            <input
              type='text'
              placeholder='Nombre'
              maxLength={25}
              id={`name-${index.toString(10)}`}
              className={`border rounded px-3 py-2 bg-white`}
              value={player.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(index, 'name', e.target.value);
              }}
            />
            <input
              type='text'
              inputMode='numeric'
              placeholder='Puntaje'
              id={`skill-${index.toString(10)}`}
              aria-label={`Puntaje del jugador ${(index + 1).toString(10)}`}
              aria-invalid={index === missingSkillIndex}
              className={`border rounded px-3 py-2 w-24 bg-white ${submitted && player.name.trim() !== '' && player.skill.trim() === '' ? 'border-red-500 ring-1 ring-red-400' : ''}`}
              value={player.skill}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(index, 'skill', e.target.value);
              }}
            />
            <button
              type='button'
              aria-label={`Quitar jugador ${(index + 1).toString(10)}`}
              className='cursor-pointer'
              onClick={() => {
                deletePlayer(index);
              }}
              tabIndex={-1}
            >
              <Trash2 aria-hidden='true' />
            </button>
          </div>
        ))}
      </div>

      <div className='mt-4 flex flex-col items-center gap-2'>
        {missingSkillIndex !== -1 && (
          <p role='alert' className='text-sm text-red-600' style={{ color: 'red' }}>
            Completá puntaje del jugador {missingSkillIndex + 1}
          </p>
        )}
        <button
          type='button'
          onClick={submitPlayers}
          className='bg-blue-900 px-6 py-2 rounded white-text hover:bg-blue-800 transition-colors duration-200 ease-in-out cursor-pointer'
        >
          Armar equipos
        </button>
      </div>
    </div>
  );
};

export type { FormProps };

export { Form };
