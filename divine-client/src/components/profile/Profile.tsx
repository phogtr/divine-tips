"use client";

import { useEffect, useState } from "react";

import { CircleCheck } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { SignUpDialog } from "@/components/SignUpDialog";

import { useLocalStorage } from "@/hooks/useLocalStorage";

import type { UserData } from "@/types/user.type";

export const Profile = () => {
  const {
    data: userData,
    setData: setUserData,
    isHydrated: isUserDataHydrate,
    clear: clearUserData,
  } = useLocalStorage<UserData | null>("user", null);

  const { setData: setIsSignUp } = useLocalStorage<boolean>("sign-up", false);

  const [signUpDialog, setSignUpDialog] = useState(false);
  const [signUpInput, setSignUpInput] = useState("");

  const [nameChange, setNameChange] = useState("");

  const [deleteDialog, setDeleteDialog] = useState(false);

  const onClickSubmitSignUp = () => {
    if (signUpInput !== "") {
      setUserData({
        name: signUpInput,
        balance: 500,
      });
      setNameChange(signUpInput);
    }
    setSignUpDialog(false);
  };

  useEffect(() => {
    if (isUserDataHydrate && userData !== null) {
      setNameChange(userData.name);
    }
  }, [isUserDataHydrate]);

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
  if (isUserDataHydrate && userData !== null) {
    profileContent = (
      <main className="flex flex-col h-full w-3/4 m-auto">
        <div className="mt-6 p-2 border border-white rounded-lg">
          <div className="pt-6 flex items-center flex-col">
            <p className="text-3xl font-bold">Profile</p>
            <div className="mt-6 border border-gray-700 w-[97%] text-center" />
          </div>

          <div className="grid grid-cols-[1fr_2fr] py-2">
            <div className="flex flex-col justify-center items-center border-r border-gray-700">
              <div className="flex relative">
                <input
                  type="text"
                  placeholder={userData.name}
                  className="mb-1 px-2 text-center hover:border border-gray-700 rounded-lg font-semibold"
                  value={nameChange}
                  onChange={(e) => {
                    setNameChange(e.target.value);
                  }}
                  name="username"
                  autoComplete="username"
                />
                {nameChange !== "" && nameChange !== userData.name && (
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
              <div className="text-4xl font-bold">${userData.balance}</div>

              <div className="mt-2 grid grid-cols-3">
                <div className="px-4 flex flex-col items-center border-r border-gray-400">
                  <div className="font-semibold">0</div>
                  <p>Unique Assets</p>
                </div>
                <div className="px-4 flex flex-col items-center border-r border-gray-400">
                  <div className="font-semibold">0</div>
                  <p>Total Assets</p>
                </div>
                <div className="px-4 flex flex-col items-center">
                  <div className="text-emerald-300 font-semibold">
                    ${userData.balance}
                  </div>
                  <p>Current Balance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 p-2 border border-white rounded-lg">
          <div className="pt-6 flex items-center flex-col">
            <p className="text-3xl font-bold">Assets</p>
            <div className="mt-6 border border-gray-700 w-[97%] text-center" />
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
    );
  }

  return (
    <>
      <>{signUpContent}</>
      <>{profileContent}</>
    </>
  );
};
