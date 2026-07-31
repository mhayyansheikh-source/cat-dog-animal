import { notFound } from "next/navigation";
import { getShopInfo } from "@/utils/shopify";
import Link from "next/link";
import * as motion from "framer-motion/client";
import { ShieldCheck, ArrowLeft, Mail } from "lucide-react";

export const runtime = "edge";

export async function generateMetadata(props) {
  const params = await props.params;
  const { handle } = params;

  const formattedTitle = handle
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${formattedTitle} - Peteora`,
  };
}

export default async function PagesHandler(props) {
  const params = await props.params;
  const { handle } = params;
  const shopInfo = await getShopInfo();

  const formattedTitle = handle
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="bg-light py-5 min-vh-100 font-body">
      <div className="container" style={{ maxWidth: "860px" }}>
        <div className="mb-4">
          <Link
            href="/"
            className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1 hover-scale"
          >
            <ArrowLeft size={16} /> Back to Shop
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card border-0 shadow-sm rounded-4 overflow-hidden"
        >
          <div className="card-header bg-white border-bottom p-4 p-md-5">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-soft-sand text-dark rounded-pill px-3 py-2 fw-semibold small">
                Peteora Store Policy & Information
              </span>
            </div>
            <h1
              className="font-heading fw-bold mb-0 text-dark"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
            >
              {formattedTitle}
            </h1>
          </div>

          <div className="card-body p-4 p-md-5 bg-white text-dark leading-relaxed" style={{ lineHeight: "1.8", fontSize: "1.05rem" }}>
            {handle === "data-sharing-opt-out" ? (
              <div>
                <p>Your privacy is extremely important to us at Peteora. Under certain state laws and privacy regulations, you have the right to opt out of the sale or sharing of your personal information for targeted advertising purposes.</p>
                <h4 className="fw-bold mt-4 mb-2">How to Submit an Opt-Out Request</h4>
                <p>If you wish to opt out of data sharing, analytics tracking, or targeted marketing communications, please contact our privacy compliance team with your request:</p>
                <ul className="list-unstyled bg-light p-3 rounded-3 border">
                  <li><strong>Email:</strong> <a href="mailto:shoppinghorizonstorellc@gmail.com" className="text-zesty-orange">shoppinghorizonstorellc@gmail.com</a></li>
                  <li><strong>Phone:</strong> +1 (307) 400-9538</li>
                  <li><strong>Mailing Address:</strong> 30 N Gould St #26515 Sheridan, WY 82801, USA</li>
                </ul>
                <p>Once received, we will process your request within 15 business days and notify our analytics partners.</p>
              </div>
            ) : (
              <div>
                <p>Welcome to <strong>Peteora</strong>. We are dedicated to delivering top-quality pet care products, supplements, and accessories for your beloved dogs and cats.</p>
                <p>If you have any questions or require assistance regarding <strong>{formattedTitle}</strong>, please feel free to reach out to our dedicated support team at <a href="mailto:shoppinghorizonstorellc@gmail.com" className="text-zesty-orange">shoppinghorizonstorellc@gmail.com</a>.</p>
              </div>
            )}

            <div className="mt-5 pt-4 border-top d-flex flex-wrap align-items-center justify-content-between text-muted small">
              <div className="d-flex align-items-center gap-2">
                <ShieldCheck size={18} className="text-success" />
                <span>Verified SSL Secure Checkout & Data Protection</span>
              </div>
              <div>© {new Date().getFullYear()} Peteora. All rights reserved.</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
