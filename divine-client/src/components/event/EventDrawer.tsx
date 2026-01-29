"use client";

import { useState } from "react";

import { EventDrawerContent } from "./EventDrawerContent";

import { useQueryEvent } from "@/hooks/useQueryEvent";

import { Triangle } from "lucide-react";

interface EventDrawerProps {
  startFetchEventData: boolean;
}

export const EventDrawer: React.FC<EventDrawerProps> = ({
  startFetchEventData,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: eventData } = useQueryEvent({
    isEnable: startFetchEventData,
  });

  return (
    <>
      <button
        className="h-10 w-10 bg-accent-900 cursor-pointer rounded-tl-sm rounded-bl-sm"
        style={{
          transform: isOpen ? "translate(-384px)" : "translate(0)",
          // sync w/ drawer animation
          transition: "transform .5s cubic-bezier(.32, .72, 0, 1)",
          animationDuration: "0.5s",
          animationTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Triangle
          className="relative left-3 fill-accent-500 stroke-accent-500 duration-250 ease-in"
          size={16}
          style={{
            rotate: isOpen ? "90deg" : "270deg",
          }}
        />
      </button>

      <EventDrawerContent
        data={eventData}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
};
