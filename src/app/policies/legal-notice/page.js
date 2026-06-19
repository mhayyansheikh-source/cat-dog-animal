import React from "react";

export const metadata = {
  title: "Legal Notice | Peteora Storefront",
  description: "Official Legal Notice, company registration details, website host identification, and trademark disclaimers.",
};

export default function LegalNoticePage() {
  return (
    <article className="font-body">
      <header className="mb-4">
        <h2 className="font-heading display-6 mb-2">Legal Notice</h2>
        <p className="text-muted small">Official legal and corporate disclosures.</p>
      </header>

      <hr className="my-4" />

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">1. Website Presentation &amp; Operator</h3>
        <p>
          This website (the &quot;Site&quot;) is operated and published by:
        </p>
        <p className="small text-muted ps-3 border-start border-3">
          <strong>Shopping Mania Global Store (Single member LLC)</strong><br />
          A registered corporation in the State of Virginia, United States.<br />
          Registered Address: 8401 Mayland Dr #6445, Richmond, VA 23294, USA<br />
          Email: <a href="mailto:shoppingmaniaglobalstore@gmail.com" className="text-zesty-orange">shoppingmaniaglobalstore@gmail.com</a>
        </p>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">2. Website Hosting</h3>
        <p>
          This website is hosted by:
        </p>
        <p className="small text-muted ps-3 border-start border-3">
          <strong>Cloudflare, Inc.</strong><br />
          101 Townsend St, San Francisco, CA 94107, United States<br />
          Web: <a href="https://www.cloudflare.com" target="_blank" rel="noopener noreferrer" className="text-zesty-orange">https://www.cloudflare.com</a>
        </p>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">3. Intellectual Property Notice</h3>
        <p>
          All content displayed on this website, including text, graphics, logos, images, design layouts, and software is protected by intellectual property laws. Any reproduction, distribution, modification, or transmission of any materials on this site without prior written consent from the website operator is strictly prohibited.
        </p>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">4. Disclaimer Regarding Brand Names &amp; Trademarks</h3>
        <div className="alert alert-warning py-3">
          <h5 className="font-heading fs-6 fw-bold mb-2">⚠️ IMPORTANT DEMO DISCLAIMER</h5>
          <p className="small mb-0 text-muted">
            This storefront is a <strong>headless e-commerce demonstration storefront</strong> operated under the Peteora brand to display integration capabilities with the Shopify Storefront API.
          </p>
          <p className="small mb-0 text-muted mt-2">
            All original product brand names, trademarks, product titles, and manufacturer assets (including &quot;Zesty Paws&quot; and &quot;Solid Gold&quot;) are properties of their respective trademark holders. Peteora is not affiliated with, sponsored by, or endorsed by those trademark owners.
          </p>
        </div>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">5. Disclaimer of Liability</h3>
        <p>
          The operator of this Site makes every effort to ensure the accuracy and reliability of the information presented. However, the operator does not guarantee that the content is error-free, complete, or up-to-date. In no event will the operator be held liable for any direct or indirect damage or loss resulting from the use of this Site or any linked resources.
        </p>
      </section>
    </article>
  );
}
