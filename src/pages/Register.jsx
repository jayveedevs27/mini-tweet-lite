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
      <div className="w-full max-w-lg bg-white p-8">
        <h2 className="text-center text-3xl poppins-bold mb-10">
          Sign up with Email
        </h2>

        <form onSubmit={submit} className="space-y-3">
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Firstname"
            className="w-full px-4 py-4 rounded-2xl text-base bg-gray-100"
          />
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Surname"
            className="w-full px-4 py-4 rounded-2xl text-base bg-gray-100"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            type="email"
            className="w-full px-4 py-4 rounded-2xl text-base bg-gray-100"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full px-4 py-4 rounded-2xl text-base bg-gray-100"
          />

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button className="w-full bg-black text-white py-4 rounded-2xl mt-10">
            Create Account
          </button>

          <div className="text-center text-sm text-gray-500">
            By signing up you agree to our Terms & Conditions.
          </div>

          <div className="block text-center text-sm text-gray-500 mt-10">
              Have an account already?{" "}
              <Link to="/login" className="text-black">
                Log in
              </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
