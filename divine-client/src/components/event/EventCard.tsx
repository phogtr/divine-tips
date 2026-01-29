import { EventContent } from "./EventContent";

import type { EventApiData } from "@/types/event.type";

interface EventCardProps {
  eventApiData: EventApiData[];
}

// key is index, api data is already sorted
const labelMap: Record<number, string> = {
  0: "Tomorrow",
  1: "Today",
  2: "Yesterday",
};

export const EventCard: React.FC<EventCardProps> = ({ eventApiData }) => {
  return (
    <main className="px-6 pb-8">
      {eventApiData.map(({ id, data }, idx) => (
        <div
          key={id}
          className="max-w-2xl p-4 mt-8 border border-primary-900 rounded"
        >
          <h2 className="text-xl">{labelMap[idx]}</h2>

          {data.map((d) => (
            <EventContent key={d.type} data={d} />
          ))}
        </div>
      ))}
    </main>
  );
};
