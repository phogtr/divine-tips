"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

const delimiter = "";

/**
 * modified of https://buildui.com/recipes/use-animated-text
 *
 */
export const useAnimatedText = (text: string, speed = 60) => {
  const [cursor, setCursor] = useState(0);
  const [startingCursor, setStartingCursor] = useState(0);
  const [prevText, setPrevText] = useState(text);

  if (prevText !== text) {
    setPrevText(text);
    setStartingCursor(text.startsWith(prevText) ? cursor : 0);
  }

  useEffect(() => {
    const textLength = text.split(delimiter).length;

    const duration = textLength / Math.max(speed, 5);

    const controls = animate(startingCursor, textLength, {
      duration: duration,
      ease: "linear",
      onUpdate(latest) {
        setCursor(Math.floor(latest));
      },
    });

    return () => controls.stop();
  }, [startingCursor, text, speed]);

  return text.split(delimiter).slice(0, cursor).join(delimiter);
};
