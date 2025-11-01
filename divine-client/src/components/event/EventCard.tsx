import { EventContent } from "./EventContent";

import type { EventApiData } from "@/types/event.type";

interface EventCardProps {
  eventApiData: EventApiData[];
}

// key is id from api
const labelMap = {
  3: "Today",
  2: "Yesterday",
  1: "Other",
};

export const EventCard: React.FC<EventCardProps> = ({ eventApiData }) => {
  return (
    <main className="px-6 pb-8">
      {eventApiData.map(({ id, data }) => (
        <div
          key={id}
          className="max-w-2xl p-4 mt-8 border border-white rounded"
        >
          <h2 className="text-xl">{labelMap[id]}</h2>

          {data.map((d) => (
            <EventContent key={d.type} data={d} />
          ))}
        </div>
      ))}
    </main>
  );
};
