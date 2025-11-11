import React, { useState } from "react";
import api from "../api";
import { timeAgo } from "../utils/timeAgo";
import Heart from "./svg/Heart";

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
    <div className="bg-white p-5 rounded-xl shadow mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full overflow-clip">
          <img
            src={
              tweet.user.profile_picture ??
              import.meta.env.VITE_DEFAULT_PROFILE_PICTURE
            }
            alt="Profile"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div className="text-sm inter-semibold">
              {tweet.user.first_name} {tweet.user.last_name}
            </div>
            <div className="text-sm inter-regular text-gray-400">
              {timeAgo(tweet.created_at)}
            </div>
          </div>
          <p className="mt-2 text-base inter-regular">{tweet.body}</p>
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
            <button
              onClick={toggle}
              className="flex items-center cursor-pointer gap-2"
            >
              {liked ? (
                <Heart width={20} height={18} strokeColor="red" fillColor="red" />
              ) : (
                <Heart width={20} height={18} strokeColor="black" fillColor="none" />
              )}

              <span className="inter-semibold text-sm">{likesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
