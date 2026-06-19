import React from "react";

export const metadata = {
  title: "Shipping Policy | Peteora Storefront",
  description: "Learn about Peteora's shipping zones, processing times, tracked US shipping (5-12 business days), and delivery partners.",
};

export default function ShippingPolicyPage() {
  return (
    <article className="font-body">
      <header className="mb-4">
        <h2 className="font-heading display-6 mb-2">Shipping Policy</h2>
        <p className="text-muted small">Last updated: June 19, 2026</p>
      </header>

      <hr className="my-4" />

      <section className="mb-4">
        <p>
          Thank you for choosing Peteora Storefront! We are dedicated to delivering premium pet supplements to your doorstep quickly and securely. All orders include tracked shipping options. Below are the details of our shipping operations.
        </p>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">Order Processing Times</h3>
        <p>
          All orders are processed and verified within <strong>1 to 3 business days</strong> (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped, along with tracking details.
        </p>
        <p className="alert alert-warning py-2 small">
          <strong>Note:</strong> During peak periods, holidays, or promotional events, processing times may be extended slightly. We appreciate your patience.
        </p>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">Shipping Rates &amp; Delivery Estimates</h3>
        <p>
          Our primary target market is the United States. We partner with top-tier international logistics and US carriers to ensure reliable tracked delivery.
        </p>
        
        <div className="table-responsive my-3">
          <table className="table table-bordered align-middle text-center small">
            <thead className="table-light">
              <tr>
                <th>Shipping Zone</th>
                <th>Delivery Options</th>
                <th>Estimated Delivery Time</th>
                <th>Shipping Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-bold">United States (Domestic)</td>
                <td>Standard Tracked Delivery</td>
                <td>5 to 12 business days</td>
                <td><strong>FREE</strong> on orders over $35.00<br /><span className="text-muted">otherwise flat $4.95</span></td>
              </tr>
              <tr>
                <td className="fw-bold">Rest of the World</td>
                <td>International Tracked</td>
                <td>10 to 18 business days</td>
                <td>Flat $9.95</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">Delivery Partner Carriers</h3>
        <p>
          Once your package arrives in the United States, it is handed over to local domestic carriers for final delivery. The primary carriers we use for US delivery include:
        </p>
        <ul>
          <li><strong>USPS</strong> (United States Postal Service)</li>
          <li><strong>DHL eCommerce</strong></li>
          <li><strong>FedEx</strong></li>
        </ul>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">How do I check the status of my order?</h3>
        <p>
          When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become active.
        </p>
        <p>
          If you haven’t received your order within 15 days of receiving your shipping confirmation email, please contact us at <a href="mailto:shoppingmaniaglobalstore@gmail.com" className="text-zesty-orange">shoppingmaniaglobalstore@gmail.com</a> with your name and order number, and we will investigate it for you immediately.
        </p>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">Shipping to P.O. Boxes and APO/FPO Addresses</h3>
        <p>
          We are proud to support standard delivery options to US P.O. Boxes and APO/FPO/DPO military addresses. However, deliveries to these addresses may experience minor delays depending on carrier schedules.
        </p>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">Customs, Duties, and Taxes</h3>
        <p>
          For orders shipped within the United States, there are <strong>no import customs, duties, or tariffs</strong>. The price listed at checkout is the final price you pay. For international orders outside the US, packages may be subject to import duties and taxes once a shipment reaches your destination country, which are the customer's responsibility.
        </p>
      </section>

      <section className="mb-4">
        <h3 className="font-heading fs-4 mb-3">Address Corrections</h3>
        <p>
          It is the customer's responsibility to provide the correct shipping address at checkout. Because we strive to fulfill orders as quickly as possible, corrections or changes must be submitted within <strong>12 hours</strong> of placing the order. Please contact <a href="mailto:shoppingmaniaglobalstore@gmail.com" className="text-zesty-orange">shoppingmaniaglobalstore@gmail.com</a> immediately if you notice an error.
        </p>
      </section>
    </article>
  );
}
