import React from "react";

export const metadata = {
  title: "Return and Refund Policy | Peteora Storefront",
  description: "Read our 30-day money-back guarantee, return procedures, and refund guidelines for Peteora products.",
};

export default function RefundPolicyPage() {
  return (
    <article className="font-body">
      <header className="mb-4">
        <h2 className="font-heading display-6 mb-2">Return &amp; Refund Policy</h2>
        <p className="text-muted small">Last updated: June 19, 2026</p>
      </header>

      <hr className="my-4" />

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">30-Day Happiness Guarantee</h3>
        <p>
          At Peteora, we stand behind the quality of our pet supplements. If you or your pet are not entirely satisfied with your purchase, we offer a <strong>30-day money-back guarantee</strong>. You have 30 days from the date of receiving your item to request a return or a refund.
        </p>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">Eligibility for Returns &amp; Refunds</h3>
        <p>
          To ensure standard processing for refunds, please review the following criteria:
        </p>
        <ul>
          <li><strong>Quality Issues or Damage:</strong> If the product arrives damaged, opened, or defective, we will issue a full refund or send a replacement immediately at no extra cost. Please email photos to our support team.</li>
          <li><strong>Change of Mind:</strong> If you wish to return a product for other reasons, the item must be unused, in the same condition that you received it, and in its original packaging.</li>
          <li><strong>Exceptions:</strong> Gift cards and custom promotional items are non-refundable.</li>
        </ul>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">How to Initiate a Return</h3>
        <p>
          To start a return, please contact our support team at <a href="mailto:shoppingmaniaglobalstore@gmail.com" className="text-zesty-orange">shoppingmaniaglobalstore@gmail.com</a> with:
        </p>
        <ol>
          <li>Your order number (e.g., #ZP1024)</li>
          <li>The reason for the return (accompanied by photos if defective)</li>
          <li>Your preference for a refund or replacement</li>
        </ol>
        <p className="alert alert-info py-2 small">
          <strong>Please note:</strong> Do not send your purchase back to the manufacturer address listed on the package before contacting us. We will provide you with a dedicated US return shipping address and a Return Merchandise Authorization (RMA) number.
        </p>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">Return Shipping Costs</h3>
        <p>
          If the return is due to a product defect, damage, or an error on our part, Peteora will cover the return shipping cost. For change of mind returns, the customer is responsible for paying return shipping costs. We recommend using a trackable shipping service, as we cannot guarantee that we will receive your returned item.
        </p>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">Refund Processing &amp; Timeframes</h3>
        <p>
          Once your return is received and inspected, we will send you an email to notify you that we have received your item. We will also notify you of the approval or rejection of your refund.
        </p>
        <p>
          If approved, your refund will be processed, and a credit will automatically be applied to your original payment method (Credit/Debit Card, PayPal, ShopPay) within <strong>5 to 7 business days</strong>.
        </p>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">Late or Missing Refunds</h3>
        <p>
          If you haven’t received a refund yet, first check your bank account or contact your credit card issuer. It may take some time before your refund is officially posted. If you have done this and still have not received your refund, please contact us at <a href="mailto:shoppingmaniaglobalstore@gmail.com" className="text-zesty-orange">shoppingmaniaglobalstore@gmail.com</a>.
        </p>
      </section>
    </article>
  );
}
