import { ItemApiData } from "@/types/item.type";

interface ItemCardProps {
  items: ItemApiData[];
  renderMap: Record<number, boolean>;
}

export const ItemCard: React.FC<ItemCardProps> = ({ items, renderMap }) => {
  return (
    <div className="m-6 flex justify-center">
      <div className="flex flex-col gap-4 w-4xl">
        {items.map((i) =>
          renderMap[i.id] ? <ItemContent key={i.id} data={i} /> : null
        )}
      </div>
    </div>
  );
};

const ItemContent: React.FC<ItemContentProps> = ({ data }) => {
  const { id, name, current, previous, delta, deltaPercent } = data;

  let textColor = "text-[#fff]";
  if (current > previous) textColor = "text-emerald-300";
  else if (current < previous) textColor = "text-red-300";

  const textLabel = "text-gray-400 text-xs";

  return (
    <>
      <div key={id} className="h-16 px-4 flex flex-row border border-white">
        <h2 className="flex items-center justify-center text-blue-300 text-lg">
          {name}
        </h2>

        <div className="ml-auto grid grid-cols-[60px_60px_120px] gap-7">
          <div className="flex flex-col items-center justify-center">
            <div className={`${textLabel}`}>NOW</div>
            <div className={`text-lg ${textColor}`}>${current}</div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className={`${textLabel}`}>PAST</div>
            <div className={`text-lg ${textColor}`}>${previous}</div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className={`${textLabel}`}>DELTA</div>
            <div className="flex gap-3">
              <div className={`text-lg ${textColor}`}>
                {delta ? "$" + delta : "-"}
              </div>
              <div className={`text-lg ${textColor}`}>
                {deltaPercent ? deltaPercent + "%" : "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

interface ItemContentProps {
  data: ItemApiData;
}
