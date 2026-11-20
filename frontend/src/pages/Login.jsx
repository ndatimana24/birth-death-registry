import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { saveUser } from "../services/auth";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = "Username is required";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await login(form);
      saveUser(res.data);
      alert("✅ Login successful!");
      navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.error || err.message || "Something went wrong";
      alert("❌ " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-800 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🇷🇼</div>
          <h1 className="text-2xl font-bold text-blue-800">
            Civil Registry
          </h1>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-semibold mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="admin"
              className={`w-full border p-3 rounded-lg ${
                errors.username ? "border-red-500" : ""
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">⚠️ {errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="admin123"
              className={`w-full border p-3 rounded-lg ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">⚠️ {errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition ${
              loading ? "opacity-50" : ""
            }`}
          >
            {loading ? "⏳ Loading..." : "🔓 Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>

        <p className="text-center mt-2 text-sm text-gray-600">
          <Link to="/" className="text-gray-500 hover:underline">
            ← Back to Home
          </Link>
        </p>

        <div className="mt-6 p-3 bg-blue-50 rounded text-xs text-blue-800">
          <strong>Default Admin:</strong>
          <br />
          Username: <code>admin</code> | Password: <code>admin123</code>
        </div>
      </div>
    </div>
  );
}