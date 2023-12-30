import { WithSidebar } from "@/components/with-sidebar";
import AuthButton from "./AuthButton";
import Link from "next/link";
import { Button } from "./ui/button";

export const Sidebar = ({
  children,
}: {
  children: React.ReactNode;
  //hasSession: boolean;
}) => {
  return (
    <WithSidebar
      sidebarContent={SidebarContent}
      mobileDashboardHeader={CustomHeader}
    >
      <div className="p-10 bg-blue-300  ">{children}</div>
    </WithSidebar>
  );
};

const CustomHeader = () => {
  return (
    <div className="flex px-4 ">
      <span className="text-2xl font-extrabold">Floop</span>
    </div>
  );
};

const SidebarContent = () => {
  return (
    <div>
      <CustomHeader />
      <h1>HEADER</h1>
      <Link
        key={"search"}
        href={"/search"}
        className="block rounded px-4 py-2.5 transition duration-200 hover:bg-cyan-900"
      >
        search
      </Link>
      <Link
        key={"repos"}
        href={"/repos"}
        className="block rounded px-4 py-2.5 transition duration-200 hover:bg-cyan-400"
      >
        repos
      </Link>

      <h1>ASSET</h1>
      <Link
        key={"assets"}
        href={"/assets"}
        className="block rounded px-4 py-2.5 transition duration-200 hover:bg-cyan-900"
      >
        assets
      </Link>

      <AuthButton />
    </div>
  );
};
