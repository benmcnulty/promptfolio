// app/time/page.tsx
"use client";
import React from "react";

const TimePage = () => {
  const [time, setTime] = React.useState("");

  const updateTime = async () => {
    try {
      const response = await fetch("/api/time");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTime(data.time);
    } catch (error) {
      console.error("There was an error updating the time:", error);
    }
  };

  return (
    <div>
      <div>Server time: {time}</div>
      <button onClick={updateTime}>Update Time</button>
    </div>
  );
};

export default TimePage;
