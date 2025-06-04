"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleJoin = (room: string) => {
    if (!username.trim()) return alert("Please enter your username");
    router.push(`/room/${room}?username=${encodeURIComponent(username)}`);
  };

  return (
    <div>
      <main className="flex flex-col gap-5 w-full h-screen items-center  justify-center bg-gray-900">
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-3 border border-white rounded-xl"
        />

        <button
          onClick={() => handleJoin("general")}
          className="w-36 text-white border border-white rounded-xl py-3 hover:bg-gray-700 hover:text-white cursor-pointer transition-all ease-in-out"
        >
          General
        </button>

        <button
          onClick={() => handleJoin("movies")}
          className="w-36 text-white border border-white rounded-xl py-3 hover:bg-gray-700 hover:text-white cursor-pointer transition-all ease-in-out"
        >
          Movies
        </button>
      </main>
    </div>
  );
}
