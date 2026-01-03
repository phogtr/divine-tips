import type { Dispatch, SetStateAction } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { EventContent } from "./EventContent";

import { EventApiData } from "@/types/event.type";

interface EventDrawerContentProps {
  data: EventApiData[] | undefined;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

// key is index, api data is already sorted
const labelMap: Record<number, string> = {
  0: "Tomorrow",
  1: "Today",
  2: "Yesterday",
};

export const EventDrawerContent: React.FC<EventDrawerContentProps> = ({
  data,
  isOpen,
  setIsOpen,
}) => {
  if (!data) {
    return null;
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
      <DrawerContent>
        <VisuallyHidden>
          <DrawerHeader>
            <DrawerTitle>Event Information</DrawerTitle>
          </DrawerHeader>
        </VisuallyHidden>

        <div className="px-6 pb-8">
          {data.map(({ id, data }, idx) => (
            <div
              key={id}
              className="max-w-2xl p-4 mt-8 border border-white rounded"
            >
              <h2 className="text-xl">{labelMap[idx]}</h2>

              {data.map((d) => (
                <EventContent key={d.type} data={d} maxWidth="55%" />
              ))}
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
