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
    customFallback = true;
    policyData = {
      title: "Return and Refund Policy",
      body: `
        <p>We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.</p>
        <p>To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.</p>
        <p>To start a return, you can contact us at <a href="mailto:shoppingmaniaglobalstore@gmail.com">shoppingmaniaglobalstore@gmail.com</a>. Please note that returns will need to be sent to the following address: 8401 Mayland Dr #6445, Richmond, VA, 23294, United States</p>
        <p>If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.</p>
        <p>You can always contact us for any return question at <a href="mailto:shoppingmaniaglobalstore@gmail.com">shoppingmaniaglobalstore@gmail.com</a>.</p>
        <br>
        <h4>Damages and issues</h4>
        <p>Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.</p>
        <br>
        <h4>Exceptions / non-returnable items</h4>
        <p>Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products). We also do not accept returns for hazardous materials, flammable liquids, or gases. Please get in touch if you have questions or concerns about your specific item.</p>
        <p>Unfortunately, we cannot accept returns on sale items or gift cards.</p>
        <br>
        <h4>Exchanges</h4>
        <p>The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.</p>
        <br>
        <h4>Refunds</h4>
        <p>We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method within 10 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too.</p>
        <p>If more than 15 business days have passed since we’ve approved your return, please contact us at <a href="mailto:shoppingmaniaglobalstore@gmail.com">shoppingmaniaglobalstore@gmail.com</a>.</p>
      `
    };
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
        <p><strong>Store Name:</strong> Peteora</p>
        <p><strong>Email:</strong> shoppingmaniaglobalstore@gmail.com</p>
        <p><strong>Phone:</strong> +15715166562</p>
        <p><strong>Address:</strong> 8401 Mayland Dr #6445, Richmond, VA, 23294, United States</p>
      `
    };
  } else if (handle === "legal-notice") {
    customFallback = true;
    policyData = {
      title: "Legal Notice",
      body: `
        <p><strong>Business Name:</strong> Shopping Mania Global Store (Single member LLC)</p>
        <p><strong>Store Name:</strong> Peteora</p>
        <p><strong>Address:</strong> 8401 Mayland Dr #6445, Richmond, VA, 23294, United States</p>
        <p>This store is operated by Shopping Mania Global Store.</p>
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
