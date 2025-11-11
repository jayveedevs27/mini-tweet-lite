import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await api.post("/login", { email, password });
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-center font-semibold mb-4">Welcome to MiniTweet</h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Connect with friends in 280 characters or less
        </p>

        <form onSubmit={submit} className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email or username"
            className="w-full px-4 py-2 rounded bg-gray-100"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full px-4 py-2 rounded bg-gray-100"
          />

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button className="w-full bg-black text-white py-2 rounded cursor-pointer">
            Log in
          </button>
          <Link
            to="/register"
            className="block text-center border rounded py-2 cursor-pointer"
          >
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
}
