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

export const SideItems = () => {
  return (
    <div className="w-27 mt-1 border border-white overflow-y-scroll">
      <div className="flex flex-col flex-wrap">
        {mockData.map((o) => (
          <button
            className="w-18 h-16 border border-white m-2 text-center cursor-pointer"
            key={o.name}
          >
            <div>{o.name.at(0)}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
