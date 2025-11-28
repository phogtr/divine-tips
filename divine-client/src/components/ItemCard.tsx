import { ItemApiData } from "@/types/item.type";

interface ItemCardProps {
  items: ItemApiData[];
  renderMap: Record<number, boolean>;
}

export const ItemCard: React.FC<ItemCardProps> = ({ items, renderMap }) => {
  return (
    <div className="mx-8 mt-14 mb-14 flex justify-center">
      <div className="flex flex-wrap gap-8">
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
      <div
        key={id}
        className="w-64 px-2 pt-2 pb-4 flex flex-col items-center border border-white rounded-sm"
      >
        <div className="p-2 w-full border-b border-gray-700">
          <span className="float-start">3</span>
          <div className="flex justify-center items-center">
            <div className="w-17 h-16 border rounded border-white"></div>
          </div>
        </div>

        <h2 className="mt-1 mb-4 flex justify-center text-blue-300 text-lg">
          {name}
        </h2>

        {current === previous ? (
          <div className="px-4 flex w-full h-full items-center justify-between">
            <div className="text-lg">${current}</div>
            <div>-</div>
          </div>
        ) : (
          <div className="grid grid-cols-2">
            <div>
              <div className="flex items-center gap-2">
                <div className={`${textLabel}`}>NOW</div>
                <div className={`text-lg ${textColor}`}>${current}</div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`${textLabel}`}>PAST</div>
                <div className={`text-lg ${textColor}`}>${previous}</div>
              </div>
            </div>

            <div className="flex flex-col items-end justify-center">
              <div className={`${textColor}`}>{delta ? "$" + delta : "-"}</div>
              <div className={`text-sm ${textColor}`}>
                {deltaPercent ? deltaPercent + "%" : "-"}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex w-full justify-around gap-4">
          <div className="flex items-center text-emerald-300">
            <button className="w-[18px] border border-emerald-300 cursor-pointer invisible">
              {"-"}
            </button>
            <button
              className="p-2 border border-emerald-300 cursor-pointer text-lg"
              onClick={() => {}}
            >
              BUY 2
            </button>
            <button className="w-[18px] border border-emerald-300 cursor-pointer invisible">
              {"+"}
            </button>
          </div>

          <div className="flex items-center text-red-300">
            <button className="w-[18px] border border-red-300 cursor-pointer invisible">
              {"-"}
            </button>
            <button
              className="p-2 border text-red-300 cursor-pointer text-lg"
              onClick={() => {}}
            >
              SELL 2
            </button>
            <button className="w-[18px] border border-red-300 cursor-pointer invisible">
              {"+"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

interface ItemContentProps {
  data: ItemApiData;
}
