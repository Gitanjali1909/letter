import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Letter App | Collaborative Letter Editor",
  description: "A warm, collaborative space for creating digital letters.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

function ThemeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full bg-[#fdf6ec] antialiased`}
    >
      <body className="min-h-screen bg-[#fdf6ec] font-sans text-[#3f352c]">
        <ThemeProvider>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.72),_transparent_34rem),linear-gradient(180deg,_#fdf6ec_0%,_#f8efe2_100%)]">
            <main className="min-h-[calc(100vh-4rem)] w-full">
              {children}
            </main>

          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}