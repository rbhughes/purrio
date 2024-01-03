//import { MenuIcon } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const WithMobileSidebar = ({
  children,
  sidebarContent: SidebarContent,
  mobileDashboardHeader: MobileDashboardHeader,
}: {
  children: React.ReactNode;
  sidebarContent: () => JSX.Element;
  mobileDashboardHeader?: () => JSX.Element;
}) => {
  return (
    <>
      <Sheet>
        <div className="mt-5 flex md:hidden">
          <div className="flex flex-1">
            {MobileDashboardHeader && <MobileDashboardHeader />}
          </div>
          <SheetTrigger>
            (menuicon)
            {/* <MenuIcon size={24} /> */}
          </SheetTrigger>
        </div>
        <SheetContent side="left">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      {children}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const WithDesktopSidebar = ({
  children,
  sidebarContent: SidebarContent,
}: {
  children: React.ReactNode;
  sidebarContent: () => JSX.Element;
}) => {
  return (
    // style used from here -> https://github.com/shadcn-ui/ui/blob/1cf5fad881b1da8f96923b7ad81d22d0aa3574b9/apps/www/app/docs/layout.tsx#L12
    <div className="flex h-screen  ">
      <aside className="hidden sm:block ">
        {/* <div className="flex bg-red-400 items-center"> */}
        <SidebarContent />
        {/* </div> */}
      </aside>

      {/*  */}

      {/* <div className="flex-grow bg-green-100 w-9/12">{children}</div> */}
      <div className="flex-grow bg-green-100 ">{children}</div>

      {/*  */}

      {/* <aside className="hidden sm:block bg-yellow-200 h-screen flex-grow">
        <div className="bg-purple-400">some other content</div>
      </aside> */}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export const WithSidebar = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  sidebarContent: () => JSX.Element;
  mobileDashboardHeader?: () => JSX.Element;
}) => {
  return (
    <div className="flex bg-gold-500">
      <WithDesktopSidebar {...props}>
        <WithMobileSidebar {...props}>{children}</WithMobileSidebar>
      </WithDesktopSidebar>
    </div>
  );
};
