import Link from "next/link";

import { ThemeToggle } from "./theme/ThemeToggle";

export const Navbar = () => {
  return (
    <nav className="h-(--navbar-h) flex justify-between items-center px-2 border border-white">
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

        <ThemeToggle />
      </div>
    </nav>
  );
};
