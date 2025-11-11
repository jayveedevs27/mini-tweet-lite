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
                <svg
                  width="18"
                  height="16"
                  viewBox="0 0 18 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.31804 1.31804C0.900169 1.7359 0.568697 2.23198 0.342547 2.77795C0.116398 3.32392 0 3.90909 0 4.50004C0 5.09099 0.116398 5.67616 0.342547 6.22213C0.568697 6.7681 0.900169 7.26417 1.31804 7.68204L9.00004 15.364L16.682 7.68204C17.526 6.83812 18.0001 5.69352 18.0001 4.50004C18.0001 3.30656 17.526 2.16196 16.682 1.31804C15.8381 0.47412 14.6935 1.1453e-05 13.5 1.14441e-05C12.3066 1.14352e-05 11.162 0.47412 10.318 1.31804L9.00004 2.63604L7.68204 1.31804C7.26417 0.900169 6.7681 0.568697 6.22213 0.342547C5.67616 0.116398 5.09099 0 4.50004 0C3.90909 0 3.32392 0.116398 2.77795 0.342547C2.23198 0.568697 1.7359 0.900169 1.31804 1.31804Z"
                    fill="#D72600"
                  />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="18"
                  viewBox="0 0 20 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.31804 2.31804C1.90017 2.7359 1.5687 3.23198 1.34255 3.77795C1.1164 4.32392 1 4.90909 1 5.50004C1 6.09099 1.1164 6.67616 1.34255 7.22213C1.5687 7.7681 1.90017 8.26417 2.31804 8.68204L10 16.364L17.682 8.68204C18.526 7.83812 19.0001 6.69352 19.0001 5.50004C19.0001 4.30656 18.526 3.16196 17.682 2.31804C16.8381 1.47412 15.6935 1.00001 14.5 1.00001C13.3066 1.00001 12.162 1.47412 11.318 2.31804L10 3.63604L8.68204 2.31804C8.26417 1.90017 7.7681 1.5687 7.22213 1.34255C6.67616 1.1164 6.09099 1 5.50004 1C4.90909 1 4.32392 1.1164 3.77795 1.34255C3.23198 1.5687 2.7359 1.90017 2.31804 2.31804Z"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              )}

              <span className="inter-semibold text-sm">{likesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
