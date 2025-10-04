import { type ReactNode } from "react";
import { Navbar } from "@/components/Navbar";

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div>
      <Navbar />

      {children}
    </div>
  );
}
