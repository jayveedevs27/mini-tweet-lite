import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useUser } from "../context/UserContext";

export default function Login() {
  const { updateUser } = useUser();
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
      await updateUser();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-lg bg-white p-8">
        <h2 className="text-center text-3xl poppins-bold mb-3">
          Welcome to MiniTweet
        </h2>
        <p className="text-center text-base mb-10">
          Connect with friends in 280 characters or less
        </p>

        <form onSubmit={submit} className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email or username"
            className="w-full px-4 py-4 rounded-2xl text-base bg-gray-100"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full px-4 py-4 rounded-2xl text-base bg-gray-100"
          />

          {error && <div className="text-red-500 poppins-regular text-sm">{error}</div>}

          <button className="w-full bg-black text-white text-base py-4 rounded-2xl cursor-pointer mt-10">
            Log in
          </button>
          <Link
            to="/register"
            className="block text-center text-base border rounded-2xl py-4 cursor-pointer"
          >
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
}
