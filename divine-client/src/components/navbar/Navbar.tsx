import Link from "next/link";

import { ThemeToggle } from "../theme/ThemeToggle";

import { UserBalance } from "./UserBalance";

export const Navbar = () => {
  const linkUnderlineClass =
    "h-0.5 w-0 bg-white duration-400 ease-in-out group-hover:w-full";

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
        <Link href={"/"} className="group text-base">
          Market
          <div className={linkUnderlineClass} />
        </Link>
        <Link href={"/event"} className="group text-base">
          Event
          <div className={linkUnderlineClass} />
        </Link>
        <Link href={"/info"} className="group text-base">
          Info
          <div className={linkUnderlineClass} />
        </Link>
        <Link href={"/profile"} className="group text-base">
          Profile
          <div className={linkUnderlineClass} />
        </Link>

        <ThemeToggle />
      </div>
    </nav>
  );
};
