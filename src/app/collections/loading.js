export default function Loading() {
  return (
    <div>
      {/* Hero Banner Skeleton */}
      <section
        style={{
          background: "#F9FAFB",
          borderBottom: "1px solid #E5E7EB",
          padding: "56px 24px 48px",
          textAlign: "center"
        }}
        className="shimmer-placeholder"
      >
        <div className="container d-flex flex-column align-items-center">
          <div className="rounded shimmer-placeholder mb-3" style={{ width: "200px", height: "16px", backgroundColor: "#E5E7EB" }}></div>
          <div className="rounded shimmer-placeholder mb-3" style={{ width: "300px", height: "50px", backgroundColor: "#E5E7EB" }}></div>
          <div className="rounded shimmer-placeholder" style={{ width: "400px", height: "24px", backgroundColor: "#E5E7EB" }}></div>
        </div>
      </section>

      {/* Main Body Skeleton */}
      <div className="container" style={{ padding: "48px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "40px", alignItems: "start" }}>
          
          {/* Sidebar Skeleton */}
          <div className="d-none d-lg-block">
            <div className="rounded shimmer-placeholder mb-4" style={{ width: "80px", height: "24px", backgroundColor: "#f9fafb" }}></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="mb-4">
                <div className="rounded shimmer-placeholder mb-2" style={{ width: "120px", height: "20px", backgroundColor: "#f9fafb" }}></div>
                <div className="rounded shimmer-placeholder mb-1" style={{ width: "100%", height: "16px", backgroundColor: "#f9fafb" }}></div>
                <div className="rounded shimmer-placeholder mb-1" style={{ width: "80%", height: "16px", backgroundColor: "#f9fafb" }}></div>
                <div className="rounded shimmer-placeholder" style={{ width: "90%", height: "16px", backgroundColor: "#f9fafb" }}></div>
              </div>
            ))}
          </div>

          {/* Product Grid Skeleton */}
          <div>
            <div className="d-flex justify-content-between mb-4 pb-3 border-bottom">
              <div className="rounded shimmer-placeholder" style={{ width: "150px", height: "20px", backgroundColor: "#f9fafb" }}></div>
            </div>
            <div className="row g-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="col-6 col-md-4 col-lg-3">
                  <div className="rounded shimmer-placeholder w-100" style={{ aspectRatio: "1 / 1", backgroundColor: "#f9fafb" }}></div>
                  <div className="mt-3">
                    <div className="rounded shimmer-placeholder mb-2" style={{ width: "40px", height: "12px", backgroundColor: "#f9fafb" }}></div>
                    <div className="rounded shimmer-placeholder mb-2" style={{ width: "100%", height: "20px", backgroundColor: "#f9fafb" }}></div>
                    <div className="rounded shimmer-placeholder" style={{ width: "60px", height: "16px", backgroundColor: "#f9fafb" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
