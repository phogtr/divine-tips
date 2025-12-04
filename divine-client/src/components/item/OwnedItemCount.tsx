"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";

import { UserData } from "@/types/user.type";

interface OwnedItemCountProps {
  name: string;
}

export const OwnedItemCount: React.FC<OwnedItemCountProps> = ({ name }) => {
  const { data: userData, isHydrated: isUserDataHydrate } =
    useLocalStorage<UserData | null>("user", null);

  if (isUserDataHydrate && userData !== null && userData.assets !== null) {
    return <span className="absolute">{userData.assets[name]}</span>;
  }

  return null;
};
