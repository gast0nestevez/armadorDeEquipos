import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { SamplePlayer, Step } from '#content/home.ts';

import { Footer } from '#components/Footer.tsx';
import { Nav } from '#components/Nav.tsx';
import { SAMPLE_TEAMS, STEPS } from '#content/home.ts';
import { useSeo } from '#hooks/useSeo.ts';

import '#css/home.css';

const CARD_CLASS: string = 'rounded-2xl bg-white shadow-md';

const PRIMARY_BUTTON_CLASS: string =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-8 py-3 text-lg font-semibold shadow transition-colors duration-200 ease-in-out hover:bg-blue-800 white-text';

const sumSkills: (players: readonly SamplePlayer[]) => number = (
  players: readonly SamplePlayer[]
): number => players.reduce((total, player) => total + player.skill, 0);

const preloadMakeTeams = (): void => {
  void import('#pages/MakeTeams.tsx');
};

const Home = () => {
  useSeo({
    title: 'Generador de equipos de fútbol balanceados | Armador de Equipos',
    description:
      'Armá equipos de fútbol parejos en segundos: puntuá a tus amigos por habilidad y generá equipos balanceados para fútbol 5, 7 u 11. Gratis y sin registro.',
    path: '/',
  });

  return (
    <div className='flex min-h-screen flex-col'>
      <Nav />

      <main className='mx-auto w-full max-w-5xl flex-1 px-4'>
        <section className='flex flex-col items-center py-14 text-center sm:py-20'>
          <h1 className='max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl'>
            Generador de equipos de fútbol <span className='text-blue-900'>balanceados</span>
          </h1>
          <p className='mt-6 max-w-xl text-lg text-gray-600 sm:text-xl'>
            Puntuá a tus amigos por habilidad y obtené equipos parejos en segundos. Ideal para
            fútbol 5, fútbol 7 y fútbol 11.
          </p>
          <div className='mt-10 flex flex-col items-center gap-3 sm:flex-row'>
            <Link
              to='/armar'
              onPointerEnter={preloadMakeTeams}
              onFocus={preloadMakeTeams}
              className={PRIMARY_BUTTON_CLASS}
            >
              Armar equipos
              <ArrowRight size={20} aria-hidden='true' />
            </Link>
            <a
              href='#como-funciona'
              className='rounded-xl px-6 py-3 text-lg font-semibold text-blue-900 transition-colors duration-200 ease-in-out hover:bg-blue-900/10'
            >
              Cómo funciona
            </a>
          </div>
        </section>

        <figure className={`${CARD_CLASS} mx-auto mb-20 max-w-2xl p-6 sm:p-8`}>
          <div className='grid grid-cols-2 gap-4 sm:gap-8'>
            {SAMPLE_TEAMS.map(
              (players: readonly SamplePlayer[], index: number): React.JSX.Element => (
                <div key={index} className='flex flex-col'>
                  <h2 className='mb-3 text-center text-lg font-bold'>Equipo {index + 1}</h2>
                  <ul className='flex-1 divide-y divide-gray-100'>
                    {players.map(
                      (player: SamplePlayer): React.JSX.Element => (
                        <li key={player.name} className='flex justify-between py-1.5'>
                          <span>{player.name}</span>
                          <span className='text-gray-500'>{player.skill}</span>
                        </li>
                      )
                    )}
                  </ul>
                  <p className='mt-3 border-t border-gray-200 pt-3 text-center font-semibold'>
                    Total: {sumSkills(players)}
                  </p>
                </div>
              )
            )}
          </div>
          <figcaption className='mt-6 text-center text-sm text-gray-500'>
            Ejemplo: dos equipos de fútbol 5 con la misma suma de habilidad.
          </figcaption>
        </figure>

        <section aria-labelledby='como-funciona' className='mb-20 scroll-mt-8'>
          <h2 id='como-funciona' className='mb-8 text-center text-3xl font-bold'>
            Cómo armar equipos de fútbol en 3 pasos
          </h2>
          <ol className='grid gap-4 sm:grid-cols-3'>
            {STEPS.map(
              (step: Step, index: number): React.JSX.Element => (
                <li key={step.title} className={`${CARD_CLASS} p-6`}>
                  <span className='flex h-9 w-9 items-center justify-center rounded-full bg-blue-900 font-bold white-text'>
                    {index + 1}
                  </span>
                  <h3 className='mt-4 text-lg font-semibold'>{step.title}</h3>
                  <p className='mt-1 text-gray-600'>{step.description}</p>
                </li>
              )
            )}
          </ol>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export { Home };
