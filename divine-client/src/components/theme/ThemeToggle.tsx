"use client";

import { useState } from "react";
import { useTheme } from "next-themes";

import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [icon, setIcon] = useState(<Moon />);

  const onClickButton = () => {
    switch (theme) {
      case "light":
        setTheme("dark");
        setIcon(<Moon />);
        break;
      case "dark":
        setTheme("light");
        setIcon(<Sun />);
        break;

      default:
        break;
    }
  };

  return (
    <button onClick={onClickButton} className="cursor-pointer">
      {icon}
    </button>
  );
};
