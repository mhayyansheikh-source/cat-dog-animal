import { Nunito, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import dynamic from "next/dynamic";
import PageTransition from "@/components/PageTransition";
import ToastProvider from "@/components/ToastProvider";
import { getShopifyMenu } from "@/utils/shopify";

const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });
const CartDrawer = dynamic(() => import("@/components/CartDrawer"));

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
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  }
};

export default async function RootLayout({ children }) {
  const mainMenu = await getShopifyMenu('main-menu');
  const footerMenu = await getShopifyMenu('footer');

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Peteora",
    "url": "https://peteora.com",
    "logo": "https://peteora.com/icon.png",
    "description": "Premium supplements, treats, food, and accessories for happy, healthy cats and dogs.",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "shoppingmaniaglobalstore@gmail.com",
      "contactType": "customer service"
    }
  };

  return (
    <html lang="en" className={`${nunito.variable} ${playfair.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-full d-flex flex-column bg-white text-charcoal-dark">
        <ToastProvider />
        <CartProvider>
          <Header menu={mainMenu} />
          <main className="flex-grow-1">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer menu={footerMenu} />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
