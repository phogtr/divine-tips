"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { CircleCheck, Triangle } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { SignUpDialog } from "@/components/SignUpDialog";

import { getItemsApi } from "@/api/item.api";

import { useLocalStorage } from "@/hooks/useLocalStorage";

import { currencyStr } from "@/utils/currency.utils";

import { USER_INITIAL_BALANCE } from "@/const/index.const";

import type { UserData } from "@/types/user.type";
import type { ItemApiData } from "@/types/item.type";

export const Profile = () => {
  const {
    data: userData,
    setData: setUserData,
    isHydrated: isUserDataHydrate,
    clear: clearUserData,
  } = useLocalStorage<UserData | null>("user", null);

  const { setData: setIsSignUp } = useLocalStorage<boolean>("sign-up", false);

  const { data: itemData } = useQuery({
    queryKey: ["items"],
    queryFn: getItemsApi,
  });

  const [signUpDialog, setSignUpDialog] = useState(false);
  const [signUpInput, setSignUpInput] = useState("");

  const [nameChange, setNameChange] = useState<string | null>(null);
  let displayName = "";
  if (nameChange !== null) {
    displayName = nameChange;
  } else if (isUserDataHydrate && userData !== null) {
    displayName = userData.name;
  }

  const [deleteDialog, setDeleteDialog] = useState(false);

  const itemPriceMap = useMemo(() => {
    const map: Record<string, ItemApiData> = {};
    if (itemData) {
      itemData.forEach((i) => {
        const name = i.name;
        map[name] = i;
      });
    }
    return map;
  }, [itemData]);

  const onClickSubmitSignUp = () => {
    if (signUpInput !== "") {
      setUserData({
        name: signUpInput,
        balance: USER_INITIAL_BALANCE,
        assets: null,
      });
      setNameChange(signUpInput);
    }
    setSignUpDialog(false);
  };

  let signUpContent = null;
  if (isUserDataHydrate && userData === null) {
    signUpContent = (
      <main className="flex h-full justify-center items-center">
        <button
          className="border border-white rounded-[5px] py-3 px-4 cursor-pointer"
          onClick={() => {
            setSignUpDialog(true);
            setDeleteDialog(false);
          }}
        >
          Create Profile
        </button>

        <SignUpDialog
          isOpenDialog={signUpDialog}
          onDialogChange={() => setSignUpDialog(false)}
          signUpInput={signUpInput}
          onChangeSignUpInput={(e) => setSignUpInput(e.target.value)}
          onClickSubmitSignUp={onClickSubmitSignUp}
        />
      </main>
    );
  }

  let profileContent = null;
  if (isUserDataHydrate && userData !== null && itemData) {
    let net = 0;
    let unique = 0;
    let totalAssets = 0;
    for (const item in userData.assets) {
      const count = userData.assets[item];
      net += itemPriceMap[item].current * count;
      totalAssets += count;
      unique++;
    }
    net += userData.balance;

    profileContent = (
      <div className="h-full overflow-auto">
        <main className="my-6 flex flex-col w-3/4 m-auto">
          <div className="py-2 px-4 border border-white rounded-lg">
            <div className="pt-6 flex items-center flex-col">
              <p className="text-3xl font-bold">Profile</p>
              <div className="mt-6 w-full border border-gray-700 text-center" />
            </div>

            <div className="grid grid-cols-[1fr_2fr] py-2">
              <div className="flex flex-col justify-center items-center border-r border-gray-700">
                <div className="flex relative">
                  <input
                    type="text"
                    placeholder={userData.name}
                    className="mb-1 px-2 text-center hover:border border-gray-700 rounded-lg font-semibold"
                    value={displayName}
                    onChange={(e) => {
                      setNameChange(e.target.value);
                    }}
                    name="username"
                    autoComplete="username"
                  />
                  {nameChange &&
                    nameChange !== "" &&
                    nameChange !== userData.name && (
                      <CircleCheck
                        className="absolute right-[-36px] mx-2 text-green-400 cursor-pointer"
                        onClick={() =>
                          setUserData({
                            ...userData,
                            name: nameChange,
                          })
                        }
                      />
                    )}
                </div>

                <button
                  className="text-red-500 hover:text-red-300 cursor-pointer"
                  onClick={() => setDeleteDialog(true)}
                >
                  Delete Profile
                </button>
              </div>

              <div className="my-6 flex flex-col justify-center items-center">
                <div className="text-4xl font-bold">${currencyStr(net)}</div>

                <div className="mt-2 grid grid-cols-3">
                  <div className="px-4 flex flex-col items-center border-r border-gray-400">
                    <div className="font-semibold">{unique}</div>
                    <p>Unique Assets</p>
                  </div>
                  <div className="px-4 flex flex-col items-center border-r border-gray-400">
                    <div className="font-semibold">{totalAssets}</div>
                    <p>Total Assets</p>
                  </div>
                  <div className="px-4 flex flex-col items-center">
                    <div className="text-emerald-300 font-semibold">
                      ${currencyStr(userData.balance)}
                    </div>
                    <p>Current Balance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 py-2 px-4 border border-white rounded-lg">
            <div className="pt-6 flex items-center flex-col">
              <p className="text-3xl font-bold">Assets</p>
              <div className="mt-6 w-full border border-gray-700 text-center" />

              {userData.assets === null ||
                (Object.keys(userData.assets).length === 0 ? (
                  <></>
                ) : (
                  <div className="w-full">
                    <div className="py-2 flex w-full border-b border-gray-700">
                      <div className="mx-2 w-24"></div>
                      <div className="w-20 text-center text-lg">Owns</div>
                      <div className="flex-1 text-center text-lg">Now</div>
                      <div className="flex-1 text-center text-lg">Past</div>
                      <div className="flex-1 text-center"></div>
                      <div></div>
                    </div>

                    {Object.entries(userData.assets).map(([k, v]) => {
                      const { current, previous, delta, deltaPercent } =
                        itemPriceMap[k];

                      let textColor = "text-[#fff]";
                      let deltaIcon = <Triangle size={16} />;

                      if (current > previous) textColor = "text-emerald-300";
                      else if (current < previous) {
                        textColor = "text-red-300";
                        deltaIcon = (
                          <Triangle size={16} className="rotate-180" />
                        );
                      }

                      return (
                        <div
                          key={k}
                          className="flex w-full my-4 pb-2 items-center border-b border-gray-700"
                        >
                          <div className="mx-2 w-24 flex flex-col items-center gap-1">
                            <div className="w-17 h-16 border rounded border-white"></div>
                            <div>{k}</div>
                          </div>
                          <div className="w-20 text-center text-2xl">{v}</div>
                          <div
                            className={`flex-1 text-center text-2xl ${textColor}`}
                          >
                            ${currencyStr(current)}
                          </div>
                          <div
                            className={`flex-1 text-center text-2xl ${textColor}`}
                          >
                            ${currencyStr(previous)}
                          </div>
                          <div
                            className={`flex flex-1 flex-col text-lg ${textColor}`}
                          >
                            <div className="flex items-center gap-1">
                              {delta ? (
                                <>
                                  {deltaIcon}
                                  <div>{"$" + currencyStr(delta)}</div>
                                </>
                              ) : (
                                "-"
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {deltaPercent ? (
                                <>
                                  {deltaIcon}
                                  <div>{deltaPercent + "%"}</div>
                                </>
                              ) : (
                                "-"
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
            </div>
          </div>

          <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
            <DialogTrigger />
            <DialogContent>
              <VisuallyHidden>
                <DialogHeader>
                  <DialogTitle>Delete Profile</DialogTitle>
                </DialogHeader>
              </VisuallyHidden>

              <p className="text-center">
                Are you sure you want to delete this profile?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="w-1/2 cursor-pointer"
                  onClick={() => {
                    clearUserData();
                    setIsSignUp(false);
                  }}
                >
                  Delete
                </button>
                <button
                  className="w-1/2 cursor-pointer"
                  onClick={() => setDeleteDialog(false)}
                >
                  Cancel
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    );
  }

  return (
    <>
      <>{signUpContent}</>
      <>{profileContent}</>
    </>
  );
};
