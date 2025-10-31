"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { SideItems } from "./SideItems";
import { ItemCard } from "./ItemCard";

import { TextStream } from "./TextStream";

import { ItemApiData } from "@/types/item.type";
import { EventApiData } from "@/types/event.type";

interface ItemContainerProps {
  itemApiData: ItemApiData[];
}

const text1 = "Lorem ipsum dolor sit, amet consectetur adipisicing.";
const text2 =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus, debitis.";
const text3 =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur perspiciatis iure cum pariatur cumque itaque explicabo eaque ipsa, soluta magni ullam enim et dignissimos ex placeat, doloribus asperiores, veniam amet!";
const text4 =
  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea quisquam tempora voluptas optio, voluptates adipisci!";

export const ItemContainer: React.FC<ItemContainerProps> = ({
  itemApiData,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [input, setInput] = useState("");

  const [eventDialog, setEventDialog] = useState(false);

  const [renderMap, setRenderMap] = useState<Record<number, boolean>>(() =>
    itemApiData.reduce(
      (acc, val) => ({
        ...acc,
        [val.id]: false,
      }),
      {}
    )
  );
  const [isToggleAll, setIsToggleAll] = useState(false);

  const { isPending, data: eventApiData } = useQuery({
    queryKey: ["event"],
    queryFn: fetchEventData,
  });

  const onClickToggleItem = (id: number) => {
    setRenderMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const onClickToggleAll = (state: boolean) => {
    setIsToggleAll(!state);

    setRenderMap((prev) => {
      const newRenderMap: Record<number, boolean> = {};
      for (const key in prev) {
        newRenderMap[Number(key)] = !state;
      }
      return newRenderMap;
    });
  };

  useEffect(() => {
    if (Object.values(renderMap).every((v) => v)) {
      setIsToggleAll(true);
    } else {
      setIsToggleAll(false);
    }
  }, [renderMap]);

  useEffect(() => {
    if (!isPending) {
      setEventDialog(true);
    }
  }, [isPending]);

  return (
    <>
      <SideItems
        itemApiData={itemApiData}
        renderMap={renderMap}
        onClickToggleItem={onClickToggleItem}
        isToggleAll={isToggleAll}
        onClickToggleAll={onClickToggleAll}
      />

      <main className="home-main-w overflow-auto">
        <ItemCard itemApiData={itemApiData} renderMap={renderMap} />

        <div>
          <TextStream text={text1} />
          <TextStream text={text2} delay={1000} className="text-red-300" />
          <TextStream text={text3} delay={2000} className="text-emerald-300" />
          <TextStream text={text4} delay={3000} className="text-gray-300" />
        </div>
      </main>

      <Dialog open={eventDialog} onOpenChange={setEventDialog}>
        <DialogTrigger />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Day ...</DialogTitle>
          </DialogHeader>

          <div>
            {eventApiData?.[0].data?.map(({ name, desc, type }) => (
              <div
                className="mt-4 pt-1.5 max-w-1/4 max-sm:max-w-[55%] border-t border-gray-700"
                key={type}
              >
                <h3 className="pb-1.5">
                  <em>{desc}</em>
                </h3>
                <ul>
                  {name.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              Welcome to Divine Tips!
            </DialogTitle>
          </DialogHeader>

          <div>
            <p className="text-sm my-2">Let's start by entering username</p>

            <input
              type="text"
              placeholder="Username"
              className="border border-white rounded w-full h-10 p-2 mb-5"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <p className="text-sm">
              Optionally, you can close this and continue without username
            </p>
            <p className="text-sm">But some features will be hidden</p>
            <p className="text-sm mb-3.5">
              Navigate to <b>Profile</b> at the top to open this again
            </p>

            <p className="text-sm mb-5">Have fun!</p>

            <div className="text-center">
              <button
                className="border border-white rounded-[5px] w-[80px] h-[40px] cursor-pointer disabled:cursor-not-allowed disabled:border-gray-600"
                onClick={() => {
                  setOpenDialog(false);
                }}
                disabled={input === ""}
              >
                Submit
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const fetchEventData = async (): Promise<EventApiData[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/event`);
  if (!res.ok) throw new Error("failed to fetch event data");

  return res.json();
};
