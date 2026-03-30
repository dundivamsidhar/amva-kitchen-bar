import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/lib/CartContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AmVa Kitchen & Bar — Hyderabad",
  description:
    "Hyderabad's most exciting bar & restaurant. Bold Deccan flavours, signature cocktails, and an atmosphere like no other. Book your table in Jubilee Hills.",
  keywords:
    "restaurant Hyderabad, bar Hyderabad, Hyderabadi biryani, cocktail bar, AmVa Kitchen, fine dining Hyderabad",
  openGraph: {
    title: "AmVa Kitchen & Bar — Hyderabad",
    description:
      "Bold Deccan flavours. Signature cocktails. One address in Hyderabad.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: "#1E160D",
                color: "#F5EDD6",
                border: "1px solid rgba(212,160,23,0.4)",
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
