import React, { useState } from "react";
import api from "../api";

export default function TweetComposer({ onPosted }) {
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
    <form
      aria-label="tweet composer form"
      onSubmit={submit}
      className="bg-white p-4 rounded shadow mb-6"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's happening?"
        className="w-full p-3 bg-gray-100 rounded h-24 resize-none"
        maxLength={280}
      />
      <div className="flex justify-between items-center mt-2">
        <div className="text-sm text-gray-500">
          {280 - text.length} characters remaining
        </div>
        <button
          className="bg-black text-white py-2 px-4 rounded"
          disabled={loading}
        >
          Tweet
        </button>
      </div>
    </form>
  );
}
