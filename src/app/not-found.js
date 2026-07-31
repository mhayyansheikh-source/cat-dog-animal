import Link from "next/link";
import { Search, Bone } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container py-5 d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: "70vh" }}>
      <div>
        <h1 className="font-heading fw-bold mb-3 display-1 text-zesty-orange" style={{ fontSize: "6rem" }}>404</h1>
      </div>

      <div className="mb-4 text-forest-green">
        <Bone size={80} strokeWidth={1.5} />
      </div>

      <div>
        <h2 className="font-heading fw-bold mb-4">Oops! We dug too deep...</h2>
        <p className="text-muted lead mb-5 max-w-md mx-auto" style={{ maxWidth: "500px" }}>
          We couldn&apos;t find the page you were looking for. It might have been moved, deleted, or buried in the backyard.
        </p>
      </div>
      
      <div className="d-flex gap-3 justify-content-center flex-wrap">
        <Link href="/" className="btn btn-zesty-primary rounded-pill px-5 py-3 fw-bold text-uppercase hover-scale">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
