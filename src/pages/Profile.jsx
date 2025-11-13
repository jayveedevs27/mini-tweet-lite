import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { useUser } from "../context/UserContext";

export default function ProfilePage() {
  const { user, setUser, updateUser } = useUser();
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const DEFAULT_AVATAR = import.meta.env.VITE_AVATAR || "/default-avatar.png";

  useEffect(() => {
    async function fetchUser() {
      try {
        await updateUser();
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }
    fetchUser();
  }, []);

  if (!user)
    return (
      <div className="text-center mt-10 text-gray-600">Loading profile...</div>
    );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select an image");

    const formData = new FormData();
    formData.append("profile_picture", selectedFile);

    try {
      const { data } = await api.post("/profile/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const returnedUrl =
        data.profile_picture_url ??
        data.url ??
        data.path ??
        data.profile_picture ??
        null;

      let normalizedUrl = returnedUrl;
      if (returnedUrl && !/^https?:\/\//i.test(returnedUrl)) {
        const apiBase =
          import.meta.env.VITE_API_BASE_URL ||
          "http://mini-tweet-lite-api.test/api";
        normalizedUrl = returnedUrl.startsWith("/")
          ? `${apiBase}${returnedUrl}`
          : `${apiBase}/storage/${returnedUrl}`;
      }

      setUser((prev) => ({
        ...prev,
        profile_picture_url:
          normalizedUrl || prev.profile_picture_url || DEFAULT_AVATAR,
      }));

      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
      setPreview(null);
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image.");
    } finally {

    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put("/profile/update", {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: password || undefined,
      });
      alert("Profile updated successfully!");
      setPassword("");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile.");
    } finally {

    }
  };

  const getAvatar = (previewUrl, userObj) =>
    previewUrl || userObj?.profile_picture_url || DEFAULT_AVATAR;

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
              src={getAvatar(preview, user)}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
            />

            <form onSubmit={handleUpload} className="mt-4 text-center flex flex-col items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 px-4 py-2 text-xs text-center bg-gray-300 rounded-xl cursor-pointer"
              />
              <button
                type="submit"
                className="mt-2 px-4 py-2 text-xs bg-black text-white rounded-2xl cursor-pointer"
              >
                Upload Picture
              </button>
            </form>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3">
            <input
              type="text"
              value={user.first_name}
              onChange={(e) => setUser({ ...user, first_name: e.target.value })}
              placeholder="Firstname"
              className="w-full px-4 py-4 rounded-2xl text-base bg-gray-100"
            />

            <input
              type="text"
              value={user.last_name}
              onChange={(e) => setUser({ ...user, last_name: e.target.value })}
              placeholder="Surname"
              className="w-full px-4 py-4 rounded-2xl text-base bg-gray-100"
            />

            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Email Address"
              className="w-full px-4 py-4 rounded-2xl text-base bg-gray-100"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password (optional)"
              className="w-full px-4 py-4 rounded-2xl text-base bg-gray-100"
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-2xl mt-6 cursor-pointer"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
