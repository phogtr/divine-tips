import { BuySellButton } from "@/components/item/BuySellButton";
import { OwnedItemCount } from "./item/OwnedItemCount";

import { currencyStr } from "@/utils/currency.utils";

import { Triangle } from "lucide-react";

import { ItemApiData } from "@/types/item.type";

interface ItemCardProps {
  items: ItemApiData[];
  renderMap: Record<number, boolean>;
}

export const ItemCard: React.FC<ItemCardProps> = ({ items, renderMap }) => {
  return (
    <div className="mx-8 mt-22 mb-14 flex justify-center">
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
  let deltaIcon = <Triangle size={16} />;

  if (current > previous) textColor = "text-emerald-300";
  else if (current < previous) {
    textColor = "text-red-300";
    deltaIcon = <Triangle size={16} className="rotate-180" />;
  }

  const textLabel = "text-gray-400 text-xs";

  return (
    <>
      <div
        key={id}
        className="w-78 px-2 pt-2 pb-4 flex flex-col items-center border border-white rounded-sm"
      >
        <div className="relative p-2 w-full border-b border-gray-700">
          <OwnedItemCount name={name} />

          <div className="flex justify-center items-center">
            <div className="w-17 h-16 border rounded border-white"></div>
          </div>
        </div>

        <h2 className="mt-1 mb-4 flex justify-center text-blue-300 text-lg">
          {name}
        </h2>

        {current === previous ? (
          <div className="px-4 flex w-full h-full items-center justify-between">
            <div className="text-lg">${currencyStr(current)}</div>
            <div>-</div>
          </div>
        ) : (
          <div className="px-4 grid grid-cols-2 w-full">
            <div>
              <div className="flex items-center gap-2">
                <div className={`${textLabel}`}>NOW</div>
                <div className={`text-lg ${textColor}`}>
                  ${currencyStr(current)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`${textLabel}`}>PAST</div>
                <div className={`text-lg ${textColor}`}>
                  ${currencyStr(previous)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <div
                className={`flex flex-col items-start justify-center ${textColor}`}
              >
                <div className="flex items-center gap-1">
                  {deltaIcon}
                  <span>{delta ? "$" + currencyStr(delta) : "-"}</span>
                </div>
                <div className="flex items-center gap-1">
                  {deltaIcon}
                  <div>{deltaPercent ? deltaPercent + "%" : "-"}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <BuySellButton itemName={name} price={current} />
      </div>
    </>
  );
};

interface ItemContentProps {
  data: ItemApiData;
}
