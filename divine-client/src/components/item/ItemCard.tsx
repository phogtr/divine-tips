import { BuySellButton } from "@/components/item/BuySellButton";
import { OwnedItemCount } from "@/components/item/OwnedItemCount";

import { currencyStr } from "@/utils/currency.utils";

import { Triangle } from "lucide-react";

import { ItemApiData } from "@/types/item.type";

interface ItemCardProps {
  items: ItemApiData[];
  renderMap: Record<number, boolean>;
}

export const ItemCard: React.FC<ItemCardProps> = ({ items, renderMap }) => {
  return (
    <div className="flex flex-wrap gap-8">
      {items.map((i) =>
        renderMap[i.id] ? <ItemContent key={i.id} data={i} /> : null,
      )}
    </div>
  );
};

const ItemContent: React.FC<ItemContentProps> = ({ data }) => {
  const { id, name, current, previous, delta, deltaPercent } = data;

  let textColor = "text-foreground";
  let deltaIcon = <Triangle size={16} />;

  if (current > previous) textColor = "text-green-1";
  else if (current < previous) {
    textColor = "text-red-1";
    deltaIcon = <Triangle size={16} className="rotate-180" />;
  }

  const textLabel = "text-xs opacity-50";

  return (
    <>
      <div
        key={id}
        className="w-78 px-2 pt-2 pb-4 flex flex-col items-center bg-primary-50 rounded-sm border border-primary-900"
      >
        <div className="w-full p-2 relative border-b border-primary-200">
          <OwnedItemCount name={name} />

          <div className="flex justify-center items-center">
            <div className="h-16 w-17 flex items-center justify-center rounded border border-primary-900">
              {name.slice(0, 1)}
            </div>
          </div>
        </div>

        <h2 className="mt-1 mb-4 flex justify-center text-lg">{name}</h2>

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
