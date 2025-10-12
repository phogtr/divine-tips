"use client";

import { useState } from "react";

import { SideItems } from "./SideItems";
import { ItemCard } from "./ItemCard";

const mockData = [
  {
    name: "Charlie",
  },
  {
    name: "Foxtrot",
  },
  {
    name: "Juliett",
  },
  {
    name: "Romeo",
  },
  {
    name: "Tango",
  },
  {
    name: "Oscar",
  },
  {
    name: "Victor",
  },
];

export const ItemContainer = ({}) => {
  const [renderMap, setRenderMap] = useState<Record<string, number>>(() =>
    mockData.reduce(
      (acc, val) => ({
        ...acc,
        [val.name]: 0,
      }),
      {}
    )
  );

  const onClickToggleItem = (key: string) => {
    setRenderMap((prev) => ({
      ...prev,
      [key]: prev[key] ? 0 : 1,
    }));
  };

  return (
    <>
      <SideItems renderMap={renderMap} onClickToggleItem={onClickToggleItem} />

      <main className="home-main-w overflow-auto">
        <ItemCard renderMap={renderMap} />
      </main>
    </>
  );
};
