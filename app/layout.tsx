import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/contact/WhatsAppButton";

export const metadata: Metadata = {
  title: {
    default: "CoolTrips — Premium Flight Search",
    template: "%s | CoolTrips",
  },
  description:
    "Search and compare flights with CoolTrips. Our travel experts handle your booking personally — affordable prices, verified airlines, 24/7 support.",
  keywords: ["flight search", "travel agency", "cheap flights", "book flights India", "cooltrips"],
  openGraph: {
    title: "CoolTrips — Premium Flight Search",
    description: "Search flights, compare prices, let our travel team handle the rest.",
    type: "website",
    locale: "en_IN",
    siteName: "CoolTrips",
  },
  twitter: {
    card: "summary_large_image",
    title: "CoolTrips — Premium Flight Search",
    description: "Search flights, compare prices, let our travel team handle the rest.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
