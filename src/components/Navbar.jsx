import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="bg-white p-4 flex justify-between items-center shadow">
      <div className="font-bold">MiniTweet</div>
      <div className="flex items-center gap-4">
        <Link to="/profile" className="text-sm">
          Profile
        </Link>
        <button onClick={handleLogout} className="text-sm cursor-pointer">
          Logout
        </button>
      </div>
    </div>
  );
}
