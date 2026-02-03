import { ItemApiData } from "@/types/item.type";

export const getItemsApi = async (): Promise<ItemApiData[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/item`);
  if (!res.ok) throw new Error("failed to get items");

  return res.json();
};
