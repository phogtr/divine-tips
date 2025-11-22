import { TextStream } from "../TextStream";

import type { EventItem } from "@/types/event.type";

interface EventContentProps {
  data: EventItem;
  isTextStream?: boolean;
  maxWidth?: string;
}

export const EventContent: React.FC<EventContentProps> = ({
  data,
  isTextStream = false,
  maxWidth = "25%",
}) => {
  const { desc, name, type } = data;

  let textColor = "text-gray-300";
  if (type === 1) textColor = "text-emerald-300";
  else if (type === 0) textColor = "text-red-300";

  let descElem = <em>{desc}</em>;
  if (isTextStream) {
    descElem = <TextStream text={desc} streamInterval={35} elem="em" />;
  }

  return (
    <div
      className="mt-4 pt-1.5 max-sm:max-w-[55%] border-t border-gray-700"
      style={{
        maxWidth: maxWidth,
      }}
    >
      <h3 className={`${textColor} pb-1.5`}>{descElem}</h3>

      <ul>
        {name.map((n) => {
          if (isTextStream) {
            return (
              <TextStream
                key={n}
                text={n}
                className={`${textColor}`}
                streamInterval={75}
                elem="li"
              />
            );
          }

          return (
            <li key={n} className={`${textColor}`}>
              {n}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
