import { Link } from 'react-router-dom';

const ErrorPage = ({ message = 'An unexpected error occurred.' }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <h1 className="text-3xl font-bold text-[#EF7B24] mb-4">Error</h1>
    <p className="text-lg text-gray-700 mb-6">{message}</p>
    <Link to="/" className="text-[#0B7582] hover:underline">Go to Home</Link>
  </div>
);

export default ErrorPage;
