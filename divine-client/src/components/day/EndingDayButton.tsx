"use client";

import { useEffect, useState } from "react";
import { Hourglass } from "lucide-react";

interface EndingDayButtonProps {
  onClickEndDay: () => void;
  isAnimated: boolean;
  completedCallback: (state: boolean) => void;
}

export const EndingDayButton: React.FC<EndingDayButtonProps> = ({
  onClickEndDay,
  isAnimated,
  completedCallback,
}) => {
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    if (isAnimated) {
      if (rotate === 0) {
        setRotate(180);
      } else if (rotate === 180) {
        setRotate(0);
      }
      completedCallback(false);
    }
  }, [isAnimated]);

  return (
    <button onClick={onClickEndDay}>
      <Hourglass
        className="scale-300 sm:scale-400 cursor-pointer text-yellow-1 duration-750 ease-linear"
        style={{
          rotate: "20deg",
          transform: `rotateX(${rotate}deg)`,
        }}
      />
    </button>
  );
};
