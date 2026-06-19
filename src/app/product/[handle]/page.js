import { getShopifyProductByHandle, getShopifyProducts } from "@/utils/shopify";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import CartDrawer from "@/components/CartDrawer";
import { notFound } from "next/navigation";

export const runtime = "edge";

// Dynamic metadata generator for search crawler indexing
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const handle = resolvedParams.handle;
  const product = await getShopifyProductByHandle(handle);
  
  if (!product) return { title: "Product Not Found" };
  
  return {
    title: `${product.title} - Peteora`,
    description: `Buy ${product.title} online. 3-in-1 shape-shifting interactive cardboard cat scratcher toy, fast US tracked shipping, and 30-day satisfaction guarantee.`,
    alternates: {
      canonical: `https://peteora.com/products/${product.handle}`,
    },
    openGraph: {
      title: `${product.title} - Premium Cat Scratcher Toy`,
      description: `Shop the shape-shifting magnetic ${product.title} scratcher. Satisfy scratching instincts and save your furniture.`,
      images: [product.images[0]],
      url: `https://peteora.com/products/${product.handle}`,
    }
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const handle = resolvedParams.handle;
  const product = await getShopifyProductByHandle(handle);
  
  if (!product) {
    notFound();
  }

  // Structured JSON-LD Schema (GEO & AEO search optimization)
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": product.images[0] || "",
    "description": product.body_html ? product.body_html.replace(/<[^>]*>/g, "") : "",
    "sku": product.variants[0]?.sku || "",
    "brand": {
      "@type": "Brand",
      "name": "Peteora"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": product.price,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "url": `https://peteora.com/products/${product.handle}`
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "184"
    }
  };

  return (
    <div className="container py-4">
      {/* Schema Injection for Generative Search Crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Interactive PDP Client section */}
      <ProductDetailsClient product={product} />

      {/* Dynamic slide-out Cart overlay */}
      <CartDrawer />
    </div>
  );
}
