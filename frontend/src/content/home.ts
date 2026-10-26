type Step = {
  title: string;
  description: string;
};

type SamplePlayer = {
  name: string;
  skill: number;
};

const STEPS: readonly Step[] = [
  {
    title: 'Cargá a los jugadores',
    description: 'Escribí el nombre de cada jugador y un puntaje del 1 al 10 según su habilidad.',
  },
  {
    title: 'Armá los equipos',
    description: 'El sistema reparte a los jugadores para que ambos equipos queden equilibrados.',
  },
  {
    title: 'Compartilos',
    description:
      'Copiá el resultado y mandalo al grupo, o guardá el partido para ver tus estadísticas.',
  },
];

const SAMPLE_TEAMS: readonly (readonly SamplePlayer[])[] = [
  [
    { name: 'Lucas', skill: 9 },
    { name: 'Martín', skill: 7 },
    { name: 'Nico', skill: 6 },
    { name: 'Fede', skill: 4 },
    { name: 'Tomi', skill: 3 },
  ],
  [
    { name: 'Santi', skill: 8 },
    { name: 'Joaco', skill: 7 },
    { name: 'Agus', skill: 6 },
    { name: 'Facu', skill: 5 },
    { name: 'Ezequiel', skill: 3 },
  ],
];

export type { SamplePlayer, Step };

export { SAMPLE_TEAMS, STEPS };
