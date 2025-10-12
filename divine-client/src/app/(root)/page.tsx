import { ItemCard } from "@/components/ItemCard";
import { SideItems } from "@/components/SideItems";

export default function Home() {
  return (
    <div className="page-h flex">
      <SideItems />

      <main className="home-main-w overflow-auto">
        <ItemCard />
      </main>
    </div>
  );
}
