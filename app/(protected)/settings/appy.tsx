"use client";
import React from "react";
import { useStore } from "zustand";
import { useCounterState } from "@/store/use-counter-state";

const App = () => {
  const { value, increment, color, setColor } = useStore(
    useCounterState,
    (state) => state
  );
  const [inputColor, setInputColor] = React.useState(""); // State to hold input field value

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setColor(inputColor); // Set color using input field value
    setInputColor(""); // Clear input field after setting color
  };

  return (
    <div>
      <h1>Zustand Persist State - NextJS</h1>
      <h1>{value}</h1>
      <h1>{color}</h1>
      <button onClick={increment}>Increment</button>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputColor}
          onChange={(e) => setInputColor(e.target.value)}
          placeholder="Enter color"
        />
        <button type="submit">Set Color</button>
      </form>
    </div>
  );
};

export default App;
