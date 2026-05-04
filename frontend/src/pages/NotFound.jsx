import { Link } from "react-router";

function NotFound() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-primary">404</p>
        <h1 className="text-2xl font-semibold mt-2">Page not found</h1>
        <p className="mt-2 text-base-content/70">
          The page you are looking for does not exist.
        </p>
        <Link to="/" className="btn btn-primary mt-6">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
