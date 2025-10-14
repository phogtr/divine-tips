import { Suspense } from "react";

import { ItemContainer } from "@/components/ItemContainer";

export default async function Home() {
  let itemApiData = [];
  try {
    const res = await fetch(`${process.env.API_URL}/v1/item`);
    itemApiData = await res.json();
  } catch (error) {
    itemApiData = [];
  }

  return (
    <div className="page-h flex">
      <Suspense fallback={<h1>Loading...</h1>}>
        <ItemContainer itemApiData={itemApiData} />
      </Suspense>
    </div>
  );
}
