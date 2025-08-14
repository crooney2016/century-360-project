import "./globals.css";
import "../styles/animations.css";
import type { Metadata } from "next";
import { ChakraProvider } from "../components/ChakraProvider";
import { NavigationProvider } from "../contexts/NavigationContext";

export const metadata: Metadata = {
  title: "Century 360° Enterprise",
  description: "Enterprise order entry and checkout demo",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <NavigationProvider>{children}</NavigationProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
