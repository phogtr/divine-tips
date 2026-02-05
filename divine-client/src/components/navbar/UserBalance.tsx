"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";

import { currencyStr } from "@/utils/currency.utils";

import { UserData } from "@/types/user.type";

export const UserBalance = () => {
  const { data: userData, isHydrated: isUserDataHydrate } =
    useLocalStorage<UserData | null>("user", null);

  if (isUserDataHydrate && userData !== null) {
    return (
      <span className="text-2xl sm:text-3xl text-green-1">
        ${currencyStr(userData.balance)}
      </span>
    );
  }

  return null;
};
