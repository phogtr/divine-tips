"use client";
import { useState } from "react";

import { SideItems } from "./SideItems";
import { ItemCard } from "./ItemCard";

import { ItemApiData } from "@/types/item.type";

interface ItemContainerProps {
  itemApiData: ItemApiData[];
}

export const ItemContainer: React.FC<ItemContainerProps> = ({
  itemApiData,
}) => {
  const [renderMap, setRenderMap] = useState<Record<number, boolean>>(() =>
    itemApiData.reduce(
      (acc, val) => ({
        ...acc,
        [val.id]: false,
      }),
      {}
    )
  );

  const onClickToggleItem = (id: number) => {
    setRenderMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <SideItems
        itemApiData={itemApiData}
        renderMap={renderMap}
        onClickToggleItem={onClickToggleItem}
      />

      <main className="home-main-w overflow-auto">
        <ItemCard itemApiData={itemApiData} renderMap={renderMap} />
      </main>
    </>
  );
};
