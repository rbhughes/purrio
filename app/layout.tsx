//import { GeistSans } from "geist/font/sans";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
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
  const session = await sessionExists();

  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <main className="min-h-screen"> */}
          {/* <main className="flex h-screen bg-purple-800"> */}
          {session ? <Sidebar children={children} /> : children}
          {/* </main> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
