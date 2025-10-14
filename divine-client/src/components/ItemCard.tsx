import { ItemApiData } from "@/types/item.type";

interface ItemCardProps {
  itemApiData: ItemApiData[];
  renderMap: Record<number, boolean>;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  itemApiData,
  renderMap,
}) => {
  return (
    <div className="m-6 flex justify-center">
      <div className="flex flex-col gap-4 w-4xl">
        {itemApiData.map(({ id, name, current, previous }) =>
          renderMap[id] ? (
            <div
              key={id}
              className="h-16 p-4 flex flex-row border border-white"
            >
              <h2>{name}</h2>

              <div className="flex flex-col items-center justify-center ml-auto mr-4">
                <div>Current</div>
                <div>${current}</div>
              </div>

              <div className="flex flex-col items-center justify-center mr-4">
                <div>Previous</div>
                <div>${previous}</div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div>Delta</div>
                <div className="flex gap-4">
                  <div>{Math.abs(current - previous).toFixed(2)}</div>
                  <div>50%</div>
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};
