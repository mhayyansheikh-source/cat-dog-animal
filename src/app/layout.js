import { Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Zesty Paws Headless Storefront - Premium Dog & Cat Supplements",
  description: "Experience premium clinical-grade pet supplements at direct-to-consumer prices. Certified natural joint, calming, allergy, and immune support bites for dogs and cats. Fast US tracked delivery.",
  keywords: "zesty paws, dog supplements, cat joint support, calming bites, puppy vitamins, allergy immune pet supplements",
  alternates: {
    canonical: "https://cat-dog-animal.vercel.app",
  },
  openGraph: {
    title: "Zesty Paws Headless Storefront - Premium Pet Wellness",
    description: "Veterinarian-recommended clinical supplement bites for cats and dogs. Fast US tracked delivery.",
    url: "https://cat-dog-animal.vercel.app",
    siteName: "Zesty Paws Headless",
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
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
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
