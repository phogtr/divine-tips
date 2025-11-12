"use client";

import { useEffect, useState } from "react";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SignUpDialog } from "@/components/SignUpDialog";

import type { UserData } from "@/types/user.type";

export const Profile = () => {
  const {
    data: userData,
    setData: setUserData,
    isHydrated: isUserDataHydrate,
  } = useLocalStorage<UserData | null>("user", null);

  const [signUpDialog, setSignUpDialog] = useState(false);
  const [signUpInput, setSignUpInput] = useState("");

  const onClickSubmitSignUp = () => {
    if (signUpInput !== "") {
      setUserData({
        name: signUpInput,
        balance: 500,
      });
    }
    setSignUpDialog(false);
  };

  let signUpContent = null;
  if (isUserDataHydrate && userData === null) {
    signUpContent = (
      <main className="flex h-full justify-center items-center">
        <button
          className="border border-white rounded-[5px] py-3 px-4 cursor-pointer"
          onClick={() => setSignUpDialog(true)}
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
      <main>
        <div>{userData.name}</div>
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
