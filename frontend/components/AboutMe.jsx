import React, { useState, useEffect } from "react";

export default function AboutMe() {
  const text = "Hi, I'm Steven Liu, a passionate 111111.";
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return <h1>{displayed}|</h1>;
}
