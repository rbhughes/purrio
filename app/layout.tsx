//import { GeistSans } from "geist/font/sans";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { createClient } from "@/utils/supabase/server";
import { sessionExists } from "@/utils/supabase/server";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const session = await sessionExists();

  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body className="bg-background text-foreground bg-green-100">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {session && user ? (
            <Sidebar user={user} children={children} />
          ) : (
            children
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
