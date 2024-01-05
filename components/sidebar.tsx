//import { WithSidebar } from "@/components/with-sidebar";
import LogInOut from "./log-in-out";
import Link from "next/link";
import { Button } from "./ui/button";

export const Sidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row ">
      <SidebarContent />
      <div className="flex-grow p-8  ">{children}</div>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="my-4">
      <span className="text-2xl font-extrabold">purr.io</span>
    </div>
  );
};

const SidebarContent = () => {
  return (
    <div className="flex w-48 p-2 gap-2 flex-col bg-slate-200 rounded-lg  items-center h-screen ">
      <Logo />

      <Button asChild className="purr-navbar-button">
        <Link href={"/search"}>search</Link>
      </Button>
      <Button asChild className="purr-navbar-button">
        <Link href={"/repos"}>repos</Link>
      </Button>
      <Button asChild className="purr-navbar-button">
        <Link href={"/assets"}>assets</Link>
      </Button>
      <Button asChild className="purr-navbar-button">
        <Link href={"/system"}>system</Link>
      </Button>

      <div className="fixed bottom-2 ">
        <LogInOut />
      </div>
    </div>
  );
};
