"use client";

import { memo, useMemo, useState } from "react";
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
        day: 1,
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
          className="py-3 px-4 rounded-[5px] bg-primary-600 text-primary-100 hover:bg-primary-700 cursor-pointer"
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
          <div className="py-2 px-4 bg-primary-50 border border-primary-900 rounded-lg">
            <div className="pt-6 flex items-center flex-col">
              <p className="text-3xl font-bold">Profile</p>
              <div className="mt-6 w-full border border-primary-200 text-center" />
            </div>

            <div className="py-2 sm:grid sm:grid-cols-[1fr_2fr] flex flex-col bg-primary-50">
              <div className="py-1 sm:p-0 flex flex-col justify-center items-center sm:border-r sm:border-b-0 border-b border-primary-200">
                <div className="flex relative">
                  <input
                    type="text"
                    placeholder={userData.name}
                    className="mb-1 px-2 text-center hover:border border-primary-200 rounded-lg font-semibold"
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
                        className="absolute right-[-36px] mx-2 text-green-1 cursor-pointer"
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
                  className="text-destructive-foreground hover:text-destructive cursor-pointer"
                  onClick={() => setDeleteDialog(true)}
                >
                  Delete Profile
                </button>
              </div>

              <div className="my-6 flex flex-col justify-center items-center">
                <div className="sm:text-4xl text-3xl font-bold">
                  ${currencyStr(net)}
                </div>

                <div className="mt-2 grid grid-cols-3">
                  <div className="px-4 flex flex-col items-center border-r border-primary-200">
                    <div className="font-semibold">{unique}</div>
                    <p className="text-center">Unique Assets</p>
                  </div>
                  <div className="px-4 flex flex-col items-center border-r border-primary-200">
                    <div className="font-semibold">{totalAssets}</div>
                    <p className="text-center">Total Assets</p>
                  </div>
                  <div className="px-4 flex flex-col items-center">
                    <div className="text-green-1 font-semibold">
                      ${currencyStr(userData.balance)}
                    </div>
                    <p className="text-center">Current Balance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 py-2 px-4 bg-primary-50 border border-primary-900 rounded-lg">
            <div className="pt-6 flex items-center flex-col">
              <p className="text-3xl font-bold">Assets</p>
              <div className="mt-6 w-full border border-primary-200 text-center" />

              {userData.assets === null ||
                (Object.keys(userData.assets).length === 0 ? (
                  <></>
                ) : (
                  <AssetsTable
                    userData={userData}
                    itemPriceMap={itemPriceMap}
                  />
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
                  className="w-1/2 bg-primary-600 text-primary-50 rounded-[5px] cursor-pointer hover:bg-primary-700"
                  onClick={() => {
                    clearUserData();
                    setIsSignUp(false);
                  }}
                >
                  Delete
                </button>
                <button
                  className="w-1/2 text-primary-600 border border-primary-600  hover:text-primary-700 hover:border-primary-700 rounded-[5px] cursor-pointer"
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

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
const AssetsTable = memo<AssetsTableProps>(({ userData, itemPriceMap }) => {
  return (
    <div className="w-full">
      <div className="py-2 md:flex hidden w-full border-b border-primary-200">
        <div className="mx-2 w-24"></div>
        <div className="w-20 text-center text-lg">Owns</div>
        <div className="flex-1 text-center text-lg">Now</div>
        <div className="flex-1 text-center text-lg">Past</div>
        <div className="flex-1 text-center"></div>
        <div></div>
      </div>

      {Object.entries(userData.assets!).map(([k, v]) => {
        const { current, previous, delta, deltaPercent } = itemPriceMap[k];

        let textColor = "text-foreground";
        let deltaIcon = <Triangle size={16} />;

        if (current > previous) textColor = "text-green-1";
        else if (current < previous) {
          textColor = "text-red-1";
          deltaIcon = <Triangle size={16} className="rotate-180" />;
        }

        return (
          <div
            key={k}
            className="flex md:flex-row flex-col w-full my-4 pb-2 items-center border-b border-primary-200"
          >
            <div className="mx-2 md:mb-0 mb-2 md:w-24 w-full flex md:flex-col flex-row items-center justify-center md:gap-1 gap-4">
              <div className="md:w-17 md:h-16 w-14 h-13 flex items-center justify-center border border-primary-950 rounded">
                {k.slice(0, 1)}
              </div>
              <div>{k}</div>
              <div className="text-center text-2xl md:hidden md:ml-0 ml-auto md:mr-0 mr-4">
                {v}
              </div>
            </div>
            <div className="w-20 text-center text-2xl md:block hidden">{v}</div>
            <div
              className={`md:my-0 my-1 flex-1 text-center text-2xl ${textColor}`}
            >
              ${currencyStr(current)}
            </div>
            <div
              className={`md:my-0 my-1 flex-1 text-center text-2xl ${textColor}`}
            >
              ${currencyStr(previous)}
            </div>
            <div
              className={`md:mt-0 mt-2 flex flex-1 md:flex-col flex-row md:gap-0 gap-3 text-lg ${textColor}`}
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
  );
});
interface AssetsTableProps {
  userData: UserData;
  itemPriceMap: Record<string, ItemApiData>;
}
