"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { SideItems } from "@/components/item/SideItems";
import { ItemCard } from "@/components/item/ItemCard";
import { SignUpDialog } from "@/components/SignUpDialog";
import { EventDialog } from "@/components/event/EventDialog";
import { EventDrawer } from "@/components/event/EventDrawer";
import { ProgressDialog } from "@/components/ProgressDialog";
import { EndingDayButton } from "@/components/day/EndingDayButton";
import { DayCount } from "@/components/day/DayCount";
import { TaxInfo } from "./TaxInfo";

import { getItemsApi } from "@/api/item.api";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useQueryEvent } from "@/hooks/useQueryEvent";

import { USER_INITIAL_BALANCE } from "@/const/index.const";
import {
  EVENT_QUERY_KEY,
  END_DAY_QUERY_KEY,
  ITEM_QUERY_KEY,
} from "@/const/query-key.const";

import type { ItemApiData } from "@/types/item.type";
import type { EventItem } from "@/types/event.type";
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

  const [startInitialEvent, setStartInitialEvent] = useState(true);
  const [startFetchEndDay, setStartFetchEndDay] = useState(false);

  const [progressDialog, setProgressDialog] = useState(false);

  const [eventDialog, setEventDialog] = useState(false);

  const [endDayAnimate, setEndDayAnimate] = useState(false);

  const [items, setItems] = useState(initItemData);

  const [renderMap, setRenderMap] = useState<Record<number, boolean>>(() =>
    initItemData.reduce(
      (acc, val) => ({
        ...acc,
        [val.id]: true,
      }),
      {},
    ),
  );

  let isToggleAll = true;
  isToggleAll = Object.values(renderMap).every((v) => v);

  ///////////////////////////////////////////////////////////////////////////
  const { data: nextDayEventData } = useQuery({
    queryKey: [END_DAY_QUERY_KEY],
    queryFn: endDayApi,
    enabled: startFetchEndDay === true,
  });

  const startFetchEventData = startInitialEvent === true || !!nextDayEventData;
  const { data: initEventData } = useQueryEvent({
    isEnable: startFetchEventData,
  });

  const { data: itemData } = useQuery({
    queryKey: [ITEM_QUERY_KEY],
    queryFn: getItemsApi,
    enabled: !!nextDayEventData,
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
  };

  const onClickSubmitSignUp = () => {
    if (signUpInput !== "") {
      setUserData({
        name: signUpInput,
        balance: USER_INITIAL_BALANCE,
        assets: null,
        day: 1,
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
    setEndDayAnimate(true);
  };

  ///////////////////////////////////////////////////////////////////////////
  // end day
  const onClickEndDay = () => {
    setStartInitialEvent(false);

    /**
     * eventData might flash-render initEventData, then render nextDayEventData
     * invalidateQueries seems to cause race-condition between initEventData & nextDayEventData
     * removeQueries guarantee initEventData is null & eventData is using nextDayEventData
     * initEventData is re-fetched after nextDayEventData, but it's ok since eventData already set
     */
    queryClient.removeQueries({ queryKey: [EVENT_QUERY_KEY] });

    queryClient.removeQueries({ queryKey: [END_DAY_QUERY_KEY] });
    queryClient.removeQueries({ queryKey: [ITEM_QUERY_KEY] });

    setStartFetchEndDay(true);
    setProgressDialog(true);
  };

  const updateProgressDialog = () => {
    setProgressDialog(false);
    setEventDialog(true);
  };

  const updateEndDayAnimate = (state: boolean) => {
    setEndDayAnimate(state);
  };

  ///////////////////////////////////////////////////////////////////////////
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
    if (itemData) {
      setItems(itemData);
    }
  }, [itemData]);

  ///////////////////////////////////////////////////////////////////////////

  let eventData = null;
  if (nextDayEventData) {
    eventData = nextDayEventData;
  } else if (initEventData) {
    eventData = initEventData[0].data;
  }

  let eventContent = null;
  if (eventData) {
    eventContent = (
      <EventDialog
        isOpen={eventDialog}
        onOpenChange={closeEventDialog}
        eventData={eventData}
      />
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
        <div className="z-2 fixed flex mx-0.5">
          <TaxInfo />
        </div>

        <div className="fixed mx-0.5 right-0">
          <EventDrawer startFetchEventData={startFetchEventData} />
        </div>

        <div className="mx-12 mt-22 mb-14 flex justify-center">
          <ItemCard items={items} renderMap={renderMap} />
        </div>

        <div className="fixed right-11 bottom-10">
          <EndingDayButton
            onClickEndDay={onClickEndDay}
            isAnimated={endDayAnimate}
            completedCallback={updateEndDayAnimate}
          />
        </div>

        <div className="fixed right-30 bottom-0">
          <DayCount isAnimated={endDayAnimate} />
        </div>
      </main>

      <ProgressDialog
        isOpen={progressDialog}
        closeDialogCallback={updateProgressDialog}
        isComplete={!!nextDayEventData}
      />

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
const endDayApi = async (): Promise<EventItem[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/day/advance`,
    {
      method: "POST",
    },
  );
  if (!res.ok) throw new Error("failed to end day");

  return res.json();
};
