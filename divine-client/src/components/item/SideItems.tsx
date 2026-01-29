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
    <div className="w-(--side-item-w) mt-1 z-3 border border-primary-900 overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col items-center">
        <button
          className={`w-17 h-16 my-2 border rounded text-center cursor-pointer ${
            isToggleAll ? "border-primary-900" : "opacity-60"
          }`}
          onClick={() => onClickToggleAll(isToggleAll)}
        >
          <div>All</div>
        </button>

        <div
          className="my-2 border border-primary-200"
          style={{
            width: "calc(var(--side-item-w) / 2)",
          }}
        />

        {items.map(({ id, name }) => (
          <button
            className={`w-17 h-16 my-2 border rounded text-center cursor-pointer ${
              renderMap[id] ? "border-primary-900" : "opacity-60"
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
