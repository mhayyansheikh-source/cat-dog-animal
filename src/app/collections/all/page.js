import React from "react";
import { getShopifyProducts } from "@/utils/shopify";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";

export const runtime = "edge";

export const metadata = {
  title: "All Products - Peteora",
  description: "Shop our entire catalog of premium pet wellness, accessories, and supplies.",
};

export default async function AllProductsPage() {
  const products = await getShopifyProducts();

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
        <div className="container">
          <nav aria-label="breadcrumb" style={{ marginBottom: "20px" }}>
            <ol style={{ display: "flex", justifyContent: "center", listStyle: "none", padding: 0, margin: 0, gap: "6px", fontSize: "13px", color: "#6B7280" }}>
              <li><Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link></li>
              <li style={{ color: "#D1D5DB" }}>/</li>
              <li style={{ color: "var(--orange)", fontWeight: "600" }}>All Products</li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: "800", color: "var(--charcoal, #2A2A2A)", lineHeight: "1.08", marginBottom: "18px" }}>
            All Products
          </h1>
          <p style={{ fontSize: "17px", color: "#6B7280", maxWidth: "640px", margin: "0 auto", lineHeight: "1.65" }}>
            Browse our complete collection of premium pet products.
          </p>
        </div>
      </section>

      {/* ── MAIN BODY ── */}
      <div className="container" style={{ padding: "48px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid #E5E7EB" }}>
          <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Showing <strong style={{ color: "#2A2A2A" }}>{products.length}</strong> products</p>
        </div>
        <div className="row g-0 g-md-4">
          {products.map((product, index) => (
            <div key={product.id} className="col-6 col-md-4 col-lg-3">
              <ProductCard key={product.id} product={product} index={index} isMosaic={true} />
            </div>
          ))}
        </div>
      </div>
      <CartDrawer />
    </div>
  );
}
