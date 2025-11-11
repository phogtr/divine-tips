"use client";

import { useEffect, useState } from "react";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SignUpDialog } from "@/components/SignUpDialog";

export const Profile = () => {
  const {
    data: userData,
    setData: setUserData,
    isHydrated: isUserDataHydrate,
  } = useLocalStorage<Record<string, any> | null>("user", null);

  const [signUpDialog, setSignUpDialog] = useState(false);
  const [signUpInput, setSignUpInput] = useState("");

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
          onClickSubmitSignUp={() => setSignUpDialog(false)}
        />
      </main>
    );
  }

  return (
    <>
      <>{signUpContent}</>
    </>
  );
};
