import EmbeddedCheckout from "@/components/EmbeddedCheckout";

export const metadata = {
  title: "Secure Checkout - Peteora",
  description: "Complete your secure checkout for premium pet products.",
  robots: {
    index: false,
    follow: false,
  }
};

export default function CheckoutPage() {
  return (
    <div className="container-fluid p-0 bg-light">
      <div className="bg-white border-bottom shadow-sm py-3 px-4 d-flex align-items-center justify-content-center">
        {/* We use a simplified header for checkout to reduce distractions */}
        <h1 className="font-heading fw-bold m-0 text-charcoal-dark d-flex align-items-center gap-2">
          <span className="text-zesty-orange">Secure</span> Checkout
        </h1>
      </div>
      <div className="container py-4">
        <EmbeddedCheckout />
      </div>
    </div>
  );
}
