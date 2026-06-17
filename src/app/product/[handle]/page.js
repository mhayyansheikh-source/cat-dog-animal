import productsData from "@/data/products.json";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import CartDrawer from "@/components/CartDrawer";
import { notFound } from "next/navigation";

// Dynamic metadata generator for search crawler indexing
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const handle = resolvedParams.handle;
  const product = productsData.find((p) => p.handle === handle);
  
  if (!product) return { title: "Product Not Found" };
  
  return {
    title: `${product.title} - Zesty Paws Headless Storefront`,
    description: `Buy ${product.title} online. Premium active ingredients (DE111, AlaskOmega), fast US tracked shipping, and 30-day happiness guarantee.`,
    alternates: {
      canonical: `https://cat-dog-animal.vercel.app/products/${product.handle}`,
    },
    openGraph: {
      title: `${product.title} - Premium Supplement Bites`,
      description: `Shop veterinarian-approved ${product.title} with clinical bio-actives. Guaranteed direct savings.`,
      images: [product.images[0]],
      url: `https://cat-dog-animal.vercel.app/products/${product.handle}`,
    }
  };
}

// Static route pre-generation (SSG) for ultra-fast LCP metrics
export async function generateStaticParams() {
  return productsData.map((p) => ({
    handle: p.handle,
  }));
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const handle = resolvedParams.handle;
  const product = productsData.find((p) => p.handle === handle);
  
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
      "name": "Zesty Paws Headless"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": product.price,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "url": `https://cat-dog-animal.vercel.app/products/${product.handle}`
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
