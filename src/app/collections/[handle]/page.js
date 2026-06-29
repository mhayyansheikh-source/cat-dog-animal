import React from "react";
import { getShopifyProducts, getShopifyCollectionByHandle } from "@/utils/shopify";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import CollectionFilters from "@/components/CollectionFilters";
import MobileFilterDrawer from "@/components/MobileFilterDrawer";
import Link from "next/link";
import { notFound } from "next/navigation";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const handle = resolvedParams.handle;
  const collection = await getShopifyCollectionByHandle(handle);

  if (!collection) {
    return { title: "Collection Not Found - Peteora" };
  }

  return {
    title: `${collection.title} - Peteora`,
    description: collection.descriptionHtml?.replace(/<[^>]*>?/gm, '') || `Shop ${collection.title}`,
    alternates: {
      canonical: `https://peteora.com/collections/${handle}`,
    },
  };
}

export default async function CollectionPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const handle = resolvedParams.handle;

  // Build filters from URL. Storefront API expects { productVendor: "...", variantOption: {...}, price: {min, max} }
  let filters = [];
  if (resolvedSearchParams.price) {
    const [min, max] = resolvedSearchParams.price.split("-");
    filters.push({ price: { min: parseFloat(min), max: parseFloat(max) } });
  }

  let products = [];
  let collectionFilters = [];
  let collection = null;

  try {
    collection = await getShopifyCollectionByHandle(handle, filters);
    if (!collection) {
      notFound();
    }
    products = collection.products || [];
    collectionFilters = collection.filters || [];
  } catch (err) {
    console.error("Error fetching collection:", err);
    notFound();
  }

  // Fallback defaults if no description
  const description = collection.descriptionHtml ? (
    <div dangerouslySetInnerHTML={{ __html: collection.descriptionHtml }} style={{ fontSize: "17px", color: "#6B7280", maxWidth: "640px", margin: "0 auto", lineHeight: "1.65" }} />
  ) : (
    <p style={{ fontSize: "17px", color: "#6B7280", maxWidth: "640px", margin: "0 auto", lineHeight: "1.65" }}>Browse our premium selection.</p>
  );

  return (
    <div>
      {/* ── HERO BANNER ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #F9FAFB, #E5E7EB)",
          borderBottom: "1px solid #E5E7EB",
          padding: "56px 24px 48px",
          textAlign: "center",
        }}
      >
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <nav aria-label="breadcrumb" style={{ marginBottom: "20px" }}>
            <ol style={{ display: "flex", justifyContent: "center", listStyle: "none", padding: 0, margin: 0, gap: "6px", fontSize: "13px", color: "#6B7280" }}>
              <li><Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link></li>
              <li style={{ color: "#D1D5DB" }}>/</li>
              <li><Link href="/collections/all" style={{ color: "#6B7280", textDecoration: "none" }}>Collections</Link></li>
              <li style={{ color: "#D1D5DB" }}>/</li>
              <li style={{ color: "var(--orange)", fontWeight: "600" }}>{collection.title}</li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: "800", color: "var(--charcoal, #2A2A2A)", lineHeight: "1.08", marginBottom: "18px" }}>
            {collection.title}
          </h1>
          {description}
        </div>
      </section>

      {/* ── MAIN BODY ── */}
      <div className="container" style={{ padding: "48px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "40px", alignItems: "start" }}>
          
          {/* ══ DYNAMIC SIDEBAR ══ */}
          <div className="d-none d-lg-block">
            <h5 className="mb-4 fw-bold">Filters</h5>
            <CollectionFilters filters={collectionFilters} />
          </div>

          {/* ══ PRODUCT GRID ══ */}
          <div>
            {products.length > 0 ? (
              <>
                {/* Mobile Filter Drawer (handles sticky top and showing product count on mobile) */}
                <MobileFilterDrawer filters={collectionFilters} productCount={products.length} />

                <div className="d-none d-lg-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                  <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Showing <strong style={{ color: "#2A2A2A" }}>{products.length}</strong> products</p>
                </div>
                <div className="row g-2 g-md-4">
                  {products.map((product, index) => (
                    <div key={product.id} className="col-6 col-md-4 col-lg-3">
                      <ProductCard key={product.id} product={product} index={index} isPriority={index < 4} />
                    </div>
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
                  Try adjusting your filters.
                </p>
                <Link href="/collections/all" style={{ color: "var(--orange)", fontWeight: "700", fontSize: "14px", textDecoration: "none" }}>
                  ← View All Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <CartDrawer />
    </div>
  );
}
