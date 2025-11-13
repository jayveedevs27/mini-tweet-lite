import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { useUser } from "../context/UserContext";

const DEFAULT_AVATAR = import.meta.env.VITE_AVATAR || "/default-avatar.png";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://mini-tweet-lite-api.test/api";

export default function ProfilePage() {
  const { user, setUser, updateUser } = useUser();
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    updateUser().catch((err) => console.error("Failed to load profile:", err));
  }, [updateUser]);

  if (!user) {
    return (
      <div className="text-center mt-10 text-gray-600">Loading profile...</div>
    );
  }

  const normalizeImageUrl = (url) => {
    if (!url || /^https?:\/\//i.test(url)) return url;
    return url.startsWith("/") ? `${API_BASE_URL}${url}` : `${API_BASE_URL}/storage/${url}`;
  };

  const extractImageUrl = (response) => {
    return response.profile_picture_url ?? response.url ?? response.path ?? response.profile_picture ?? null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select an image");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("profile_picture", selectedFile);

      const { data } = await api.post("/profile/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = normalizeImageUrl(extractImageUrl(data));
      
      setUser((prev) => ({
        ...prev,
        profile_picture_url: imageUrl || prev.profile_picture_url || DEFAULT_AVATAR,
      }));

      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
      setPreview(null);
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put("/profile/update", {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        ...(password && { password }),
      });
      alert("Profile updated successfully!");
      setPassword("");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const getAvatar = () => preview || user.profile_picture_url || DEFAULT_AVATAR;

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <div className="w-full max-w-lg bg-white p-8 rounded-2xl">
          <h2 className="text-center text-3xl font-bold mb-10 poppins-bold">
            My Profile
          </h2>

          <div className="flex flex-col items-center mb-8">
            <img
              src={getAvatar()}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
            />

            <form onSubmit={handleUpload} className="mt-4 text-center flex flex-col items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading}
                className="mt-2 px-4 py-2 text-xs text-center bg-gray-300 rounded-xl cursor-pointer disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 px-4 py-2 text-xs bg-black text-white rounded-2xl cursor-pointer disabled:opacity-50"
              >
                {isLoading ? "Uploading..." : "Upload Picture"}
              </button>
            </form>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3">
            <input
              type="text"
              value={user.first_name}
              onChange={(e) => setUser({ ...user, first_name: e.target.value })}
              placeholder="Firstname"
              disabled={isLoading}
              className="w-full px-4 py-4 rounded-2xl text-base bg-gray-100 disabled:opacity-50"
            />

            <input
              type="text"
              value={user.last_name}
              onChange={(e) => setUser({ ...user, last_name: e.target.value })}
              placeholder="Surname"
              disabled={isLoading}
              className="w-full px-4 py-4 rounded-2xl text-base bg-gray-100 disabled:opacity-50"
            />

            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Email Address"
              disabled={isLoading}
              className="w-full px-4 py-4 rounded-2xl text-base bg-gray-100 disabled:opacity-50"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password (optional)"
              disabled={isLoading}
              className="w-full px-4 py-4 rounded-2xl text-base bg-gray-100 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-4 rounded-2xl mt-6 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
