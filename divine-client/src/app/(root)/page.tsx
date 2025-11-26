import { Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { ItemContainer } from "@/components/ItemContainer";

import { ItemApiData } from "@/types/item.type";

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["items", 0],
    queryFn: serverGetItems,
  });

  return (
    <div className="page-h flex">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<h1>Loading...</h1>}>
          <ItemContainer />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}

const serverGetItems = async (): Promise<ItemApiData[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/item`);
  if (!res.ok) throw new Error("failed to get items");

  return res.json();
};
