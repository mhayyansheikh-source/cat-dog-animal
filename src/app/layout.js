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
  title: "Peteora - Premium Pet Products for Dogs & Cats",
  description: "Premium supplements, treats, food, and accessories for happy, healthy cats and dogs. Science-backed ingredients, loved by pets worldwide.",
  keywords: "peteora, dog supplements, cat supplements, cat scratcher, pet accessories, interactive toys",
  alternates: {
    canonical: "https://peteora.com",
  },
  openGraph: {
    title: "Peteora - Premium Pet Health, Wellness & Play",
    description: "Premium supplements, treats, food, and accessories for happy, healthy cats and dogs. Science-backed ingredients.",
    url: "https://peteora.com",
    siteName: "Peteora",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/peteora.png",
    shortcut: "/peteora.png",
    apple: "/peteora.png",
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
