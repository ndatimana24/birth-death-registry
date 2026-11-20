import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../services/auth";

export default function Navbar() {
  const user = getUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardLink = user?.role === "ADMIN" ? "/admin" : "/dashboard";

  return (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          🇷🇼 <span className="hidden md:inline">Civil Registry</span>
          <span className="md:hidden">Registry</span>
        </Link>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/"
            className="hover:bg-blue-700 px-3 py-2 rounded-lg transition text-sm"
          >
            🏠 Home
          </Link>
          <Link
            to={dashboardLink}
            className="hover:bg-blue-700 px-3 py-2 rounded-lg transition text-sm"
          >
            📊 Dashboard
          </Link>
          <span className="text-sm">
            👤 <strong>{user?.username}</strong>{" "}
            <span
              className={`ml-1 px-2 py-0.5 rounded text-xs font-semibold ${
                user?.role === "ADMIN"
                  ? "bg-yellow-400 text-blue-900"
                  : "bg-blue-500"
              }`}
            >
              {user?.role}
            </span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            🚪 Logout
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl"
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-blue-900 px-4 py-3 space-y-2">
          <div className="text-sm pb-2 border-b border-blue-700">
            👤 <strong>{user?.username}</strong>{" "}
            <span
              className={`ml-1 px-2 py-0.5 rounded text-xs ${
                user?.role === "ADMIN"
                  ? "bg-yellow-400 text-blue-900"
                  : "bg-blue-500"
              }`}
            >
              {user?.role}
            </span>
          </div>
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block hover:bg-blue-700 px-3 py-2 rounded-lg transition"
          >
            🏠 Home
          </Link>
          <Link
            to={dashboardLink}
            onClick={() => setMenuOpen(false)}
            className="block hover:bg-blue-700 px-3 py-2 rounded-lg transition"
          >
            📊 Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg font-semibold transition"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </nav>
  );
}