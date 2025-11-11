import React, { useState } from "react";
import api from "../api";
import { timeAgo } from "../utils/timeAgo";
import Heart from "./svg/Heart";

export default function TweetCard({ tweet, onLikeToggle }) {
  const [liked, setLiked] = useState(tweet.liked_by_me || false);

  async function toggle() {
    try {
      const { data } = await api.post(`/tweets/${tweet.id}/like`);
      setLiked(data.liked);
      onLikeToggle && onLikeToggle(tweet.id, data.liked);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full overflow-clip">
          <img src={tweet.user.profile_picture_url} alt="Profile" />
        </div>
        <div className="flex-1">
          <div>
            <div className="text-sm inter-semibold">
              {tweet.user.first_name} {tweet.user.last_name}
            </div>
            <div className="text-xs inter-regular">
              {timeAgo(tweet.created_at)}
            </div>
          </div>
        </div>
      </div>
      <p className="mt-2 text-base inter-regular">{tweet.body}</p>
      <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
        <button
          onClick={toggle}
          className="flex items-center cursor-pointer gap-2"
        >
          {liked ? <Heart strokeColor="red" fillColor="red" /> : <Heart />}

          <span className="inter-semibold text-sm">
            {tweet.likes_count || 0}
          </span>
        </button>
      </div>
    </div>
  );
}
