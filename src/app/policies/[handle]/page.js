import { notFound } from "next/navigation";
import { getShopPolicies, getShopInfo } from "@/utils/shopify";
import { ShieldCheck, ArrowRight, Undo2, Lock, FileText, Truck, Mail, Scale } from "lucide-react";
import Link from "next/link";

export async function generateStaticParams() {
  return [
    { handle: 'refund-policy' },
    { handle: 'privacy-policy' },
    { handle: 'terms-of-service' },
    { handle: 'shipping-policy' },
    { handle: 'contact-information' },
    { handle: 'legal-notice' },
  ];
}

export async function generateMetadata(props) {
  const params = await props.params;
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

export default async function PolicyPage(props) {
  const params = await props.params;
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

  const policyLinks = [
    { handle: 'refund-policy', title: 'Return and refund policy', icon: <Undo2 size={20} /> },
    { handle: 'privacy-policy', title: 'Privacy policy', icon: <Lock size={20} /> },
    { handle: 'terms-of-service', title: 'Terms of service', icon: <FileText size={20} /> },
    { handle: 'shipping-policy', title: 'Shipping policy', icon: <Truck size={20} /> },
    { handle: 'contact-information', title: 'Contact information', icon: <Mail size={20} /> },
    { handle: 'legal-notice', title: 'Legal notice', icon: <Scale size={20} /> }
  ];

  return (
    <div className="container py-5 my-md-4">
      <div className="row g-5">
        {/* Sidebar */}
        <div className="col-lg-3">
          <div className="sticky-top" style={{ top: "100px", zIndex: 1 }}>
            <h5 className="font-heading fw-bold text-charcoal-dark mb-4 text-uppercase letter-spacing-wide">Policy Directory</h5>
            <div className="d-flex flex-column gap-2">
              {policyLinks.map((link) => {
                const isActive = handle === link.handle;
                return (
                  <Link
                    key={link.handle}
                    href={`/policies/${link.handle}`}
                    className={`d-flex align-items-center gap-3 p-3 rounded text-decoration-none transition-all fw-bold font-body`}
                    style={{
                      backgroundColor: isActive ? "var(--forest-green)" : "transparent",
                      color: isActive ? "white" : "var(--charcoal-dark)",
                    }}
                  >
                    <span style={{ opacity: isActive ? 1 : 0.6 }}>{link.icon}</span>
                    {link.title}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="col-lg-8 offset-lg-1">
          <div className="bg-white rounded-card p-4 p-md-5 border shadow-sm">
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
          </div>
        </div>
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
    </div>
  );
}
