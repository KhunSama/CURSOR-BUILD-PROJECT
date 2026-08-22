import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Calorie Quest",
  description: "Track meals, confirm AI estimates, and level up your nutrition habits.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
