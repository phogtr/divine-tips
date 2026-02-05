import type { ChangeEvent, MouseEvent } from "react";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
      <DialogContent className="bg-primary-50">
        <DialogHeader>
          <DialogTitle className="text-center">
            Welcome to Divine Tips!
          </DialogTitle>

          <VisuallyHidden>
            <DialogDescription>Welcoming</DialogDescription>
          </VisuallyHidden>
        </DialogHeader>

        <div>
          <p className="text-sm my-2">Let&apos;s start by entering username</p>

          <input
            type="text"
            placeholder="Username"
            className="w-full h-10 p-2 mb-5 bg-primary-50 rounded border border-primary-900"
            value={signUpInput}
            onChange={onChangeSignUpInput}
            name="username"
            autoComplete="username"
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
              className="py-2 px-4 bg-primary-600 text-background border border-primary-900 rounded-[5px] cursor-pointer hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
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
