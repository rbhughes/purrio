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
        let buttonClassName = "purr-nav-button ";

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
          buttonClassName += "purr-nav-button-active";
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
