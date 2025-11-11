import React, { useState } from "react";
import api from "../api";
import { timeAgo } from "../utils/timeAgo";

export default function TweetCard({ tweet, onLikeToggle }) {
  const [liked, setLiked] = useState(tweet.liked_by_me || false);
  const [likesCount, setLikesCount] = useState(tweet.likes_count || 0);

  async function toggle() {
    try {
      const { data } = await api.post(`/tweets/${tweet.id}/like`);
      setLiked(data.liked);
      setLikesCount(
        data.likes_count ??
          (data.liked ? likesCount + 1 : Math.max(0, likesCount - 1))
      );
      onLikeToggle && onLikeToggle(tweet.id, data.liked);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full overflow-clip">
          <img
            src={
              tweet.user.profile_picture ?? import.meta.env.VITE_DEFAULT_PROFILE_PICTURE
            }
            alt="Profile"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div className="text-sm font-semibold">
              {tweet.user.first_name} {tweet.user.last_name}
            </div>
            <div className="text-xs text-gray-400">
              {timeAgo(tweet.created_at)}
            </div>
          </div>
          <p className="mt-2 text-sm leading-6">{tweet.body}</p>
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
            <button onClick={toggle} className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${
                  liked ? "text-red-500" : "text-gray-400"
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.343 3.172 11.07a4 4 0 010-5.657z" />
              </svg>
              <span>{likesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
