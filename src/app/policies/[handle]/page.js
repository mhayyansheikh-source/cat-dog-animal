import { notFound } from "next/navigation";
import { getShopPolicies, getShopInfo } from "@/utils/shopify";
import { ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { handle } = params;
  
  const titles = {
    "refund-policy": "Return & Refund Policy",
    "privacy-policy": "Privacy Policy",
    "terms-of-service": "Terms of Service",
    "shipping-policy": "Shipping Policy",
    "contact-information": "Contact Information",
    "legal-notice": "Legal Notice"
  };

  return {
    title: `${titles[handle] || 'Policy'} - Peteora`,
  };
}

export default async function PolicyPage({ params }) {
  const { handle } = params;
  const policies = await getShopPolicies();
  const shopInfo = await getShopInfo();

  let policyData = null;
  let customFallback = false;

  if (handle === "refund-policy") {
    policyData = policies?.refundPolicy;
  } else if (handle === "privacy-policy") {
    policyData = policies?.privacyPolicy;
  } else if (handle === "terms-of-service") {
    policyData = policies?.termsOfService;
  } else if (handle === "shipping-policy") {
    policyData = policies?.shippingPolicy;
  } else if (handle === "contact-information") {
    customFallback = true;
    policyData = {
      title: "Contact Information",
      body: `
        <p>If you have any questions, please contact us at:</p>
        <p><strong>Email:</strong> support@${new URL(shopInfo?.primaryDomain?.url || "https://peteora.com").host.replace('www.', '')}</p>
        <p><strong>Store Name:</strong> ${shopInfo?.name || "Peteora"}</p>
      `
    };
  } else if (handle === "legal-notice") {
    customFallback = true;
    policyData = {
      title: "Legal Notice",
      body: `
        <p>This store is operated by ${shopInfo?.name || "Peteora"}.</p>
        <p>All content and trademarks belong to their respective owners.</p>
      `
    };
  }

  if (!policyData && !customFallback) {
    // If shopify doesn't return a policy, we show a generic fallback so the page doesn't crash
    policyData = {
      title: handle.replace('-', ' ').toUpperCase(),
      body: "<p>This policy has not been configured in the store admin yet.</p>"
    };
  }

  return (
    <>
      <div className="d-flex align-items-center gap-2 mb-4 pb-3 border-bottom">
        <ShieldCheck className="text-forest-green" size={28} />
        <h2 className="font-heading fs-3 fw-bold mb-0 text-charcoal-dark">
          {policyData.title}
        </h2>
      </div>

      <div 
        className="policy-content font-body text-charcoal-dark"
        style={{ lineHeight: "1.8" }}
        dangerouslySetInnerHTML={{ __html: policyData.body }}
      />

      <div className="mt-5 pt-4 border-top">
        <Link href="/" className="btn btn-outline-forest-green d-inline-flex align-items-center gap-2 px-4 py-2 fw-bold">
          Return to Store <ArrowRight size={18} />
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .policy-content h1, .policy-content h2, .policy-content h3 {
          font-family: var(--font-heading);
          color: var(--charcoal-dark);
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        .policy-content p {
          margin-bottom: 1.5rem;
          color: #4a5568;
        }
        .policy-content a {
          color: var(--forest-green);
          text-decoration: underline;
        }
        .policy-content ul, .policy-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .policy-content li {
          margin-bottom: 0.5rem;
          color: #4a5568;
        }
      `}} />
    </>
  );
}
