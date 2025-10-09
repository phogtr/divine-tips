import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="flex justify-between items-center h-[50px] px-2 border border-white">
      <div>
        <Link href={"/"}>
          <h2 className="text-xl">Divide Tips</h2>
        </Link>
      </div>
      <div className="flex gap-5">
        <Link href={"/"} className="text-base">
          Market
        </Link>
        <Link href={"/event"} className="text-base">
          Event
        </Link>
        <Link href={"/info"} className="text-base">
          Info
        </Link>
        <Link href={"/profile"} className="text-base">
          Profile
        </Link>
      </div>
    </nav>
  );
};
