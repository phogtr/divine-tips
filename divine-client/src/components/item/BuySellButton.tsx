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

          setSellCount(1);
        } else {
          setUserData({
            ...userData,
            assets: {
              ...userData.assets,
              [itemName]: newCount,
            },
          });

          if (newCount < sellCount) {
            setSellCount(newCount);
          }
        }
      }
    }
  };

  const onClickIncrement = (type: "buy" | "sell") => {
    switch (type) {
      case "buy":
        setBuyCount((prev) => prev + 1);
        break;

      case "sell":
        setSellCount((prev) => prev + 1);
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

  let isSellDecHidden = true;
  if (
    isUserDataHydrate &&
    userData &&
    userData.assets?.[itemName] &&
    sellCount > 1
  ) {
    isSellDecHidden = false;
  }

  let isSellIncHidden = true;
  if (
    isUserDataHydrate &&
    userData &&
    userData.assets?.[itemName] &&
    sellCount < userData.assets[itemName]
  ) {
    isSellIncHidden = false;
  }

  let content = null;
  if (isUserDataHydrate && userData !== null) {
    content = (
      <div className="mt-6 flex w-full justify-around gap-4">
        <div className="group flex items-center text-emerald-300">
          <button
            className="w-[22px] border border-emerald-300 cursor-pointer invisible group-has-[:hover]:visible"
            onClick={() => onClickDecrement("buy")}
            style={buyCount < 2 ? { visibility: "hidden" } : {}}
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
            style={buyCount > 9 ? { visibility: "hidden" } : {}}
          >
            {"+"}
          </button>
        </div>

        <div className="group flex items-center text-red-300">
          <button
            className="w-[22px] border border-red-300 cursor-pointer invisible group-has-[:hover]:visible"
            onClick={() => onClickDecrement("sell")}
            style={isSellDecHidden ? { visibility: "hidden" } : {}}
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
            style={
              isSellIncHidden
                ? {
                    visibility: "hidden",
                  }
                : {}
            }
          >
            {"+"}
          </button>
        </div>
      </div>
    );
  }

  return <>{content}</>;
};
