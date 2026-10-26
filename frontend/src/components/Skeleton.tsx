type SkeletonProps = {
  className?: string;
};

const Skeleton = ({ className = '' }: SkeletonProps) => (
  <div
    aria-hidden='true'
    className={`motion-safe:animate-pulse rounded bg-gray-200 ${className}`}
  />
);

export { Skeleton };
