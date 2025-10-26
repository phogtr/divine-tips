"use client";

import { useCallback, useEffect, useState } from "react";

interface TextStreamProps {
  text: string;
  delay?: number;
  className?: string;
}

export const TextStream: React.FC<TextStreamProps> = ({
  text,
  delay = 0,
  className,
}) => {
  const [content, setContent] = useState("");

  const [tokens, setTokens] = useState<string[]>([]);
  const [tokenIdx, setTokenIdx] = useState(0);

  const [isDelay, setIsDelay] = useState(delay > 0 ? true : false);

  const textToTokens = useCallback((text: string): string[] => {
    const tokens: string[] = [];
    let i = 0;

    while (i < text.length) {
      const chunkSize = Math.floor(Math.random() * 2) + 3; // Random size between 3-4
      tokens.push(text.slice(i, i + chunkSize));
      i += chunkSize;
    }
    return tokens;
  }, []);

  if (delay > 0) {
    setTimeout(() => {
      setIsDelay(false);
    }, delay);
  }

  useEffect(() => {
    const tok = textToTokens(text);
    setTokens(tok);
    setContent("");
    setTokenIdx(0);
  }, [textToTokens]);

  useEffect(() => {
    if (isDelay || tokenIdx >= tokens.length) {
      return;
    }

    const timer = setTimeout(() => {
      setContent((prev) => prev + tokens[tokenIdx]);
      setTokenIdx((prev) => prev + 1);
    }, 25); // Fast interval since streaming smaller chunks

    return () => clearTimeout(timer);
  }, [isDelay, tokenIdx, tokens]);

  if (isDelay) {
    return null;
  }

  return <div className={className}>{content}</div>;
};
