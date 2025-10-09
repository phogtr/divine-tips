import { SideItems } from "@/components/SideItems";

export default function Home() {
  return (
    <div className="h-[calc(100dvh-50px)] flex">
      <SideItems />

      <main>
        <h1 className="text-2xl">hello world</h1>
      </main>
    </div>
  );
}
