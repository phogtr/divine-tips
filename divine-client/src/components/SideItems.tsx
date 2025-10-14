import { ItemApiData } from "@/types/item.type";

interface SideItemsProps {
  itemApiData: ItemApiData[];
  renderMap: Record<number, boolean>;
  onClickToggleItem: (id: number) => void;
}

export const SideItems: React.FC<SideItemsProps> = ({
  itemApiData,
  renderMap,
  onClickToggleItem,
}) => {
  return (
    <div className="w-(--side-item-w) mt-1 border border-white overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col items-center">
        {itemApiData.map(({ id, name }) => (
          <button
            className={`w-17 h-16 border my-2 text-center cursor-pointer ${
              renderMap[id] ? "border-white" : "border-gray-600"
            }`}
            key={id}
            onClick={() => onClickToggleItem(id)}
          >
            <div>{name.at(0)}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
