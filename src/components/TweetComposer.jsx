import React, { useState } from "react";
import api from "../api";
import PaperPlane from "./svg/PaperPlane";
import { useUser } from "../context/UserContext";

export default function TweetComposer({ onPosted }) {
  const { user } = useUser();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      await api.post("/tweets", { body: text });
      setText("");
      onPosted && onPosted();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-start gap-3 bg-white p-5 rounded-xl shadow mb-6">
      <div className="w-10 h-10 rounded-full overflow-clip">
        <img src={user?.profile_picture_url ?? import.meta.env.VITE_DEFAULT_AVATAR} alt="Profile" />
      </div>
      <form aria-label="tweet composer form" onSubmit={submit} className="flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening?"
          className="w-full p-3 bg-gray-100 rounded-xl h-24 text-sm resize-none"
          maxLength={280}
        />
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-gray-500">
            {280 - text.length} characters remaining
          </div>
          <button
            className="bg-black text-white py-2 px-4 text-sm cursor-pointer rounded-md flex justify-between"
            disabled={loading}
          >
            <PaperPlane />
            &nbsp; Tweet
          </button>
        </div>
      </form>
    </div>
  );
}
