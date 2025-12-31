import { ItemApiData } from "@/types/item.type";

interface SideItemsProps {
  items: ItemApiData[];
  renderMap: Record<number, boolean>;
  onClickToggleItem: (id: number) => void;
  isToggleAll: boolean;
  onClickToggleAll: (state: boolean) => void;
}

export const SideItems: React.FC<SideItemsProps> = ({
  items,
  renderMap,
  onClickToggleItem,
  isToggleAll,
  onClickToggleAll,
}) => {
  return (
    <div className="w-(--side-item-w) mt-1 border border-white overflow-y-auto overflow-x-hidden z-3">
      <div className="flex flex-col items-center">
        <button
          className={`w-17 h-16 border rounded my-2 text-center cursor-pointer ${
            isToggleAll ? "border-white" : "border-gray-600"
          }`}
          onClick={() => onClickToggleAll(isToggleAll)}
        >
          <div>All</div>
        </button>

        <div
          className="border border-gray-700 my-2"
          style={{
            width: "calc(var(--side-item-w) / 2)",
          }}
        />

        {items.map(({ id, name }) => (
          <button
            className={`w-17 h-16 border rounded my-2 text-center cursor-pointer ${
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
