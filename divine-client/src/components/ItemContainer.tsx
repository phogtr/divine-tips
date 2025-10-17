"use client";
import { useEffect, useState } from "react";

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

  const [isToggleAll, setIsToggleAll] = useState(false);

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
      </main>
    </>
  );
};
