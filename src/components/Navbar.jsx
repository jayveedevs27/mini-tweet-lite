import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logout from "./svg/Logout";

export default function Navbar() {

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="bg-white py-4 px-10 flex justify-between items-center">
      <Link to="/" className="text-2xl poppins-bold">
        MiniTweet
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/profile">
          Profile
        </Link>
        <button onClick={handleLogout} className="flex items-center cursor-pointer">
          <Logout />&nbsp;
          Logout
        </button>
      </div>
    </div>
  );
}
