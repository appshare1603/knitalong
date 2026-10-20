import type { Metadata } from "next";
import "@livekit/components-styles";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "KnitAlong | Zusammen stricken",
  description: "Das digitale Strickwohnzimmer für gemeinsame Live-Sessions.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className="min-h-full flex flex-col"><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
