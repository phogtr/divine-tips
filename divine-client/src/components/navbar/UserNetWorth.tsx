"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";

import { currencyStr } from "@/utils/currency.utils";

import { UserData } from "@/types/user.type";

export const UserNetWorth = () => {
  const { data: userData, isHydrated: isUserDataHydrate } =
    useLocalStorage<UserData | null>("user", null);

  if (isUserDataHydrate && userData !== null) {
    return (
      <span className="text-3xl text-green-400">
        ${currencyStr(userData.balance)}
      </span>
    );
  }

  return null;
};
