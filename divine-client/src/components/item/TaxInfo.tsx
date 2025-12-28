"use client";

import { useState } from "react";

import { BUY_TAX, SELL_TAX } from "@/const/index.const";

import { Triangle } from "lucide-react";

export const TaxInfo = () => {
  const [isToggleTaxInfo, setIsToggleTaxInfo] = useState(false);

  return (
    <>
      <div
        className="p-2 w-38 border border-l-0 border-t-0 border-white transition-all duration-150 ease-in-out"
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
        className="w-10 h-10 rounded-tr-sm rounded-br-sm bg-white cursor-pointer transition-all duration-150 ease-in-out"
        style={
          isToggleTaxInfo
            ? {
                transform: "translate(0)",
              }
            : {
                transform:
                  "translate(calc(100% - calc(var(--spacing) * 10) - var(--spacing) * 38))",
              }
        }
        onClick={() => setIsToggleTaxInfo(!isToggleTaxInfo)}
      >
        <Triangle
          className="relative left-3 transition-all duration-200 ease-in"
          fill="#000"
          stroke="#000"
          size={16}
          style={{
            rotate: isToggleTaxInfo ? "270deg" : "90deg",
          }}
        />
      </button>
    </>
  );
};
