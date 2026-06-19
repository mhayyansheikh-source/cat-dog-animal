import React from "react";

export const metadata = {
  title: "Privacy Policy | Peteora Storefront",
  description: "Learn how Peteora collects, uses, and protects your personal data in compliance with CCPA, CPRA, and GDPR standards.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="font-body">
      <header className="mb-4">
        <h2 className="font-heading display-6 mb-2">Privacy Policy</h2>
        <p className="text-muted small">Last updated: June 19, 2026</p>
      </header>

      <hr className="my-4" />

      <section className="mb-4">
        <p>
          This Privacy Policy describes how Peteora Storefront (the &quot;Site&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and discloses your Personal Information when you visit, use our services, or make a purchase from the Site. We are committed to safeguarding your privacy under US Federal Trade Commission (FTC) guidelines, California Consumer Privacy Act (CCPA/CPRA), and GDPR requirements.
        </p>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">1. Personal Information We Collect</h3>
        <p>
          When you interact with the Site, we collect certain details about your device, your interaction with the Site, and information necessary to process your purchases.
        </p>
        <ul>
          <li><strong>Device Information:</strong> Version of web browser, IP address, time zone, cookie information, what pages or products you view, search terms, and how you interact with the Site. This is collected automatically via cookies, log files, web beacons, and pixels.</li>
          <li><strong>Order Information:</strong> Name, billing address, shipping address, payment information (including credit card numbers, PayPal details), email address, and phone number. This is collected directly from you to fulfill our contract.</li>
          <li><strong>Customer Support Information:</strong> Any additional details you choose to share with us via customer service channels.</li>
        </ul>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">2. How We Use Your Personal Information</h3>
        <p>
          We use your Personal Information to provide our services, which includes: offering products for sale, processing payments, shipping and fulfillment of your order, keeping you updated on new products, services, and offers, and optimizing our storefront.
        </p>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">3. Sharing Personal Information</h3>
        <p>
          We share your Personal Information with service providers to help us provide our services and fulfill our contracts with you, as described above. For example:
        </p>
        <ul>
          <li>We use Shopify Storefront API as our backend engine. You can read how Shopify uses your Personal Information <a href="https://www.shopify.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-zesty-orange">here</a>.</li>
          <li>We share information with third-party logistics/warehousing partners for shipping orders to US addresses.</li>
          <li>We may use Google Analytics to help us understand how our customers use the Site. You can read how Google uses your Personal Information <a href="https://www.google.com/intl/en/policies/privacy/" target="_blank" rel="noopener noreferrer" className="text-zesty-orange">here</a>.</li>
        </ul>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">4. CCPA / CPRA &amp; GDPR Rights</h3>
        <p>
          Depending on your location, you may have specific rights regarding your personal information:
        </p>
        <ul>
          <li><strong>GDPR (European Residents):</strong> You have the right to access the Personal Information we hold about you, to port it to a new service, and to ask that your Personal Information be corrected, updated, or erased.</li>
          <li><strong>CCPA / CPRA (California Residents):</strong> You have the right to request access to the categories of Personal Information we collect, request deletion of your information, and opt-out of the &quot;sale&quot; or &quot;sharing&quot; of your personal details for targeted advertising. Peteora does not sell or share personal information for monetary value.</li>
        </ul>
        <p>
          To exercise any of these rights, please email us at <a href="mailto:shoppingmaniaglobalstore@gmail.com" className="text-zesty-orange">shoppingmaniaglobalstore@gmail.com</a> with the subject line &quot;Data Rights Request&quot;.
        </p>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">5. Cookies and Tracking Technologies</h3>
        <p>
          A cookie is a small amount of information that’s downloaded to your device when you visit our Site. Cookies make your browsing experience better by allowing the website to remember your actions and preferences (such as login and region selection).
        </p>
        <p>
          You can control and manage cookies in various ways. Please keep in mind that removing or blocking cookies can negatively impact your user experience and parts of our website may no longer be fully accessible.
        </p>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">6. Security</h3>
        <p>
          We implement standard physical, technical, and administrative security measures to protect your Personal Information from unauthorized access, loss, misuse, or alteration. All payments are processed through secure, PCI-DSS compliant checkout portals.
        </p>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">7. Contact Us</h3>
        <p>
          For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at <a href="mailto:shoppingmaniaglobalstore@gmail.com" className="text-zesty-orange">shoppingmaniaglobalstore@gmail.com</a>.
        </p>
      </section>
    </article>
  );
}
