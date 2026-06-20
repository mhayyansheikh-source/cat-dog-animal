"use client";

import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container py-5 d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: "70vh" }}>
      <h1 className="font-heading fw-bold mb-3 display-1 text-zesty-orange">404</h1>
      <h2 className="font-heading fw-bold mb-4">Page Not Found</h2>
      <p className="text-muted lead mb-5 max-w-md mx-auto">
        We couldn't find the page you were looking for. It might have been moved, deleted, or perhaps the URL is incorrect.
      </p>
      
      <div className="d-flex gap-3 justify-content-center flex-wrap">
        <Link href="/" className="btn btn-zesty-primary rounded-pill px-5 py-3 fw-bold text-uppercase">
          Return to Homepage
        </Link>
        <button 
          className="btn btn-outline-dark rounded-pill px-4 py-3 d-flex align-items-center gap-2 fw-bold"
          onClick={() => {
            const searchBtn = document.querySelector('button[title="Search"]');
            if (searchBtn) searchBtn.click();
          }}
        >
          <Search size={18} />
          Search Store
        </button>
      </div>
    </div>
  );
}
