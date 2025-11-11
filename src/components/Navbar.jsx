import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logout from "./svg/Logout";
import { useUser } from "../context/UserContext";

export default function Navbar() {

  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } finally {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="bg-white py-4 px-10 flex justify-between items-center">
      <Link to="/" className="text-2xl poppins-bold">
        MiniTweet
      </Link>
      <div className="flex items-center gap-10">
        <Link to="/profile">
          <div className="w-10 h-10 rounded-full overflow-clip">
            <img
              src={
                user?.profile_picture_url ?? import.meta.env.VITE_DEFAULT_AVATAR
              }
              alt="Profile"
            />
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center poppins-medium cursor-pointer"
        >
          <Logout />
          &nbsp; Logout
        </button>
      </div>
    </div>
  );
}
