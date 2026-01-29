"use client";

import { useState } from "react";

import { BUY_TAX, SELL_TAX } from "@/const/index.const";

import { Triangle } from "lucide-react";

export const TaxInfo = () => {
  const [isToggleTaxInfo, setIsToggleTaxInfo] = useState(false);

  return (
    <>
      <div
        className="w-38 p-2 bg-primary-50 rounded-sm border border-t-0 border-l-0 border-primary-900 duration-150 ease-in-out"
        style={
          isToggleTaxInfo
            ? { transform: "translate(0)", opacity: 1 }
            : {
                transform: "translate(-100%)",
                opacity: 0,
              }
        }
      >
        <p className="text-xl">Buy Tax: {(BUY_TAX * 100).toFixed(1)}%</p>
        <p className="text-xl">Sell Tax: {(SELL_TAX * 100).toFixed(1)}%</p>
      </div>

      <button
        className="h-10 w-10 bg-accent-900 cursor-pointer rounded-tr-sm rounded-br-sm duration-150 ease-in-out"
        style={
          isToggleTaxInfo
            ? {
                transform: "translate(0)",
              }
            : {
                // button width - tax-info width
                transform:
                  "translate(calc(100% - calc(var(--spacing) * 10) - var(--spacing) * 38))",
              }
        }
        onClick={() => setIsToggleTaxInfo(!isToggleTaxInfo)}
      >
        <Triangle
          className="relative left-3 fill-accent-500 stroke-accent-500 duration-250 ease-in"
          size={16}
          style={{
            rotate: isToggleTaxInfo ? "270deg" : "90deg",
          }}
        />
      </button>
    </>
  );
};
