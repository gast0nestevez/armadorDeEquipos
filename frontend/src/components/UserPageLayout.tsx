import { Nav } from '#components/Nav.tsx';

type UserPageLayoutProps = {
  title: string;
  children: React.ReactNode;
};

const UserPageLayout = ({ title, children }: UserPageLayoutProps) => (
  <div className='flex flex-col min-h-screen'>
    <Nav />
    <h1 className='sr-only'>{title}</h1>

    <main className='flex flex-col items-center flex-1 w-full px-4 py-8'>
      <div className='bg-white rounded-xl shadow-lg p-6 w-full max-w-6xl'>{children}</div>
    </main>
  </div>
);

export { UserPageLayout };
