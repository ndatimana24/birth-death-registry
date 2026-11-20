import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, isLoggedIn, logout } from "../services/auth";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&q=80",
    title: "Civil Registry System",
    subtitle: "A modern system for recording and managing citizen records",
  },
  {
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=1600&q=80",
    title: "Register a Birth",
    subtitle: "Record newborn children easily, quickly and accurately",
  },
  {
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80",
    title: "Register a Death",
    subtitle: "Store deceased persons' information completely and securely",
  },
  {
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
    title: "AI Verification",
    subtitle: "Artificial Intelligence validates data before saving",
  },
];

export default function Landing() {
  const [current, setCurrent] = useState(0);
  const user = getUser();
  const loggedIn = isLoggedIn();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (i) => setCurrent(i);
  const next = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardLink = user?.role === "ADMIN" ? "/admin" : "/dashboard";

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xl font-bold text-white">
          🇷🇼 <span className="hidden md:inline">Civil Registry</span>
          <span className="md:hidden">Registry</span>
        </div>

        {loggedIn ? (
          <div className="flex items-center gap-2">
            <Link
              to={dashboardLink}
              className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur hover:bg-white/30 text-white font-semibold transition text-sm"
            >
              📊 Dashboard
            </Link>
            <span className="text-white text-sm hidden sm:inline">
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
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition text-sm"
            >
              🚪 Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-2 md:gap-3">
            <Link
              to="/login"
              className="px-4 py-2 md:px-5 rounded-lg border-2 border-white text-white hover:bg-white hover:text-blue-800 font-semibold transition text-sm md:text-base"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 md:px-5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-semibold transition text-sm md:text-base"
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>

      {/* Slideshow */}
      <div className="relative h-screen w-full overflow-hidden">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        ))}

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
          <div className="text-7xl mb-4">📋</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {SLIDES[current].title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl">
            {SLIDES[current].subtitle}
          </p>

          {!loggedIn && (
            <div className="flex flex-col md:flex-row gap-4">
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-blue-800 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-lg"
              >
                🔓 Login
              </Link>
              <Link
                to="/signup"
                className="px-8 py-4 bg-yellow-400 text-blue-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transition shadow-lg"
              >
                ✍️ Create Account
              </Link>
            </div>
          )}
        </div>

        {/* Prev / Next */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur text-white text-3xl w-12 h-12 rounded-full flex items-center justify-center transition"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur text-white text-3xl w-12 h-12 rounded-full flex items-center justify-center transition"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-3 rounded-full transition ${
                i === current ? "bg-white w-8" : "bg-white/50 w-3"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-blue-900">
            Our Features
          </h2>
          <p className="text-center text-gray-600 mb-12">
            The system has many features to help you
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
              <div className="text-4xl mb-3">👶</div>
              <h3 className="text-xl font-bold mb-2 text-green-800">
                Register Birth
              </h3>
              <p className="text-gray-600 text-sm">
                Record newborn children easily. Save names, parents,
                birthplace and date.
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200">
              <div className="text-4xl mb-3">⚰️</div>
              <h3 className="text-xl font-bold mb-2 text-red-800">
                Register Death
              </h3>
              <p className="text-gray-600 text-sm">
                Store deceased persons' information. Add cause of death,
                place and date.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="text-xl font-bold mb-2 text-blue-800">
                AI Verification
              </h3>
              <p className="text-gray-600 text-sm">
                Artificial Intelligence validates data before saving.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-center">
        <p className="text-2xl mb-2">🇷🇼</p>
        <p className="font-bold text-white mb-1">Civil Registry System</p>
        <p className="text-sm">© 2026 — Rwanda</p>
      </footer>
    </div>
  );
}