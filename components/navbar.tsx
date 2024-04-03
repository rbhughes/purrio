// "use client";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { usePathname } from "next/navigation";

// export const Navbar = () => {
//   const pathname = usePathname();

//   return (
//     <div>
//       <Button
//         asChild
//         className={
//           pathname === "/search"
//             ? "purr-navbar-button-active rounded-l-full"
//             : "purr-navbar-button rounded-l-full"
//         }
//       >
//         <Link href={"/search"}>search</Link>
//       </Button>
//       <Button
//         asChild
//         className={
//           pathname === "/repos"
//             ? "purr-navbar-button-active rounded-none"
//             : "purr-navbar-button rounded-none"
//         }
//       >
//         <Link href={"/repos"}>repos</Link>
//       </Button>
//       <Button
//         asChild
//         className={
//           pathname === "/assets"
//             ? "purr-navbar-button-active rounded-none"
//             : "purr-navbar-button rounded-none"
//         }
//       >
//         <Link href={"/assets"}>assets</Link>
//       </Button>
//       <Button
//         asChild
//         className={
//           pathname === "/settings"
//             ? "purr-navbar-button-active rounded-r-full"
//             : "purr-navbar-button rounded-r-full"
//         }
//       >
//         <Link href={"/settings"}>settings</Link>
//       </Button>
//     </div>
//   );
// };

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/search", label: "search" },
  { href: "/repos", label: "repos" },
  { href: "/assets", label: "assets" },
  { href: "/settings", label: "settings" },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="flex">
      {navLinks.map(({ href, label }, index) => {
        let buttonClassName = "purr-navbar-button ";

        switch (true) {
          case index === 0:
            buttonClassName += "rounded-l-full ";
            break;
          case index === navLinks.length - 1:
            buttonClassName += "rounded-r-full ";
            break;
          default:
            buttonClassName += "rounded-none ";
            break;
        }

        if (pathname === href) {
          buttonClassName += "purr-navbar-button-active";
        }

        return (
          <Button key={href} asChild className={buttonClassName}>
            <Link href={href}>{label}</Link>
          </Button>
        );
      })}
    </div>
  );
};
