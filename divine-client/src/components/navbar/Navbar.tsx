import Link from "next/link";

import { ThemeToggle } from "../theme/ThemeToggle";

import { UserBalance } from "./UserBalance";

export const Navbar = () => {
  return (
    <nav className="h-(--navbar-h) flex items-center px-2 border border-white">
      <div className="flex w-full grow-1 shrink-2 justify-start">
        <Link href={"/"}>
          <h2 className="text-xl">Divide Tips</h2>
        </Link>
      </div>

      <div className="flex w-full grow-2 shrink-1 items-center justify-center">
        <UserBalance />
      </div>

      <div className="flex w-full grow-1 shrink-2 justify-end gap-5">
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
