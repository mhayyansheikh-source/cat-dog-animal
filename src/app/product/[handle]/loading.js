export default function Loading() {
  return (
    <div className="container py-3 py-md-5">
      <div className="row g-4 g-md-5">
        {/* Left Column: Image Gallery Skeleton */}
        <div className="col-lg-6">
          <div className="sticky-top" style={{ top: "100px", zIndex: 1 }}>
            <div 
              className="rounded-card p-0 mb-3 position-relative w-100 shimmer-placeholder" 
              style={{ 
                minHeight: "400px", 
                backgroundColor: "#f9fafb",
                border: "none"
              }}
            ></div>
            
            {/* Thumbnail Skeleton */}
            <div className="d-flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="rounded shimmer-placeholder" 
                  style={{ width: "80px", height: "80px", backgroundColor: "#f9fafb" }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Config & Details Skeleton */}
        <div className="col-lg-6 text-start">
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="rounded-pill shimmer-placeholder" style={{ width: "100px", height: "24px", backgroundColor: "#f9fafb" }}></div>
            <div className="rounded shimmer-placeholder" style={{ width: "80px", height: "16px", backgroundColor: "#f9fafb" }}></div>
          </div>

          <div className="rounded shimmer-placeholder mb-2" style={{ width: "80%", height: "48px", backgroundColor: "#f9fafb" }}></div>
          
          <div className="d-flex align-items-baseline gap-2 mb-4 mt-3">
            <div className="rounded shimmer-placeholder" style={{ width: "120px", height: "32px", backgroundColor: "#f9fafb" }}></div>
          </div>

          <div className="rounded shimmer-placeholder mb-4" style={{ width: "100%", height: "60px", backgroundColor: "#f9fafb" }}></div>

          <div className="mb-4">
            <div className="rounded shimmer-placeholder mb-2" style={{ width: "150px", height: "16px", backgroundColor: "#f9fafb" }}></div>
            <div className="d-flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded shimmer-placeholder" style={{ width: "80px", height: "40px", backgroundColor: "#f9fafb" }}></div>
              ))}
            </div>
          </div>

          <div className="d-flex flex-column gap-3 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded shimmer-placeholder w-100" style={{ height: "72px", backgroundColor: "#f9fafb" }}></div>
            ))}
          </div>

          <div className="rounded shimmer-placeholder w-100 mb-5" style={{ height: "150px", backgroundColor: "#f9fafb" }}></div>
        </div>
      </div>
    </div>
  );
}
