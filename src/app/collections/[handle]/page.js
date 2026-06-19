import React from "react";
import { getShopifyProducts } from "@/utils/shopify";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import BundlesSection from "@/components/BundlesSection";
import Link from "next/link";
import { notFound } from "next/navigation";

export const runtime = "edge";

// ─────────────────────────────────────────────────────────────────────────────
// REAL PRODUCTS — sourced from shopify_products_import.csv (Peteora store)
// ─────────────────────────────────────────────────────────────────────────────

// Product 1: Kitty Kurlz Standard Edition
// Handle: kitty-kurlz-the-interactive-mental-physical-exercise-for-cats
// Price: $29.99 | Was: $59.99 | Vendor: Peteora | Type: Cat Supplements
// Tags: cat, toy, interactive, scratcher, mental-exercise, standard
const PRODUCT_KITTY_KURLZ_STANDARD = {
  id: "kitty-kurlz-standard",
  title: "Kitty Kurlz - The Interactive Mental & Physical Exercise for Cats",
  product_type: "Cat Supplements",
  price: "29.99",
  compare_at_price: "59.99",
  images: ["https://marlenespetshop.com/cdn/shop/files/kitty-kurlz.jpg"],
  tags: ["cat", "toy", "interactive", "scratcher", "mental-exercise", "standard"],
  body_html: "<p>Keep your feline friend active and entertained with Kitty Kurlz! This 3-in-1 interactive shape-shifting toy serves as a cat scratcher, ball track, and lounge area. Made from premium, non-toxic double-corrugated cardboard with a magnetic design, it allows you to connect multiple units together to create a larger custom play track. Perfect for physical exercise, mental stimulation, and protecting your home furniture.</p>",
  rating: 4.9,
  reviews: 3200,
  handle: "kitty-kurlz-the-interactive-mental-physical-exercise-for-cats",
  vendor: "Peteora",
  variants: [{ id: "SKU-kitty-kurlz-standard", title: "Default Title", price: "29.99" }],
  inventory: 100,
};

// Product 2: Kitty Kurlz Top Cat Edition
// Handle: kitty-kurlz-the-interactive-mental-physical-exercise-for-cats-top-cat
// Price: $39.99 | Was: $79.99 | Vendor: Peteora | Type: Cat Supplements
// Tags: cat, toy, interactive, scratcher, mental-exercise, top-cat
const PRODUCT_KITTY_KURLZ_TOPCAT = {
  id: "kitty-kurlz-top-cat",
  title: "Kitty Kurlz - Top Cat Edition",
  product_type: "Cat Supplements",
  price: "39.99",
  compare_at_price: "79.99",
  images: ["https://marlenespetshop.com/cdn/shop/files/kitty-kurlz-top-cat.jpg"],
  tags: ["cat", "toy", "interactive", "scratcher", "mental-exercise", "top-cat"],
  body_html: "<p>The Top Cat edition of the ultimate interactive shape-shifting scratcher toy. Designed with double-reinforced cardboard tracks and an upgraded heavier bell ball, this edition is built specifically for larger cat breeds or active multi-cat households to support deep scratching and intense play sessions.</p>",
  rating: 4.8,
  reviews: 1875,
  handle: "kitty-kurlz-the-interactive-mental-physical-exercise-for-cats-top-cat",
  vendor: "Peteora",
  variants: [{ id: "SKU-kitty-kurlz-topcat", title: "Default Title", price: "39.99" }],
  inventory: 100,
};

// All real Peteora products from CSV
const REAL_PRODUCTS = [PRODUCT_KITTY_KURLZ_STANDARD, PRODUCT_KITTY_KURLZ_TOPCAT];

// ─────────────────────────────────────────────────────────────────────────────
// NOTE: Dogs and Accessories data are fetched dynamically via Shopify API
// (getShopifyProducts). These will be populated when products are added
// to the Shopify store for those collections.
// ─────────────────────────────────────────────────────────────────────────────

