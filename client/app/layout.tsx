import type { Metadata, Viewport } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { SocketProvider } from "@/store/SocketProvider";
import Head from "next/head";

const poppins = Poppins({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "KeyStorm - Smash the Keys!",
  description:
    "Enhance your typing skills with KeyStorm - a real-time typing speed testing platform featuring multiplayer challenges, instant WPM tracking, accuracy metrics, and competitive typing races. Practice solo or compete with friends to become the fastest typist.",
  authors: [{ name: "Danish Siddiqui" }],
  keywords: [
    "typing test",
    "typing speed",
    "multiplayer typing game",
    "WPM calculator",
    "typing accuracy",
    "typing practice",
    "typing skills",
    "keyboard speed test",
    "real-time typing",
    "typing competition",
    "typing race",
    "online typing test",
    "typing metrics",
    "typing performance",
    "speed typing",
  ],
  creator: "Danish Siddiqui",
  publisher: "Danish Siddiqui",
  metadataBase: new URL("https://key-storm.onrender.com/"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "es-ES": "/es-ES",
    },
  },
  openGraph: {
    title: "KeyStorm - Smash the Keys!",
    description:
      "Challenge your friends in real-time typing races or practice solo to improve your typing speed. Track your WPM, accuracy, and errors with KeyStorm's comprehensive typing analytics.",
    url: "https://key-storm.onrender.com/",
    siteName: "KeyStorm",
    images: [
      {
        url: "https://key-storm.onrender.com/images/logo.png",
        width: 1200,
        height: 630,
        alt: "KeyStorm",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KeyStorm - Smash the Keys!",
    description:
      "Join KeyStorm to test your typing speed, compete with friends in real-time races, and track your WPM, accuracy, and typing performance metrics.",
    creator: "@prodanish203",
    images: ["https://key-storm.onrender.com/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Game",
  applicationName: "KeyStorm",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#181818",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body className={cn("antialiased", poppins.className, roboto.variable)}>
        <Toaster richColors position="top-right" />
        <SocketProvider>{children}</SocketProvider>
      </body>
    </html>
  );
}
