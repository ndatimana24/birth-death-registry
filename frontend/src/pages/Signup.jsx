import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/api";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
    role: "USER",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};

    if (!form.username.trim()) {
      errs.username = "Username is required";
    } else if (form.username.trim().length < 3) {
      errs.username = "Username must be at least 3 characters";
    }

    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Invalid email format";
    }

    if (!form.password) {
      errs.password = "Password is required";
    } else if (form.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    } else if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      errs.password = "Password must contain at least 1 letter and 1 number";
    }

    if (!form.confirm) {
      errs.confirm = "Please confirm your password";
    } else if (form.password !== form.confirm) {
      errs.confirm = "Passwords do not match";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await signup({
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      });
      alert(`✅ ${form.role} account created successfully! Please login.`);
      navigate("/login");
    } catch (err) {
      const msg =
        err.response?.data?.error || err.message || "Something went wrong";
      alert("❌ " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-700 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">📝</div>
          <h1 className="text-2xl font-bold text-blue-800">Sign Up</h1>
          <p className="text-gray-500 text-sm">Create a new account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "USER" })}
                className={`py-3 rounded-lg border-2 font-semibold transition ${
                  form.role === "USER"
                    ? "border-blue-600 bg-blue-50 text-blue-800"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                👤 USER
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "ADMIN" })}
                className={`py-3 rounded-lg border-2 font-semibold transition ${
                  form.role === "ADMIN"
                    ? "border-yellow-500 bg-yellow-50 text-yellow-800"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                🛡️ ADMIN
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="your_username"
              className={`w-full border p-3 rounded-lg ${
                errors.username ? "border-red-500" : ""
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">⚠️ {errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.com"
              className={`w-full border p-3 rounded-lg ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">⚠️ {errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="at least 6 characters"
              className={`w-full border p-3 rounded-lg ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">⚠️ {errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              placeholder="confirm your password"
              className={`w-full border p-3 rounded-lg ${
                errors.confirm ? "border-red-500" : ""
              }`}
            />
            {errors.confirm && (
              <p className="text-red-500 text-xs mt-1">⚠️ {errors.confirm}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              form.role === "ADMIN"
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-green-600 hover:bg-green-700"
            } ${loading ? "opacity-50" : ""}`}
          >
            {loading ? "⏳ Loading..." : `✅ Sign Up as ${form.role}`}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Login
          </Link>
        </p>

        <p className="text-center mt-2 text-sm text-gray-600">
          <Link to="/" className="text-gray-500 hover:underline">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}