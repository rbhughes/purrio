import { WithSidebar } from "@/components/with-sidebar";
import LogInOut from "./log-in-out";
import Link from "next/link";
import { Button } from "./ui/button";

export const Sidebar = ({
  children,
}: {
  children: React.ReactNode;
  //hasSession: boolean;
}) => {
  return (
    <div className="flex flex-row ">
      <div className="flex w-48 flex-col items-center gap-2  rounded-lg bg-slate-200">
        <SidebarContent />
      </div>
      <div className="flex-grow p-4 ">{children}</div>
    </div>
  );

  /*
  return (
    <WithSidebar
      sidebarContent={SidebarContent}
      mobileDashboardHeader={CustomHeader}
    >
      <div className="p-10 bg-blue-300  ">{children}</div>
    </WithSidebar>
  );
  */
};

// w-48 = 12rem = 192px
const CustomHeader = () => {
  return (
    <div className="bg-purple-400 p-2  w-48 m-4">
      <span className="text-2xl font-extrabold">purr.io</span>
    </div>
  );
};

const SidebarContent = () => {
  return (
    <>
      <CustomHeader />

      <Button className="purr-navbar-button">
        <Link href={"/search"}>search</Link>
      </Button>
      <Button className="purr-navbar-button">
        <Link href={"/repos"}>repos</Link>
      </Button>
      <Button className="purr-navbar-button">
        <Link href={"/assets"}>assets</Link>
      </Button>
      <Button className="purr-navbar-button">
        <Link href={"/system"}>system</Link>
      </Button>

      <div className="fixed bottom-2 left-2">
        <LogInOut />
      </div>
    </>
  );
};
