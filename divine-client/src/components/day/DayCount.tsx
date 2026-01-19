"use client";

import { useEffect, useState } from "react";

import { useLocalStorage } from "@/hooks/useLocalStorage";

import { UserData } from "@/types/user.type";

interface DayCountProps {
  isAnimated: boolean;
}

export const DayCount: React.FC<DayCountProps> = ({ isAnimated }) => {
  const {
    data: userData,
    setData: setUserData,
    isHydrated: isUserDataHydrate,
  } = useLocalStorage<UserData | null>("user", null);

  const [animateState, setAnimateState] = useState({
    transform: "translate(0)",
    opacity: 1,
  });

  useEffect(() => {
    if (isAnimated) {
      setTimeout(() => {
        setAnimateState((prev) => ({
          ...prev,
          transform: "translate(-50%)",
          opacity: 0,
        }));

        setTimeout(() => {
          if (isUserDataHydrate && userData !== null) {
            setUserData({
              ...userData,
              day: userData.day + 1,
            });
          }

          setAnimateState((prev) => ({
            ...prev,
            transform: "translate(0)",
            opacity: 1,
          }));
        }, 500);
      }, 300);
    }
  }, [isAnimated, isUserDataHydrate, userData]);

  if (isUserDataHydrate && userData !== null) {
    return (
      <div
        className="px-4 py-1 text-2xl duration-300 ease-out"
        style={animateState}
      >
        Day {userData.day}
      </div>
    );
  }

  return null;
};
