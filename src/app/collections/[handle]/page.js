import React from "react";
import { getShopifyProducts, getShopifyCollectionByHandle } from "@/utils/shopify";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import BundlesSection from "@/components/BundlesSection";
import CollectionSidebar from "@/components/CollectionSidebar";
import Link from "next/link";
import { notFound } from "next/navigation";

export const runtime = "edge";

const COLLECTION_CONFIGS = {
  "dogs": {
    title: "Premium Dog Products",
    subtitle: "Science-backed supplements, nutritious treats, gourmet food, and enriching accessories for your best friend.",
    badge: "🐶 For Your Dog",
    gradient: "linear-gradient(135deg, var(--orange-light), var(--cream))",
    badgeBg: "var(--orange-light)",
    badgeColor: "var(--orange-dark)",
    sidebar: {
      categories: [
        { label: "All Products" },
        { label: "Supplements" },
        { label: "Treats & Chews" },
        { label: "Food" },
        { label: "Accessories" },
      ],
    },
  },
  "cats": {
    title: "Premium Cat Products",
    subtitle: "Vet-formulated supplements, irresistible treats, premium food, and thoughtfully designed accessories for your companion.",
    badge: "🐱 For Your Cat",
    gradient: "linear-gradient(135deg, #E0F5F2, #FDFAF5)",
    badgeBg: "var(--teal-light)",
    badgeColor: "var(--teal-dark)",
    sidebar: {
      categories: [
        { label: "All Products" },
        { label: "Interactive Toys" },
        { label: "Scratchers" },
        { label: "Supplements" },
        { label: "Treats" },
      ],
    },
  },
  "accessories": {
    title: "Pet Accessories & Gear",
    subtitle: "Beds, toys, carriers, collars, and everything that makes your pet's life more comfortable and fun.",
    badge: "🎾 Accessories",
    gradient: "linear-gradient(135deg, #F3F4F6, #FDFAF5)",
    badgeBg: "#EDE9FE",
    badgeColor: "#5B21B6",
    sidebar: {
      categories: [
        { label: "All Products" },
        { label: "For Dogs" },
        { label: "For Cats" },
        { label: "For Both" },
      ],
    },
  },
  "bundles": {
    title: "Value Bundle Packs",
    subtitle: "Vet-curated bundles designed to give your pet a complete wellness routine — at prices that make sense.",
    badge: "🎁 Save More",
    gradient: "linear-gradient(135deg, #FFFBEB, #FEF0E6)",
    badgeBg: "#FEF3C7",
    badgeColor: "#92400E",
    sidebar: null,
  },
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const handle = resolvedParams.handle;
  const config = COLLECTION_CONFIGS[handle];

  if (!config) {
    return { title: "Collection Not Found - Peteora" };
  }

  return {
    title: `${config.title} - Peteora`,
    description: config.subtitle,
    alternates: {
      canonical: `https://peteora.com/collections/${handle}`,
    },
    openGraph: {
      title: `${config.title} - Peteora`,
      description: config.subtitle,
      url: `https://peteora.com/collections/${handle}`,
    }
  };
}

export default async function CollectionPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const handle = resolvedParams.handle;
  const config = COLLECTION_CONFIGS[handle];

  if (!config) {
    notFound();
  }

  // Parse Filters from searchParams
  let filters = [];
  if (resolvedSearchParams.price) {
    const [min, max] = resolvedSearchParams.price.split("-");
    filters.push({ price: { min: parseFloat(min), max: parseFloat(max) } });
  }
  if (resolvedSearchParams.type) {
    filters.push({ productType: resolvedSearchParams.type });
  }

  // Attempt to fetch from Shopify Collection API
  let products = [];
  try {
    const collection = await getShopifyCollectionByHandle(handle, filters);
    if (collection && collection.products) {
      products = collection.products;
    } else {
      // Fallback if collection doesn't exist yet but user wants to see all products
      const liveProducts = await getShopifyProducts();
      products = liveProducts.filter(p => p.tags?.some(t => t.toLowerCase() === handle) || p.product_type?.toLowerCase() === handle);
    }
  } catch (err) {
    console.error("Error fetching collection:", err);
  }

  return (
    <div>
      {/* ── HERO BANNER ── */}
      <section
        style={{
          background: config.gradient,
          borderBottom: "1px solid #E5E7EB",
          padding: "56px 24px 48px",
          textAlign: "center",
        }}
      >
        <div className="container">
          <nav aria-label="breadcrumb" style={{ marginBottom: "20px" }}>
            <ol style={{ display: "flex", justifyContent: "center", listStyle: "none", padding: 0, margin: 0, gap: "6px", fontSize: "13px", color: "#6B7280" }}>
              <li><Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link></li>
              <li style={{ color: "#D1D5DB" }}>/</li>
              <li><Link href="/collections/dogs" style={{ color: "#6B7280", textDecoration: "none" }}>Collections</Link></li>
              <li style={{ color: "#D1D5DB" }}>/</li>
              <li style={{ color: "var(--orange)", fontWeight: "600" }}>{config.title}</li>
            </ol>
          </nav>
          <div style={{ marginBottom: "20px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: config.badgeBg, color: config.badgeColor, border: `1.5px solid ${config.badgeColor}44`, borderRadius: "100px", padding: "7px 20px", fontSize: "13px", fontWeight: "800" }}>
              {config.badge}
            </span>
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: "800", color: "var(--charcoal, #2A2A2A)", lineHeight: "1.08", marginBottom: "18px" }}>
            {config.title}
          </h1>
          <p style={{ fontSize: "17px", color: "#6B7280", maxWidth: "640px", margin: "0 auto", lineHeight: "1.65" }}>
            {config.subtitle}
          </p>
        </div>
      </section>

      {/* ── MAIN BODY ── */}
      <div className="container" style={{ padding: "48px 24px 80px" }}>
        {handle === "bundles" ? (
          <BundlesSection dynamicProducts={products} />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "40px", alignItems: "start" }}>
            {/* ══ SIDEBAR ══ */}
            {config.sidebar && (
              <CollectionSidebar sidebarConfig={config.sidebar} />
            )}

            {/* ══ PRODUCT GRID ══ */}
            <div>
              {products.length > 0 ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid #E5E7EB" }}>
                    <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Showing <strong style={{ color: "#2A2A2A" }}>{products.length}</strong> products</p>
                    <span style={{ fontSize: "13px", color: "#6B7280", fontWeight: "600" }}>Sort: Featured</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "80px 40px", background: "#F9FAFB", borderRadius: "16px", border: "1px solid #E5E7EB" }}>
                  <div style={{ fontSize: "64px", marginBottom: "16px" }}>📦</div>
                  <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: "24px", fontWeight: "700", color: "#2A2A2A", marginBottom: "12px" }}>
                    No Products Found
                  </h3>
                  <p style={{ fontSize: "15px", color: "#6B7280", maxWidth: "420px", margin: "0 auto 28px" }}>
                    Try adjusting your filters or check back later when new products arrive.
                  </p>
                  <Link href="/collections/dogs" style={{ color: "var(--orange)", fontWeight: "700", fontSize: "14px", textDecoration: "none" }}>
                    ← View All Products
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <CartDrawer />
    </div>
  );
}
