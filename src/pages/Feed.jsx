import React, { useEffect, useState } from "react";
import api from "../api";
import TweetComposer from "../components/TweetComposer";
import TweetCard from "../components/TweetCard";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Feed() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/tweets");
      setTweets(data.data || data); // handle resource collection or raw
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen">

      <Navbar />

      <div className="max-w-lg mx-auto grid grid-cols-1 gap-6 mt-8">
        <div className="col-span-1">
          <TweetComposer onPosted={load} />

          {loading && (
            <div className="text-center text-gray-500">Loading...</div>
          )}

          {!loading && tweets.map((t) => <TweetCard key={t.id} tweet={t} />)}
        </div>
      </div>
    </div>
  );
}
