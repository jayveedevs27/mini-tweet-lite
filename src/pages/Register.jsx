import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await api.post("/register", {
        first_name: firstName,
        last_name: lastName,
        email,
        password
      });
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-center font-semibold mb-4">Sign up with Email</h2>

        <form onSubmit={submit} className="space-y-3">
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Firstname"
            className="w-full px-4 py-2 rounded bg-gray-100"
          />
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Lastname"
            className="w-full px-4 py-2 rounded bg-gray-100"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            type="email"
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

          <button className="w-full bg-black text-white py-2 rounded">
            Create Account
          </button>

          <div className="text-center text-xs text-gray-500">
            By signing up you agree to our Terms & Conditions.
          </div>

          <Link to="/login" className="block text-center text-sm text-gray-600">
            Have an account already? Log in
          </Link>
        </form>
      </div>
    </div>
  );
}
