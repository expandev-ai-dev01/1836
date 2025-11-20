import { Outlet } from 'react-router-dom';

export const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
