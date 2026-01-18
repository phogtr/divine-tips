"use client";

import { useEffect, useState } from "react";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface ProgressDialogProps {
  isOpen: boolean;
  closeDialogCallback: () => void;
  isComplete: boolean;
}

export const ProgressDialog: React.FC<ProgressDialogProps> = ({
  isOpen,
  closeDialogCallback,
  isComplete,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen && progress === 0) {
      const timer = setTimeout(() => {
        setProgress(() => generateProgress(1, 3));
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen, progress]);

  useEffect(() => {
    if (isOpen && isComplete) {
      const progressOne = setTimeout(() => {
        setProgress(() => generateProgress(6, 9));

        const progressTwo = setTimeout(() => {
          setProgress(100);
        }, 500);

        return () => clearTimeout(progressTwo);
      }, 300);

      return () => clearTimeout(progressOne);
    }
  }, [isOpen, isComplete]);

  useEffect(() => {
    if (isOpen && progress === 100) {
      const timer = setTimeout(() => {
        closeDialogCallback();
        setProgress(0);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isOpen, progress]);

  return (
    <Dialog open={isOpen} onOpenChange={closeDialogCallback}>
      <DialogTrigger />
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Loading Progress</DialogTitle>

            <VisuallyHidden>
              <DialogDescription>Loading Progress</DialogDescription>
            </VisuallyHidden>
          </DialogHeader>
        </VisuallyHidden>

        <Progress
          value={progress}
          className="h-5 border-white bg-gray-500 [&>div]:bg-white"
        />
      </DialogContent>
    </Dialog>
  );
};

const generateProgress = (min: number, max: number) => {
  return (Math.floor(Math.random() * (max - min + 1)) + min) * 10;
};
