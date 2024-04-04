import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
//import { Sidebar } from "@/components/sidebar";
import { createClient } from "@/utils/supabase/server";
//import { GlobalLayout } from "@/components/global-layout";
import SignInOut from "@/components/sign-in-out";
import { Navbar } from "@/components/navbar";

import { Logo } from "@/components/logo";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "purr.io",
  description: "it's purrio, dawg",
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* {user ? <Sidebar user={user} children={children} /> : children} */}
          {/* <GlobalLayout>{children}</GlobalLayout> */}

          <div className="flex flex-col min-h-screen items-center">
            <nav
              className="flex w-full border-b border-b-foreground/10 h-14 px-5 \
              bg-gradient-to-t from-secondary"
            >
              <div className="flex  w-full items-center justify-between">
                <div className="flex flex-row">
                  {/* <Logo className="mr-10" /> */}
                  <Logo variant="mdHorizontal" />
                </div>
                {user && <Navbar />}
                <div className="">
                  <SignInOut />
                </div>
              </div>
            </nav>

            <main className="flex flex-grow w-full flex-col p-5 ">
              {children}
            </main>

            <footer
              className="w-full h-[60px] border-t border-t-foreground/10 \
             flex justify-center items-center bg-gradient-to-b from-secondary"
            >
              footsie
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
