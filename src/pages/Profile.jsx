import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Profile() {
  const [user, setUser] = useState({
    name: "Jayvee Salango",
    email: "jayvee@example.com",
    profile_picture: import.meta.env.VITE_DEFAULT_PROFILE_PICTURE, // default
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/profile/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUser((prev) => ({ ...prev, profile_picture: response.data.url }));
      setPreview(null);
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

    return (
      <>
        <Navbar />
        <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Profile</h2>
          <div className="flex flex-col items-center space-y-3">
            <img
              src={preview || user.profile_picture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
            />
            <h3 className="text-lg font-medium">{user.name}</h3>
            <p className="text-gray-500">{user.email}</p>

            <form onSubmit={handleUpload} className="mt-4 w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 border rounded-lg cursor-pointer"
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload New Picture"}
              </button>
            </form>
          </div>
        </div>
      </>
    );
}
