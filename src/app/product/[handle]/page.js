import { getShopifyProductByHandle, getShopifyProducts, getShopifyProductRecommendations } from "@/utils/shopify";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
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
    description: `Buy ${product.title} online at Peteora. Premium pet wellness, accessories, and supplies. Fast US shipping.`,
    alternates: {
      canonical: `https://peteora.com/products/${product.handle}`,
    },
    openGraph: {
      title: `${product.title} - Peteora`,
      description: `Shop ${product.title} at Peteora. Premium care for your companion.`,
      images: [product.images && product.images.length > 0 ? product.images[0] : ""],
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

  const recommendations = await getShopifyProductRecommendations(product.id);

  // Structured JSON-LD Schema (GEO & AEO search optimization)
  const productSchema = {
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How fast is shipping?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We process all orders within 24-48 hours. Standard US delivery typically takes 5-8 business days, and all orders include tracking information."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer a guarantee?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We are so confident your pet will love our products that we offer a 30-day money back guarantee. If you're not satisfied, just reach out to our support team."
        }
      },
      {
        "@type": "Question",
        "name": "Are your products safe for my pet?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. Pet safety is our #1 priority. All our products are vetted, tested, and made from high-quality materials and ingredients to ensure the well-being of your companion."
        }
      }
    ]
  };

  return (
    <div className="container py-4">
      {/* Schema Injection for Generative Search Crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Interactive PDP Client section */}
      <ProductDetailsClient product={product} />

      {/* Recommendations Section */}
      {recommendations && recommendations.length > 0 && (
        <div className="mt-5 pt-5 border-top">
          <h3 className="mb-4 fw-bold" style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif" }}>
            You May Also Like
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
            {recommendations.map((rec) => (
              <ProductCard key={rec.id} product={rec} />
            ))}
          </div>
        </div>
      )}

      {/* Dynamic slide-out Cart overlay */}
      <CartDrawer />
    </div>
  );
}
