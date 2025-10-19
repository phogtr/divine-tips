import { Suspense } from "react";

import { EventCard } from "@/components/event/EventCard";

const Page = async () => {
  let eventApiData = [];
  try {
    const res = await fetch(`${process.env.API_URL}/v1/event`);
    eventApiData = await res.json();
  } catch (error) {
    eventApiData = [];
  }

  return (
    <div className="page-h">
      <Suspense fallback={<h1>Loading...</h1>}>
        <EventCard eventApiData={eventApiData} />
      </Suspense>
    </div>
  );
};

export default Page;
