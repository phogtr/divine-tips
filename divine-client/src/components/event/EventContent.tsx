import type { EventItem } from "@/types/event.type";

interface EventContentProps {
  data: EventItem;
}

export const EventContent: React.FC<EventContentProps> = ({ data }) => {
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
