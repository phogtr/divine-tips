import type { ItemApiData } from "@/types/item.type";
import type { EventApiData } from "@/types/event.type";

export interface WebSocketMessage {
  type: string;
  data: DayAdvancedWsData;
}

interface DayAdvancedWsData {
  items: ItemApiData[];
  event: EventApiData;
}