const COLLECTION_CONFIGS = {
  "dogs": {
    title: "Premium Dog Products",
    subtitle: "Science-backed supplements, nutritious treats, gourmet food, and enriching accessories for your best friend.",
    badge: "🐶 For Your Dog",
    gradient: "linear-gradient(135deg, var(--orange-light), var(--cream))",
    badgeBg: "var(--orange-light)",
    badgeColor: "var(--orange-dark)",
    // Dogs products fetched dynamically from Shopify API
    getProducts: async (liveProducts) => liveProducts,
    sidebar: {
      categories: [
        { label: "All Products", count: liveProducts ? liveProducts.length : 0 },
        { label: "Supplements", count: 8 },
        { label: "Treats & Chews", count: 6 },
        { label: "Food", count: 3 },
        { label: "Accessories", count: 3 },
      ],
      benefits: ["Hip & Joint", "Skin & Coat", "Gut Health", "Immune Health", "Calming & Behavior"],
    },
  },
  "cats": {
    title: "Premium Cat Products",
    subtitle: "Vet-formulated supplements, irresistible treats, premium food, and thoughtfully designed accessories for your companion.",
    badge: "🐱 For Your Cat",
    gradient: "linear-gradient(135deg, #E0F5F2, #FDFAF5)",
    badgeBg: "var(--teal-light)",
    badgeColor: "var(--teal-dark)",
    // Real products from CSV: Kitty Kurlz Standard + Top Cat Edition
    getProducts: async (liveProducts) => {
      const csvProducts = REAL_PRODUCTS;
      const allProducts = [...csvProducts, ...liveProducts.filter(p => !csvProducts.find(r => r.handle === p.handle))];
      return allProducts;
    },
    sidebar: {
      categories: [
        { label: "All Products", count: 2 },
        { label: "Interactive Toys", count: 2 },
        { label: "Scratchers", count: 2 },
        { label: "Supplements", count: 0 },
        { label: "Treats", count: 0 },
      ],
      benefits: ["Mental Exercise & Play", "Scratching", "Interactive", "Furniture Protection"],
    },
  },
  "accessories": {
    title: "Pet Accessories & Gear",
    subtitle: "Beds, toys, carriers, collars, and everything that makes your pet's life more comfortable and fun.",
    badge: "🎾 Accessories",
    gradient: "linear-gradient(135deg, #F3F4F6, #FDFAF5)",
    badgeBg: "#EDE9FE",
    badgeColor: "#5B21B6",
    // Accessories fetched dynamically from Shopify API
    getProducts: async (liveProducts) => liveProducts,
    sidebar: {
      categories: [
        { label: "All Products", count: 0 },
        { label: "For Dogs", count: 0 },
        { label: "For Cats", count: 0 },
        { label: "For Both", count: 0 },
      ],
      benefits: ["Comfort & Sleep", "Play & Exercise", "Travel", "Grooming"],
    },
  },
  "bundles": {
    title: "Value Bundle Packs",
    subtitle: "Vet-curated bundles designed to give your pet a complete wellness routine — at prices that make sense.",
    badge: "🎁 Save More",
    gradient: "linear-gradient(135deg, #FFFBEB, #FEF0E6)",
    badgeBg: "#FEF3C7",
    badgeColor: "#92400E",
    getProducts: async () => [],
    sidebar: null,
  },
  "replacement-parts": {
    title: "Replacement Tracks & Parts",
    subtitle: "Need new corrugated tracks or upgraded bell balls? Get original replacement items here.",
    badge: "♻️ Smart Maintenance",
    gradient: "linear-gradient(135deg, #FFFBEB, var(--cream))",
    badgeBg: "#FEF3C7",
    badgeColor: "#92400E",
    getProducts: async () => [],
    sidebar: {
      categories: [{ label: "All Products", count: 0 }],
      benefits: [],
    },
  },
  "cat-supplements": {
    title: "Cat Supplements & Health",
    subtitle: "Vet-approved formulations designed to support your cat's long-term health and vitality.",
    badge: "🐱 For Your Cat",
    gradient: "linear-gradient(135deg, var(--teal-light), var(--cream))",
    badgeBg: "var(--teal-light)",
    badgeColor: "var(--teal-dark)",
    // Real products from CSV: both Kitty Kurlz products (Peteora store type: Cat Supplements)
    getProducts: async (liveProducts) => {
      const csvProducts = REAL_PRODUCTS;
      const allProducts = [...csvProducts, ...liveProducts.filter(p => !csvProducts.find(r => r.handle === p.handle))];
      return allProducts;
    },
    sidebar: {
      categories: [
        { label: "All Products", count: 2 },
        { label: "Interactive Toys", count: 2 },
        { label: "Scratchers", count: 2 },
        { label: "Standard Edition", count: 1 },
        { label: "Top Cat Edition", count: 1 },
      ],
      benefits: ["Mental Exercise & Play", "Scratching", "Interactive", "Furniture Protection"],
    },
  },
  "standard-edition": {
    title: "Standard Shape-Shifting Scratcher",
    subtitle: "The standard 3-in-1 interactive shape-shifting toy, ball track, and lounge area. Made from premium non-toxic corrugated cardboard.",
    badge: "✨ Best Seller",
    gradient: "linear-gradient(135deg, var(--orange-light), var(--cream))",
    badgeBg: "var(--orange-light)",
    badgeColor: "var(--orange-dark)",
    // Real product from CSV: Kitty Kurlz Standard Edition
    getProducts: async () => [PRODUCT_KITTY_KURLZ_STANDARD],
    sidebar: {
      categories: [{ label: "All Products", count: 1 }, { label: "Standard Edition", count: 1 }],
      benefits: ["Mental Exercise & Play", "Scratching", "Interactive", "Furniture Protection"],
    },
  },
  "top-cat-edition": {
    title: "Top Cat Heavy-Duty Edition",
    subtitle: "Reinforced corrugated track scratcher and heavy bell ball built for larger breeds and multi-cat households.",
    badge: "👑 Premium Edition",
    gradient: "linear-gradient(135deg, var(--teal-light), var(--cream))",
    badgeBg: "var(--teal-light)",
    badgeColor: "var(--teal-dark)",
    // Real product from CSV: Kitty Kurlz Top Cat Edition
    getProducts: async () => [PRODUCT_KITTY_KURLZ_TOPCAT],
    sidebar: {
      categories: [{ label: "All Products", count: 1 }, { label: "Top Cat Edition", count: 1 }],
      benefits: ["Mental Exercise & Play", "Deep Scratching", "Durable", "Multi-Cat"],
    },
  },
  "cardboard-scratchers": {
    title: "Premium Cardboard Scratchers",
    subtitle: "Satisfy their scratching instincts, prevent furniture damage, and keep your feline active.",
    badge: "📦 Eco-Friendly Sisal/Cardboard",
    gradient: "linear-gradient(135deg, #F3F4F6, var(--cream))",
    badgeBg: "#EDE9FE",
    badgeColor: "#5B21B6",
    getProducts: async (liveProducts) => liveProducts.filter(p => p.tags?.some(t => t.toLowerCase() === "scratcher" || t.toLowerCase() === "toy")),
    sidebar: {
      categories: [
        { label: "All Products", count: 8 },
        { label: "Standard", count: 4 },
        { label: "Heavy-Duty", count: 2 },
        { label: "Wall-Mount", count: 2 },
      ],
      benefits: ["Mental Exercise & Play", "Scratching", "Furniture Protection"],
    },
  },
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const handle = resolvedParams.handle;
  const config = COLLECTION_CONFIGS[handle];

  if (!config) {
    return {
      title: "Collection Not Found - Peteora",
    };
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

export default async function CollectionPage({ params }) {
  const resolvedParams = await params;
  const handle = resolvedParams.handle;
  const config = COLLECTION_CONFIGS[handle];

  if (!config) {
    notFound();
  }

  const liveProducts = await getShopifyProducts();
  const products = await config.getProducts(liveProducts);
  const sidebar = config.sidebar;

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
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" style={{ marginBottom: "20px" }}>
            <ol
              style={{
                display: "flex",
                justifyContent: "center",
                listStyle: "none",
                padding: 0,
                margin: 0,
                gap: "6px",
                fontSize: "13px",
                color: "#6B7280",
              }}
            >
              <li>
                <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
              </li>
              <li style={{ color: "#D1D5DB" }}>/</li>
              <li>
                <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Collections</Link>
              </li>
              <li style={{ color: "#D1D5DB" }}>/</li>
              <li style={{ color: "var(--orange)", fontWeight: "600" }}>{config.title}</li>
            </ol>
          </nav>

          {/* Badge */}
          <div style={{ marginBottom: "20px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: config.badgeBg,
                color: config.badgeColor,
                border: `1.5px solid ${config.badgeColor}44`,
                borderRadius: "100px",
                padding: "7px 20px",
                fontSize: "13px",
                fontWeight: "800",
              }}
            >
              {config.badge}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(36px, 5.5vw, 64px)",
              fontWeight: "800",
              color: "var(--charcoal, #2A2A2A)",
              lineHeight: "1.08",
              marginBottom: "18px",
            }}
          >
            {config.title}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "17px",
              color: "#6B7280",
              maxWidth: "640px",
              margin: "0 auto",
              lineHeight: "1.65",
            }}
          >
            {config.subtitle}
          </p>
        </div>
      </section>

      {/* ── MAIN BODY ── */}
      <div className="container" style={{ padding: "48px 24px 80px" }}>
        {handle === "bundles" ? (
          <BundlesSection />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "280px 1fr",
              gap: "40px",
              alignItems: "start",
            }}
          >
            {/* ══ SIDEBAR ══ */}
            {sidebar && (
              <aside style={{ position: "sticky", top: "90px" }}>
                <div
                  style={{
                    background: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "16px",
                    padding: "28px 24px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* ── Category ── */}
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "800",
                      color: "#1F2937",
                      marginBottom: "14px",
                      fontFamily: "var(--font-nunito), 'Nunito', sans-serif",
                    }}
                  >
                    Category
                  </h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
                    {sidebar.categories.map((cat, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 0",
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: i === 0 ? "700" : "500",
                            color: i === 0 ? "var(--orange, #F5761A)" : "#374151",
                            flex: 1,
                          }}
                        >
                          <input
                            type="radio"
                            name={`category-${handle}`}
                            defaultChecked={i === 0}
                            style={{
                              accentColor: "var(--orange, #F5761A)",
                              width: "16px",
                              height: "16px",
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          />
                          {cat.label}
                        </label>
                        <span
                          style={{
                            backgroundColor: "#F3F4F6",
                            color: "#6B7280",
                            borderRadius: "100px",
                            padding: "2px 10px",
                            fontSize: "12px",
                            fontWeight: "600",
                            minWidth: "28px",
                            textAlign: "center",
                            flexShrink: 0,
                          }}
                        >
                          {cat.count}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* ── Health Benefit ── */}
                  {sidebar.benefits.length > 0 && (
                    <>
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "800",
                          color: "#1F2937",
                          marginBottom: "14px",
                          fontFamily: "var(--font-nunito), 'Nunito', sans-serif",
                        }}
                      >
                        Health Benefit
                      </h3>
                      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
                        {sidebar.benefits.map((benefit, i) => (
                          <li key={i} style={{ padding: "7px 0" }}>
                            <label
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151",
                              }}
                            >
                              <input
                                type="checkbox"
                                style={{
                                  accentColor: "var(--orange, #F5761A)",
                                  width: "16px",
                                  height: "16px",
                                  cursor: "pointer",
                                  flexShrink: 0,
                                }}
                              />
                              {benefit}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {/* ── Price ── */}
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "800",
                      color: "#1F2937",
                      marginBottom: "14px",
                      fontFamily: "var(--font-nunito), 'Nunito', sans-serif",
                    }}
                  >
                    Price
                  </h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {["Under $20", "$20–$40", "$40–$60", "Over $60"].map((range, i) => (
                      <li key={i} style={{ padding: "7px 0" }}>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151",
                          }}
                        >
                          <input
                            type="checkbox"
                            style={{
                              accentColor: "var(--orange, #F5761A)",
                              width: "16px",
                              height: "16px",
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          />
                          {range}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            )}

            {/* ══ PRODUCT GRID ══ */}
            <div>
              {products.length > 0 ? (
                <>
                  {/* Results bar */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "24px",
                      paddingBottom: "16px",
                      borderBottom: "1px solid #E5E7EB",
                    }}
                  >
                    <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
                      Showing <strong style={{ color: "#2A2A2A" }}>{products.length}</strong> products
                    </p>
                    <span style={{ fontSize: "13px", color: "#6B7280", fontWeight: "600" }}>
                      Sort: Featured
                    </span>
                  </div>

                  {/* Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                      gap: "24px",
                    }}
                  >
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              ) : (
                /* Empty State */
                <div
                  style={{
                    textAlign: "center",
                    padding: "80px 40px",
                    background: "#F9FAFB",
                    borderRadius: "16px",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <div style={{ fontSize: "64px", marginBottom: "16px" }}>📦</div>
                  <h3
                    style={{
                      fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                      fontSize: "24px",
                      fontWeight: "700",
                      color: "#2A2A2A",
                      marginBottom: "12px",
                    }}
                  >
                    No Products Available
                  </h3>
                  <p style={{ fontSize: "15px", color: "#6B7280", maxWidth: "420px", margin: "0 auto 28px" }}>
                    We are currently stocking this collection. Enter your email to get notified when products arrive.
                  </p>
                  <form
                    style={{
                      display: "flex",
                      gap: "8px",
                      maxWidth: "420px",
                      margin: "0 auto 20px",
                    }}
                  >
                    <input
                      type="email"
                      placeholder="Your email address…"
                      style={{
                        flex: 1,
                        padding: "12px 18px",
                        borderRadius: "100px",
                        border: "1px solid #E5E7EB",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        backgroundColor: "var(--orange)",
                        color: "white",
                        border: "none",
                        borderRadius: "100px",
                        padding: "12px 24px",
                        fontWeight: "800",
                        fontSize: "14px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Notify Me
                    </button>
                  </form>
                  <Link
                    href="/"
                    style={{
                      color: "var(--orange)",
                      fontWeight: "700",
                      fontSize: "14px",
                      textDecoration: "none",
                    }}
                  >
                    ← Back to Home
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
