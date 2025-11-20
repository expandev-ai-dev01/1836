import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-xl text-gray-600">Page not found</p>
      <Link to="/" className="mt-8 text-blue-600 hover:underline">
        Return Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
