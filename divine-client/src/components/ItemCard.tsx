"use client";

import { useState } from "react";

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

interface ItemCardProps {}

export const ItemCard: React.FC<ItemCardProps> = ({}) => {
  const [renderMap, setRenderMap] = useState<Record<string, number>>(() =>
    mockData.reduce(
      (acc, val) => ({
        ...acc,
        [val.name]: 1,
      }),
      {}
    )
  );

  return (
    <div className="m-6 flex justify-center">
      <div className="flex flex-col gap-4 w-4xl">
        {Object.keys(renderMap).map((item) =>
          renderMap[item] ? (
            <div
              key={item}
              className="h-16 p-4 flex flex-row border border-white"
            >
              <h2>{item}</h2>
              <div className="flex flex-col items-center justify-center ml-auto mr-4">
                <div>Current</div>
                <div>$100</div>
              </div>
              <div className="flex flex-col items-center justify-center mr-4">
                <div>Previous</div>
                <div>$100</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div>Delta</div>
                <div className="flex gap-4">
                  <div>$50</div>
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
