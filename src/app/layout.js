import { Nunito, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import dynamic from "next/dynamic";
import PageTransition from "@/components/PageTransition";
import ToastProvider from "@/components/ToastProvider";
import { getShopifyMenu, getShopInfo, getShopPolicies, getShopifyCollectionsWithProducts } from "@/utils/shopify";

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

export async function generateMetadata() {
  const shop = await getShopInfo();
  const siteName = shop?.name || "Peteora";
  const description = shop?.description || "Premium supplements, treats, food, and accessories for happy, healthy cats and dogs. Science-backed ingredients, loved by pets worldwide.";
  const url = shop?.primaryDomain?.url || "https://peteora.com";

  return {
    title: `${siteName} - Premium Pet Products for Dogs & Cats`,
    description,
    keywords: "peteora, dog supplements, cat supplements, cat scratcher, pet accessories, interactive toys",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${siteName} - Premium Pet Health, Wellness & Play`,
      description,
      url,
      siteName,
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
}

export default async function RootLayout({ children }) {
  const mainMenu = await getShopifyMenu('main-menu');
  const footerMenu = await getShopifyMenu('footer');
  const policies = await getShopPolicies();
  const collectionsData = await getShopifyCollectionsWithProducts(5, 0);

  const shop = await getShopInfo();
  const siteName = shop?.name || "Peteora";
  const siteUrl = shop?.primaryDomain?.url || "https://peteora.com";
  const logoUrl = shop?.brand?.logo?.image?.url || `${siteUrl}/icon.png`;
  const siteDesc = shop?.description || "Premium supplements, treats, food, and accessories for happy, healthy cats and dogs.";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "url": siteUrl,
    "logo": logoUrl,
    "description": siteDesc,
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
          <Header menu={mainMenu} shop={shop} collections={collectionsData} />
          <main className="flex-grow-1">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer menu={footerMenu} mainMenu={mainMenu} shop={shop} policies={policies} collections={collectionsData} />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
