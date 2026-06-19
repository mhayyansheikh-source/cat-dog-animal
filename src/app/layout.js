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
  title: "Peteora - Premium Dog & Cat Supplements Storefront",
  description: "Experience premium clinical-grade pet supplements at direct-to-consumer prices. Certified natural joint, calming, allergy, and immune support bites for dogs and cats. Fast US tracked delivery.",
  keywords: "peteora, pet supplements, dog supplements, cat joint support, calming bites, puppy vitamins, allergy immune pet supplements",
  alternates: {
    canonical: "https://peteora.com",
  },
  openGraph: {
    title: "Peteora - Premium Pet Wellness Storefront",
    description: "Veterinarian-recommended clinical supplement bites for cats and dogs. Fast US tracked delivery.",
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
