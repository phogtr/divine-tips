import { EventApiData, EventItem } from "@/types/event.type";

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

const EventContent: React.FC<EventContentProps> = ({ data }) => {
  const { desc, name, type } = data;

  let textColor = "text-gray-300";
  if (type === 1) textColor = "text-emerald-300";
  else if (type === 0) textColor = "text-red-300";

  return (
    <div className="mt-4 pt-1.5 max-w-1/4 max-sm:max-w-[55%] border-t border-gray-700">
      <h3 className={`${textColor} pb-1.5`}>
        <em>{desc}</em>
      </h3>
      <ul>
        {name.map((n) => (
          <li key={n} className={`${textColor}`}>
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
};

interface EventContentProps {
  data: EventItem;
}
