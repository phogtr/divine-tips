import { Suspense } from "react";

import { ItemContainer } from "@/components/ItemContainer";

import { ItemApiData } from "@/types/item.type";

export default async function Home() {
  let initItemData: ItemApiData[] = [];
  try {
    const res = await fetch(`${process.env.API_URL}/v1/item`);
    initItemData = await res.json();
  } catch (error) {
    initItemData = [];
  }

  return (
    <div className="page-h flex">
      <Suspense fallback={<h1>Loading...</h1>}>
        <ItemContainer initItemData={initItemData} />
      </Suspense>
    </div>
  );
}
