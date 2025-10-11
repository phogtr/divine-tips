import { ItemCard } from "@/components/ItemCard";
import { SideItems } from "@/components/SideItems";

export default function Home() {
  return (
    <div className="h-[calc(100dvh-50px)] flex">
      <SideItems />

      <main className="w-[calc(100dvw-108px)] overflow-auto">
        <ItemCard />
      </main>
    </div>
  );
}
