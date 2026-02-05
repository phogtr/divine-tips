"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

import { toast, ToastClassnames } from "sonner";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { rounding } from "@/utils/round.utils";

import { BUY_TAX, SELL_TAX } from "@/const/index.const";
import { UserData } from "@/types/user.type";

interface BuySellButtonProps {
  itemName: string;
  price: number;
}

export const BuySellButton: React.FC<BuySellButtonProps> = ({
  itemName,
  price,
}) => {
  const {
    data: userData,
    setData: setUserData,
    isHydrated: isUserDataHydrate,
  } = useLocalStorage<UserData | null>("user", null);

  const [buyCount, setBuyCount] = useState(1);

  const [sellCount, setSellCount] = useState(1);

  const subBtnClass = cn(
    "sub-btn scale-feedback",
    "border duration-200 ease-out",
    "sm:invisible",
    "group-hover:visible",
  );

  const onClickBuy = () => {
    if (isUserDataHydrate && userData) {
      let newItemCount = buyCount;

      const cost = transaction("buy", price, buyCount);
      if (cost > userData.balance) {
        return;
      }

      const newBalance = rounding(userData.balance - cost);
      const curr = userData.assets?.[itemName];
      if (curr) {
        newItemCount = curr + buyCount;
      }

      setUserData({
        ...userData,
        balance: newBalance,
        assets: {
          ...userData.assets,
          [itemName]: newItemCount,
        },
      });

      toast(
        <ToastContent
          text={`BUY ${buyCount} ${itemName}`}
          itemName={itemName}
        />,
        {
          classNames: toastClassOverride,
        },
      );
    }
  };

  const onClickSell = () => {
    if (isUserDataHydrate && userData) {
      const curr = userData.assets?.[itemName];
      if (curr) {
        const newItemCount = curr - sellCount;

        const amount = transaction("sell", price, sellCount);
        const newBalance = rounding(amount + userData.balance);

        if (newItemCount === 0) {
          const newAssets = { ...userData.assets };
          delete newAssets[itemName];
          setUserData({
            ...userData,
            balance: newBalance,
            assets: newAssets,
          });

          setSellCount(1);
        } else {
          setUserData({
            ...userData,
            balance: newBalance,
            assets: {
              ...userData.assets,
              [itemName]: newItemCount,
            },
          });

          if (newItemCount < sellCount) {
            setSellCount(newItemCount);
          }
        }

        toast(
          <ToastContent
            text={`SELL ${sellCount} ${itemName}`}
            itemName={itemName}
          />,
          {
            classNames: toastClassOverride,
          },
        );
      }
    }
  };

  const onClickIncrement = (type: "buy" | "sell") => {
    switch (type) {
      case "buy":
        if (buyCount < 10) {
          setBuyCount((prev) => prev + 1);
        }
        break;

      case "sell":
        if (!isSellIncHidden) {
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

  if (isUserDataHydrate && userData !== null) {
    return (
      <div className="mt-6 flex w-full justify-around gap-4">
        <div className="group flex items-center text-green-1">
          <button
            className={cn(
              subBtnClass,
              "sm:left-[12px] left-0 border-green-ln",
              "group-hover:translate-x-[-13px]",
            )}
            onClick={() => onClickDecrement("buy")}
            style={buyCount < 2 ? { visibility: "hidden" } : {}}
          >
            {"-"}
          </button>
          <button
            className="transaction-btn scale-feedback border border-green-ln"
            onClick={onClickBuy}
          >
            BUY {buyCount > 1 && buyCount}
          </button>
          <button
            className={cn(
              subBtnClass,
              "sm:left-[-12px] left-0 border-green-ln",
              "group-hover:translate-x-[13px]",
            )}
            onClick={() => onClickIncrement("buy")}
            style={buyCount > 9 ? { visibility: "hidden" } : {}}
          >
            {"+"}
          </button>
        </div>

        <div className="group flex items-center text-red-1">
          <button
            className={cn(
              subBtnClass,
              "sm:left-[12px] left-0 border-red-ln",
              "group-hover:translate-x-[-13px]",
            )}
            onClick={() => onClickDecrement("sell")}
            style={isSellDecHidden ? { visibility: "hidden" } : {}}
          >
            {"-"}
          </button>
          <button
            className="transaction-btn scale-feedback border border-red-ln"
            onClick={onClickSell}
          >
            SELL {sellCount > 1 && sellCount}
          </button>
          <button
            className={cn(
              subBtnClass,
              "sm:left-[-12px] left-0 border-red-ln",
              "group-hover:translate-x-[13px]",
            )}
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

  return null;
};

const ToastContent = ({
  text,
  itemName,
}: {
  text: string;
  itemName: string;
}) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="h-16 w-17 flex items-center justify-center rounded border border-primary-900 text-lg">
        {itemName.slice(0, 1)}
      </div>
      <div className="text-xl">{text}</div>
    </div>
  );
};
const toastClassOverride: ToastClassnames = {
  toast: "toast-override",
  content: "toast-override-content",
};

// base tax = 4.5%
// price = 100
// count = 10
// total tax = 4.5% * 10 = 45%
// tax = 1000 * 45% = 1000 * 0.45 = 450
// return 1000 + 450 = 1450
const transaction = (type: "buy" | "sell", price: number, count: number) => {
  const baseTax = type === "sell" ? SELL_TAX : BUY_TAX;
  const amount = price * count;
  const totalTax = baseTax * count;
  const tax = amount * totalTax;

  return type === "buy" ? amount + tax : amount - tax;
};
