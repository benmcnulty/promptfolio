// components/Time.tsx
"use client";
import { useState } from "react";

export const Time = () => {
  const [serverTime, setServerTime] = useState("");
  const [localTime, setLocalTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateTime = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/time");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setServerTime(new Date(data.time).toLocaleTimeString());
      setLocalTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("There was an error updating the time:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h2 className="text-3xl font-semibold tracking-tight text-foreground text-shadow">
        Time API
      </h2>
      <div className="space-y-4 w-full max-w-md px-4">
        <div>
          <label className="font-semibold text-lg block text-center mb-2 text-foreground text-shadow">
            Server
          </label>
          <div className="text-lg p-4 border border-gray-300 rounded min-w-[300px] text-center bg-gray-100 text-primary">
            {serverTime || "Awaiting server time..."}
          </div>
        </div>
        <div>
          <label className="font-semibold text-lg block text-center mb-2 text-foreground text-shadow">
            Local
          </label>
          <div className="text-lg p-4 border border-gray-300 rounded min-w-[300px] text-center bg-gray-100 text-primary">
            {localTime || "Awaiting local time..."}
          </div>
        </div>
      </div>
      <button
        onClick={updateTime}
        className="px-4 py-2 rounded focus:outline-none text-white
           bg-primary hover:bg-secondary transition-colors"
        disabled={isLoading}
        style={{ minWidth: "150px" }}
      >
        {isLoading ? "Loading..." : "Update Time"}
      </button>
    </div>
  );
};

export default Time;
