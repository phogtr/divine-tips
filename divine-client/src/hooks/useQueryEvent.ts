import { useQuery } from "@tanstack/react-query";

import { EVENT_QUERY_KEY } from "@/const/query-key.const";

import { EventApiData } from "@/types/event.type";

interface Args {
  isEnable?: boolean;
}

export const useQueryEvent = ({ isEnable = true }: Args) => {
  const { data } = useQuery({
    queryKey: [EVENT_QUERY_KEY],
    queryFn: fetchEventData,
    enabled: isEnable,
  });

  return {
    data,
  };
};

const fetchEventData = async (): Promise<EventApiData[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/event`);
  if (!res.ok) throw new Error("failed to fetch event data");

  return res.json();
};
