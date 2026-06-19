import { Nunito, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata = {
  title: "Peteora - Premium Interactive Cat Scratcher Storefront",
  description: "Experience the premium shape-shifting magnetic cat scratcher toy. 3-in-1 interactive ball track and cardboard lounge for kittens and cats. Fast US tracked delivery.",
  keywords: "peteora, kitty kurlz, cat scratcher, cardboard cat toy, interactive cat toy, shape-shifting scratcher, magnetic cat track",
  alternates: {
    canonical: "https://peteora.com",
  },
  openGraph: {
    title: "Peteora - Premium Interactive Cat Toys & Scratchers",
    description: "Keep your feline friend active and entertained with Kitty Kurlz! 3-in-1 interactive shape-shifting toy. Fast US tracked delivery.",
    url: "https://peteora.com",
    siteName: "Peteora",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${nunito.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full d-flex flex-column bg-white text-charcoal-dark">
        <CartProvider>
          <Header />
          <main className="flex-grow-1">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
