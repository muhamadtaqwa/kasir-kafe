import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { playfair, inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Kasir Kafe",
  description: "Aplikasi kasir kafe",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[var(--font-inter)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}