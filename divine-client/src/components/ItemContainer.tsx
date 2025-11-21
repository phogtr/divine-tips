"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { SideItems } from "@/components/SideItems";
import { ItemCard } from "@/components/ItemCard";
import { SignUpDialog } from "@/components/SignUpDialog";
import { EventContent } from "@/components/event/EventContent";

import { useLocalStorage } from "@/hooks/useLocalStorage";

import type { ItemApiData } from "@/types/item.type";
import type { EventApiData } from "@/types/event.type";
import type { UserData } from "@/types/user.type";

interface ItemContainerProps {
  itemApiData: ItemApiData[];
}

export const ItemContainer: React.FC<ItemContainerProps> = ({
  itemApiData,
}) => {
  const {
    data: userData,
    setData: setUserData,
    isHydrated: isUserDataHydrate,
  } = useLocalStorage<UserData | null>("user", null);

  const {
    data: isSignUp,
    setData: setIsSignUp,
    isHydrated: isSignUpHydrate,
  } = useLocalStorage<boolean>("sign-up", false);

  ///////////////////////////////////////////////////////////////////////////
  const [signUpDialog, setSignUpDialog] = useState(false);
  const [signUpInput, setSignUpInput] = useState("");

  const [eventDialog, setEventDialog] = useState(false);
  const [startFetchEvent, setStartFetchEvent] = useState(false);

  const [renderMap, setRenderMap] = useState<Record<number, boolean>>(() =>
    itemApiData.reduce(
      (acc, val) => ({
        ...acc,
        [val.id]: false,
      }),
      {}
    )
  );
  const [isToggleAll, setIsToggleAll] = useState(false);

  ///////////////////////////////////////////////////////////////////////////
  const { data: eventApiData } = useQuery({
    queryKey: ["event"],
    queryFn: fetchEventData,
    enabled: startFetchEvent === true,
  });

  ///////////////////////////////////////////////////////////////////////////
  // item
  const onClickToggleItem = (id: number) => {
    setRenderMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const onClickToggleAll = (state: boolean) => {
    setIsToggleAll(!state);

    setRenderMap((prev) => {
      const newRenderMap: Record<number, boolean> = {};
      for (const key in prev) {
        newRenderMap[Number(key)] = !state;
      }
      return newRenderMap;
    });
  };

  ///////////////////////////////////////////////////////////////////////////
  // sign up
  const closeSignUpDialog = () => {
    setSignUpDialog(false);
    setIsSignUp(true);

    setStartFetchEvent(true);
  };

  const onClickSubmitSignUp = () => {
    if (signUpInput !== "") {
      setUserData({
        name: signUpInput,
        balance: 500,
      });
    }

    closeSignUpDialog();
  };

  ///////////////////////////////////////////////////////////////////////////
  // event
  const closeEventDialog = () => {
    setEventDialog(false);
    setStartFetchEvent(false);
  };

  ///////////////////////////////////////////////////////////////////////////
  const onClickEndDay = () => {
    setStartFetchEvent(true);
  };

  ///////////////////////////////////////////////////////////////////////////
  // useEffect
  useEffect(() => {
    if (
      isSignUpHydrate &&
      isUserDataHydrate &&
      userData === null &&
      !isSignUp
    ) {
      setSignUpDialog(true);
    }
  }, [isSignUpHydrate, isUserDataHydrate]);

  useEffect(() => {
    if (startFetchEvent) {
      setEventDialog(true);
    }
  }, [startFetchEvent]);

  useEffect(() => {
    if (Object.values(renderMap).every((v) => v)) {
      setIsToggleAll(true);
    } else {
      setIsToggleAll(false);
    }
  }, [renderMap]);

  ///////////////////////////////////////////////////////////////////////////
  let eventContent = null;
  if (eventApiData) {
    eventContent = (
      <Dialog open={eventDialog} onOpenChange={closeEventDialog}>
        <DialogTrigger />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Tomorrow</DialogTitle>
          </DialogHeader>

          <div>
            {eventApiData[0].data.map((d) => (
              <EventContent key={d.type} data={d} isTextStream={true} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <SideItems
        itemApiData={itemApiData}
        renderMap={renderMap}
        onClickToggleItem={onClickToggleItem}
        isToggleAll={isToggleAll}
        onClickToggleAll={onClickToggleAll}
      />

      <main className="home-main-w overflow-auto">
        <div className="fixed right-4 bottom-2">
          <button
            className="border border-white rounded-[5px] py-1 px-2 cursor-pointer"
            onClick={onClickEndDay}
          >
            End day
          </button>
        </div>
        <ItemCard itemApiData={itemApiData} renderMap={renderMap} />
      </main>

      {eventContent}

      <SignUpDialog
        isOpenDialog={signUpDialog}
        onDialogChange={closeSignUpDialog}
        signUpInput={signUpInput}
        onChangeSignUpInput={(e) => setSignUpInput(e.target.value)}
        onClickSubmitSignUp={onClickSubmitSignUp}
      />
    </>
  );
};

///////////////////////////////////////////////////////////////////////////
const fetchEventData = async (): Promise<EventApiData[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/event`);
  if (!res.ok) throw new Error("failed to fetch event data");

  return res.json();
};
