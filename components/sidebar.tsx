//import { WithSidebar } from "@/components/with-sidebar";
import LogInOut from "./log-in-out";
import Link from "next/link";
import RealtimeMessenger from "@/components/realtime-messenger";
import { Button } from "./ui/button";
import { User } from "@supabase/supabase-js";

//import TableVisSwitch from "./table-vis-switch";

export const Sidebar = ({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-row ">
      <SidebarContent user={user} />
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

const SidebarContent = ({ user }: { user: User }) => {
  return (
    <div className="purr-navbar flex flex-1 flex-col items-center grow-0 gap-2 p-2 justify-between">
      <div className="flex flex-col gap-2  ">
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
        <div id="table-or-viz"></div>
      </div>

      {/* */}
      {/* <TableVisSwitch compA={<h1>COMP A</h1>} compB={<h1>COMP B</h1>} /> */}

      <div className="flex flex-col gap-2">
        <RealtimeMessenger user={user} directive={"recon"} />
        <LogInOut />
      </div>
    </div>
  );
};
