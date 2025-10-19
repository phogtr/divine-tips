export interface EventApiData {
  id: 1 | 2 | 3; // only store 3 data for now
  data: EventItem[];
}

export interface EventItem {
  name: string[];
  type: 0 | 1 | 2;
  desc: string;
}
