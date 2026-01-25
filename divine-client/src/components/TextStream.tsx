"use client";

import { useAnimatedText } from "@/lib/hooks/useAnimatedText";

interface TextStreamProps {
  text: string;
  className?: string;
  speed?: number;
  elem?: "em" | "li";
}

export const TextStream: React.FC<TextStreamProps> = ({
  text,
  className,
  speed = 60,
  elem,
}) => {
  const content = useAnimatedText(text, speed);

  switch (elem) {
    case "em": {
      return <em className={className}>{content}</em>;
    }

    case "li": {
      return <li className={className}>{content}</li>;
    }

    default: {
      return <div className={className}>{content}</div>;
    }
  }
};
