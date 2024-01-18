import "./globals.css";
import "@repo/ui/styles.css";
import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";

const playfairDisplay = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Poker Chips",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" className={playfairDisplay.className}>
      <body>{children}</body>
    </html>
  );
}
