// app/time/page.tsx
"use client";
import React, { useState } from "react";
import Layout from "./layout";

const TimePage = () => {
  const [time, setTime] = useState("");

  const updateTime = async () => {
    try {
      const response = await fetch("/api/time");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const formattedTime = new Date(data.time).toLocaleTimeString();
      setTime(formattedTime);
    } catch (error) {
      console.error("There was an error updating the time:", error);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h2 className="text-xl font-semibold">Server Time:</h2>
        <div className="text-lg p-2 border border-gray-300 rounded w-1/3 text-center bg-gray-100">
          {time || "Awaiting time..."}
        </div>
        <button
          onClick={updateTime}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        >
          Update Time
        </button>
      </div>
    </Layout>
  );
};

export default TimePage;
