import { Navbar } from "@/components/navbar/Navbar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Navbar />

      {children}
    </div>
  );
}
