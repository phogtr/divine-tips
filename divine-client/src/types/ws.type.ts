import type { ItemApiData } from "@/types/item.type";
import type { EventItem } from "@/types/event.type";

export interface WebSocketMessage {
  type: string;
  data: DayAdvancedWsData;
}

interface DayAdvancedWsData {
  items: ItemApiData[];
  events: EventItem[];
}
