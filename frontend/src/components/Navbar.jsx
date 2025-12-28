import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between">
      <Link to="/" className="text-xl font-bold text-blue-600">
        PriceCompare
      </Link>

      <div className="flex gap-4">
        <Link to="/login" className="hover:text-blue-600">Login</Link>
        <Link to="/register" className="hover:text-blue-600">Register</Link>
      </div>
    </nav>
  );
}
