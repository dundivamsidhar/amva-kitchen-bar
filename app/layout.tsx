import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/lib/CartContext";

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
    <html lang="en">
      <head>
        {/* Google Fonts loaded at runtime — avoids build-time network dependency */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <FloatingCart />
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
