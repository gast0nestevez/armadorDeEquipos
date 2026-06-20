import { Trash2 } from 'lucide-react';

import type { PlayerInput } from '../hooks/types';

import HelpMessage from './HelpMessage';

type FormProps = {
  players: PlayerInput[];
  handleChange: (index: number, field: keyof PlayerInput, value: string) => void;
  deletePlayer: (index: number) => void;
  submitPlayers: () => void;
  submitted: boolean;
};

const Form = ({ players, handleChange, deletePlayer, submitPlayers, submitted }: FormProps) => {
  return (
    <div className='form flex flex-col justify-between max-[600px]:flex-1 p-6 w-full relative'>
      <div className='flex flex-col items-center mb-4 gap-3'>
        <h1 className='text-3xl font-bold text-center'>Jugadores</h1>
        <HelpMessage />
      </div>

      <div className='m-[10px] p-[8px] overflow-y-auto [scrollbar-gutter:stable] [scrollbar-color:theme(colors.gray.400/0.6)_transparent]'>
        {players.map((player: PlayerInput, index: number) => (
          <div key={index} className='flex justify-center items-center gap-2 mt-2 mb-2'>
            <label
              htmlFor={index.toString(10)}
              className='min-w-[5%] mr-[10px] text-base font-bold text-center'
            >
              {index + 1}
            </label>
            <input
              type='text'
              placeholder='Nombre'
              maxLength={25}
              id={index.toString(10)}
              className={`border rounded px-3 py-2 bg-white ${submitted && player.name.trim() === '' ? 'border-red-500 ring-1 ring-red-400' : ''}`}
              value={player.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(index, 'name', e.target.value)
              }
            />
            <input
              type='text'
              inputMode='numeric'
              placeholder='Puntaje'
              className={`border rounded px-3 py-2 w-24 bg-white ${submitted && player.skill.trim() === '' ? 'border-red-500 ring-1 ring-red-400' : ''}`}
              value={player.skill}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(index, 'skill', e.target.value)
              }
            />
            <button className='cursor-pointer' onClick={() => deletePlayer(index)} tabIndex={-1}>
              <Trash2 />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={submitPlayers}
        className='mt-4 bg-blue-900 px-6 py-2 rounded white-text hover:bg-blue-800 block mx-auto cursor-pointer'
      >
        Armar equipos
      </button>
    </div>
  );
};

export type { FormProps };

export default Form;
