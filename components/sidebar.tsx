"use client";

import { WithSidebar } from "@/components/with-sidebar";
import AuthButton from "../components/AuthButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

//export const Dashboard = () => {
export const Dashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <WithSidebar
      sidebarContent={SidebarContent}
      mobileDashboardHeader={CustomHeader}
    >
      <div className="p-10   ">{children}</div>
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
  const pathname = usePathname();

  return (
    <div>
      <CustomHeader />
      <Link
        key={"repos"}
        href={"/repos"}
        className="block rounded px-4 py-2.5 transition duration-200 hover:bg-cyan-400"
        // className={
        //   pathname === "repos"
        //     ? "bg-muted hover:bg-muted"
        //     : "hover:bg-transparent hover:underline"
        // }
      >
        repos
      </Link>
      <Link
        key={"assets"}
        href={"/assets"}
        className="block rounded px-4 py-2.5 transition duration-200 hover:bg-cyan-900"
        // className={
        //   pathname === "repos"
        //     ? "bg-muted hover:bg-muted"
        //     : "hover:bg-transparent hover:underline"
        // }
      >
        assets
      </Link>

      {/*       
      <div className="mt-6">
        {["Inicio", "Preguntas"].map((item, index) => (
          <a
            key={index}
            href="#"
            className="block rounded px-4 py-2.5 transition duration-200 hover:bg-cyan-900"
          >
            {item}
          </a>
        ))}
      </div> */}
    </div>
  );
};
