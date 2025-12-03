"use client";

import { useState } from "react";

import { useLocalStorage } from "@/hooks/useLocalStorage";

import { UserData } from "@/types/user.type";

interface BuySellButtonProps {
  itemName: string;
}

export const BuySellButton: React.FC<BuySellButtonProps> = ({ itemName }) => {
  const {
    data: userData,
    setData: setUserData,
    isHydrated: isUserDataHydrate,
  } = useLocalStorage<UserData | null>("user", null);

  const [buyCount, setBuyCount] = useState(1);

  const [sellCount, setSellCount] = useState(1);

  const onClickBuy = () => {
    if (isUserDataHydrate && userData) {
      let newCount = buyCount;
      const curr = userData.assets?.[itemName];
      if (curr) {
        newCount = curr + buyCount;
      }

      setUserData({
        ...userData,
        assets: {
          ...userData.assets,
          [itemName]: newCount,
        },
      });
    }
  };

  const onClickSell = () => {
    if (isUserDataHydrate && userData) {
      let newCount = buyCount;
      const curr = userData.assets?.[itemName];
      if (curr) {
        newCount = curr - sellCount;

        if (newCount === 0) {
          const newAssets = { ...userData.assets };
          delete newAssets[itemName];
          setUserData({
            ...userData,
            assets: newAssets,
          });
        } else {
          setUserData({
            ...userData,
            assets: {
              ...userData.assets,
              [itemName]: newCount,
            },
          });
        }
      }
    }
  };

  const onClickIncrement = (type: "buy" | "sell") => {
    switch (type) {
      case "buy":
        if (buyCount <= 9) {
          setBuyCount((prev) => prev + 1);
        }
        break;

      case "sell":
        if (sellCount <= 9) {
          setSellCount((prev) => prev + 1);
        }
        break;

      default:
        return;
    }
  };

  const onClickDecrement = (type: "buy" | "sell") => {
    switch (type) {
      case "buy":
        if (buyCount > 1) {
          setBuyCount((prev) => prev - 1);
        }
        break;

      case "sell":
        if (sellCount > 1) {
          setSellCount((prev) => prev - 1);
        }
        break;

      default:
        return;
    }
  };

  let content = null;
  if (isUserDataHydrate && userData !== null) {
    content = (
      <div className="mt-6 flex w-full justify-around gap-4">
        <div className="group flex items-center text-emerald-300">
          <button
            className="w-[22px] border border-emerald-300 cursor-pointer invisible group-has-[:hover]:visible"
            onClick={() => onClickDecrement("buy")}
          >
            {"-"}
          </button>
          <button
            className="w-[88px] p-2 border border-emerald-300 cursor-pointer text-lg"
            onClick={onClickBuy}
          >
            BUY {buyCount > 1 && buyCount}
          </button>
          <button
            className="w-[22px] border border-emerald-300 cursor-pointer invisible group-has-[:hover]:visible"
            onClick={() => onClickIncrement("buy")}
          >
            {"+"}
          </button>
        </div>

        <div className="group flex items-center text-red-300">
          <button
            className="w-[22px] border border-red-300 cursor-pointer invisible group-has-[:hover]:visible"
            onClick={() => onClickDecrement("sell")}
          >
            {"-"}
          </button>
          <button
            className="w-[88px] p-2 border text-red-300 cursor-pointer text-lg"
            onClick={onClickSell}
          >
            SELL {sellCount > 1 && sellCount}
          </button>
          <button
            className="w-[22px] border border-red-300 cursor-pointer invisible group-has-[:hover]:visible"
            onClick={() => onClickIncrement("sell")}
          >
            {"+"}
          </button>
        </div>
      </div>
    );
  }

  return <>{content}</>;
};
