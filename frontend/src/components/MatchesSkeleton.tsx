import { Skeleton } from '#components/Skeleton.tsx';

const MATCH_PLACEHOLDERS: readonly number[] = [0, 1, 2, 3];

const MatchCardSkeleton = () => (
  <div role='status' className='flex flex-col items-center gap-3 p-4'>
    <span className='sr-only'>Cargando partido</span>
    <Skeleton className='h-4 w-24' />
    <Skeleton className='h-8 w-40' />
  </div>
);

const MatchesSkeleton = () => (
  <div
    role='status'
    aria-busy='true'
    className='flex flex-col lg:flex-row gap-10 items-start w-full'
  >
    <span className='sr-only'>Cargando historial</span>

    <div className='w-full lg:w-[600px]'>
      <Skeleton className='mx-auto mb-4 h-7 w-32' />

      <div className='mb-4 flex flex-col items-center justify-between gap-3 sm:flex-row'>
        <Skeleton className='h-8 w-44' />
        <Skeleton className='h-8 w-56' />
      </div>

      <ul className='space-y-4'>
        {MATCH_PLACEHOLDERS.map(
          (placeholder: number): React.JSX.Element => (
            <li
              key={placeholder}
              className='flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm'
            >
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-8 w-40' />
            </li>
          )
        )}
      </ul>
    </div>

    <div className='w-full lg:w-[450px]'>
      <Skeleton className='mx-auto mb-4 h-7 w-52' />
      <Skeleton className='h-72 w-full rounded-lg' />
    </div>
  </div>
);

export { MatchCardSkeleton, MatchesSkeleton };
