interface SideItemsProps {
  renderMap: Record<string, number>;
  onClickToggleItem: (key: string) => void;
}

const mockData = [
  {
    name: "Charlie",
  },
  {
    name: "Foxtrot",
  },
  {
    name: "Juliett",
  },
  {
    name: "Romeo",
  },
  {
    name: "Tango",
  },
  {
    name: "Oscar",
  },
  {
    name: "Victor",
  },
];

export const SideItems: React.FC<SideItemsProps> = ({
  renderMap,
  onClickToggleItem,
}) => {
  return (
    <div className="w-(--side-item-w) mt-1 border border-white overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col items-center">
        {mockData.map((o) => (
          <button
            className={`w-17 h-16 border my-2 text-center cursor-pointer ${
              renderMap[o.name] ? "border-white" : "border-gray-600"
            }`}
            key={o.name}
            onClick={() => onClickToggleItem(o.name)}
          >
            <div>{o.name.at(0)}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
