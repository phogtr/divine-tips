import { Navbar } from "@/components/navbar/Navbar";

import { Toaster } from "@/components/ui/toast";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Navbar />

      <Toaster expand={true} position="top-right" />

      {children}
    </div>
  );
}
