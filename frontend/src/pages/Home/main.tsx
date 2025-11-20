import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">FoodTrack</h1>
      <p className="max-w-md text-center text-lg text-gray-600">
        Simple food purchase tracking system. Manage your grocery history and track monthly
        expenses.
      </p>
      <div className="flex gap-4">
        <Link
          to="/dashboard"
          className="rounded-md bg-blue-600 px-6 py-3 text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
