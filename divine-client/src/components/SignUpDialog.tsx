import type { ChangeEvent, MouseEvent } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SignUpDialogProps {
  isOpenDialog: boolean;
  onDialogChange: () => void;
  signUpInput: string;
  onChangeSignUpInput: (e: ChangeEvent<HTMLInputElement>) => void;
  onClickSubmitSignUp: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const SignUpDialog: React.FC<SignUpDialogProps> = ({
  isOpenDialog,
  onDialogChange,
  signUpInput,
  onChangeSignUpInput,
  onClickSubmitSignUp,
}) => {
  return (
    <Dialog open={isOpenDialog} onOpenChange={onDialogChange}>
      <DialogTrigger />
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Welcome to Divine Tips!
          </DialogTitle>
        </DialogHeader>

        <div>
          <p className="text-sm my-2">Let's start by entering username</p>

          <input
            type="text"
            placeholder="Username"
            className="border border-white rounded w-full h-10 p-2 mb-5"
            value={signUpInput}
            onChange={onChangeSignUpInput}
          />

          <p className="text-sm">
            Optionally, you can close this and continue without username
          </p>
          <p className="text-sm">But some features will be hidden</p>
          <p className="text-sm mb-3.5">
            Navigate to <b>Profile</b> at the top to open this again
          </p>

          <p className="text-sm mb-5">Have fun!</p>

          <div className="text-center">
            <button
              className="border border-white rounded-[5px] py-2 px-4 cursor-pointer disabled:cursor-not-allowed disabled:border-gray-600"
              onClick={onClickSubmitSignUp}
              disabled={signUpInput === ""}
            >
              Submit
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
