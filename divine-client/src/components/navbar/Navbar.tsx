import Link from "next/link";

import { UserBalance } from "./UserBalance";

export const Navbar = () => {
  const linkUnderlineClass =
    "h-0.5 w-0 bg-accent-700 duration-400 ease-in-out group-hover:w-full";

  return (
    <nav className="h-(--navbar-h) px-2 flex items-center border border-primary-900">
      <div className="flex w-full grow-1 shrink-2 justify-start">
        <Link href={"/"}>
          <h2 className="text-lg sm:text-xl text-nowrap">Divide Tips</h2>
        </Link>
      </div>

      <div className="flex w-full grow-2 shrink-1 items-center justify-center">
        <UserBalance />
      </div>

      <div className="flex w-full grow-1 shrink-2 justify-end gap-3 sm:gap-5">
        <Link href={"/"} className="group text-base">
          Market
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
      </div>
    </nav>
  );
};
