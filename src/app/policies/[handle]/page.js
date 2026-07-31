import { notFound } from "next/navigation";
import { getShopPolicies, getShopInfo } from "@/utils/shopify";
import { ShieldCheck, ArrowRight, Undo2, Lock, FileText, Truck, Mail, Scale } from "lucide-react";
import Link from "next/link";
import * as motion from "framer-motion/client";
import { policyTitleMap, fallbackPolicies } from "@/data/policiesData";

export async function generateMetadata(props) {
  const params = await props.params;
  const { handle } = params;

  return {
    title: `${policyTitleMap[handle] || 'Policy'} - Peteora`,
  };
}

export default async function PolicyPage(props) {
  const params = await props.params;
  const { handle } = params;
  const policies = await getShopPolicies();
  const shopInfo = await getShopInfo();

  let policyData = null;

  if (fallbackPolicies[handle]) {
    policyData = fallbackPolicies[handle];
  }

  if (!policyData && policies) {
    const keyMap = {
      "privacy-policy": "privacyPolicy",
      "terms-of-service": "termsOfService",
      "refund-policy": "refundPolicy",
      "shipping-policy": "shippingPolicy",
    };
    const shopifyKey = keyMap[handle];
    if (shopifyKey && policies[shopifyKey]) {
      policyData = policies[shopifyKey];
    }
  }

  if (!policyData) {
    policyData = {
      title: policyTitleMap[handle] || "Store Policy",
      body: `<p>Welcome to Peteora. For questions regarding ${handle.replace("-", " ")}, please contact us at shoppinghorizonstorellc@gmail.com.</p>`
    };
  }

  const iconMap = {
    "refund-policy": Undo2,
    "privacy-policy": Lock,
    "terms-of-service": Scale,
    "shipping-policy": Truck,
    "contact-information": Mail,
    "legal-notice": FileText
  };

  const IconComponent = iconMap[handle] || ShieldCheck;

  return (
    <div className="bg-light py-5 min-vh-100 font-body">
      <div className="container" style={{ maxWidth: "900px" }}>
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link href="/" className="text-decoration-none text-muted small hover-scale d-inline-flex align-items-center gap-1">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item active small text-charcoal-dark fw-semibold" aria-current="page">
              {policyData.title}
            </li>
          </ol>
        </nav>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card border-0 shadow-sm rounded-4 overflow-hidden"
        >
          {/* Header */}
          <div 
            className="card-header border-bottom p-4 p-md-5 text-white position-relative"
            style={{ 
              background: "linear-gradient(135deg, var(--forest-green, #198e7a) 0%, #115e52 100%)",
            }}
          >
            <div className="d-flex align-items-center gap-3 mb-3">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center bg-white bg-opacity-20 p-2"
                style={{ width: "48px", height: "48px", backdropFilter: "blur(4px)" }}
              >
                <IconComponent size={24} className="text-white" />
              </div>
              <span className="badge rounded-pill bg-white bg-opacity-20 text-white px-3 py-2 small fw-semibold">
                Official Peteora Policy
              </span>
            </div>
            <h1 className="font-heading fw-bold mb-2 display-6">{policyData.title}</h1>
            <p className="mb-0 text-white text-opacity-75 small">
              Last updated & verified for legal compliance • Peteora Store Guidelines
            </p>
          </div>

          {/* Body Content */}
          <div className="card-body p-4 p-md-5 bg-white text-dark leading-relaxed" style={{ fontSize: "1.05rem", lineHeight: "1.8" }}>
            <div 
              className="policy-content"
              dangerouslySetInnerHTML={{ __html: policyData.body }}
            />

            {/* Quick Contact Box */}
            <div className="mt-5 p-4 rounded-3 bg-light border border-secondary border-opacity-10 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
              <div>
                <h6 className="fw-bold mb-1 font-heading text-charcoal-dark">Have questions about this policy?</h6>
                <p className="small text-muted mb-0">Our support team is available 24/7 to assist you.</p>
              </div>
              <a 
                href="mailto:shoppinghorizonstorellc@gmail.com" 
                className="btn btn-zesty-primary rounded-pill px-4 py-2 small fw-bold d-inline-flex align-items-center gap-2 hover-scale text-decoration-none"
              >
                <Mail size={16} /> Contact Support
              </a>
            </div>

            {/* Footer Trust Disclaimer */}
            <div className="mt-4 pt-3 border-top d-flex flex-wrap align-items-center justify-content-between text-muted small">
              <div className="d-flex align-items-center gap-2">
                <ShieldCheck size={18} className="text-success" />
                <span>256-Bit SSL Encrypted & Protected</span>
              </div>
              <div>© {new Date().getFullYear()} Peteora (Shopping Horizon Store LLC).</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
