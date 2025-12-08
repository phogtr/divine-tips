"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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

import { BUY_TAX, SELL_TAX, USER_INITIAL_BALANCE } from "@/const/index.const";

import type { ItemApiData } from "@/types/item.type";
import type { EventApiData, EventItem } from "@/types/event.type";
import type { UserData } from "@/types/user.type";

interface ItemContainerProps {
  initItemData: ItemApiData[];
}

export const ItemContainer: React.FC<ItemContainerProps> = ({
  initItemData,
}) => {
  const queryClient = useQueryClient();

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
  const [startInitialEvent, setStartInitialEvent] = useState(false);

  const [endingDay, setEndingDay] = useState(0); // to invalidate query-cache
  const [startFetchEndDay, setStartFetchEndDay] = useState(false);

  const [startFetchItem, setStartFetchItem] = useState(false);
  const [items, setItems] = useState(initItemData);

  const [renderMap, setRenderMap] = useState<Record<number, boolean>>(() =>
    initItemData.reduce(
      (acc, val) => ({
        ...acc,
        [val.id]: false,
      }),
      {}
    )
  );
  const [isToggleAll, setIsToggleAll] = useState(false);

  ///////////////////////////////////////////////////////////////////////////
  const { data: initEventData } = useQuery({
    queryKey: ["init-event"],
    queryFn: fetchEventData,
    enabled: startInitialEvent === true,
    select: (d) => d[0].data,
  });

  const { data: nextDayEventData } = useQuery({
    queryKey: ["end-day", endingDay],
    queryFn: endDayApi,
    enabled: startFetchEndDay === true,
  });

  const { data: itemData } = useQuery({
    queryKey: ["items", endingDay],
    queryFn: getItemsApi,
    enabled: startFetchItem === true,
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

    setStartInitialEvent(true);
  };

  const onClickSubmitSignUp = () => {
    if (signUpInput !== "") {
      setUserData({
        name: signUpInput,
        balance: USER_INITIAL_BALANCE,
        assets: null,
      });
    }

    closeSignUpDialog();
  };

  ///////////////////////////////////////////////////////////////////////////
  // event
  const closeEventDialog = () => {
    setEventDialog(false);
    setStartInitialEvent(false);
    setStartFetchEndDay(false);
    setStartFetchItem(false);
  };

  ///////////////////////////////////////////////////////////////////////////
  // end day
  const onClickEndDay = () => {
    // ensure initEventData is null
    // else eventData below might flash-render this data, then render next-day data
    queryClient.removeQueries({ queryKey: ["init-event"] });

    setEndingDay((prev) => prev + 1);
    setStartFetchEndDay(true);
    setTimeout(() => {
      setStartFetchItem(true);
    }, 700);
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
    if (startInitialEvent || startFetchEndDay) {
      setEventDialog(true);
    }
  }, [startInitialEvent, startFetchEndDay]);

  useEffect(() => {
    if (itemData) {
      setItems(itemData);
    }
  }, [itemData]);

  useEffect(() => {
    if (Object.values(renderMap).every((v) => v)) {
      setIsToggleAll(true);
    } else {
      setIsToggleAll(false);
    }
  }, [renderMap]);

  ///////////////////////////////////////////////////////////////////////////

  let eventData = null;
  if (nextDayEventData) {
    eventData = nextDayEventData;
  } else if (initEventData) {
    eventData = initEventData;
  }

  let eventContent = null;
  if (eventData) {
    eventContent = (
      <Dialog open={eventDialog} onOpenChange={closeEventDialog}>
        <DialogTrigger />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Tomorrow</DialogTitle>
          </DialogHeader>

          <div>
            {eventData.map((d) => (
              <EventContent
                key={d.type}
                data={d}
                isTextStream={true}
                maxWidth="35%"
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <SideItems
        items={initItemData}
        renderMap={renderMap}
        onClickToggleItem={onClickToggleItem}
        isToggleAll={isToggleAll}
        onClickToggleAll={onClickToggleAll}
      />

      <main className="home-main-w overflow-auto">
        <div className="fixed p-2 border border-l-0 border-t-0 border-white">
          <p className="text-xl">Buy Tax: {(BUY_TAX * 100).toFixed(1)}%</p>
          <p className="text-xl">Sell Tax: {(SELL_TAX * 100).toFixed(1)}%</p>
        </div>
        <div className="fixed right-4 bottom-2">
          <button
            className="border border-white rounded-[5px] py-1 px-2 cursor-pointer"
            onClick={onClickEndDay}
          >
            End day
          </button>
        </div>
        <ItemCard items={items} renderMap={renderMap} />
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

const endDayApi = async (): Promise<EventItem[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/day/advance`,
    {
      method: "POST",
    }
  );
  if (!res.ok) throw new Error("failed to end day");

  return res.json();
};

const getItemsApi = async (): Promise<ItemApiData[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/item`);
  if (!res.ok) throw new Error("failed to get items");

  return res.json();
};
