import { getCustomerProfile } from '@/utils/customerAccount';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const runtime = 'edge';

export default async function AccountPage() {
  const customer = await getCustomerProfile();

  if (!customer) {
    // If not authenticated or token expired, redirect to login
    redirect('/api/auth/login');
  }

  const orders = customer.orders?.edges.map(e => e.node) || [];

  return (
    <div className="container py-5" style={{ minHeight: "60vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="fw-bold mb-0" style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif" }}>
          My Account
        </h1>
        <a 
          href="/api/auth/logout" 
          className="btn btn-outline-danger px-4 rounded-pill fw-bold hover-scale"
        >
          Logout
        </a>
      </div>

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4 font-heading text-charcoal-dark">Profile Details</h4>
              <div className="mb-3">
                <span className="text-muted d-block small text-uppercase fw-bold letter-spacing-wide">Name</span>
                <span className="fs-5 fw-semibold">{customer.firstName} {customer.lastName}</span>
              </div>
              <div className="mb-3">
                <span className="text-muted d-block small text-uppercase fw-bold letter-spacing-wide">Email</span>
                <span className="fs-5">{customer.emailAddress?.emailAddress}</span>
              </div>
              
              <a href="https://peteora-2.myshopify.com/account" className="btn btn-outline-secondary w-100 mt-3 rounded-pill">
                Manage on Shopify
              </a>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4 font-heading text-charcoal-dark">Recent Orders</h4>
              
              {orders.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-3 opacity-50" style={{ fontSize: "40px" }}>📦</div>
                  <h5 className="fw-bold text-muted">No orders yet</h5>
                  <p className="text-muted mb-4">You haven't placed any orders yet.</p>
                  <Link href="/collections/all" className="btn btn-zesty-primary rounded-pill px-4 hover-scale">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {orders.map(order => (
                    <div key={order.id} className="p-3 border rounded-3 bg-light d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                      <div>
                        <h6 className="fw-bold mb-1 text-charcoal-dark">Order #{order.number}</h6>
                        <ul className="list-unstyled mb-0 text-muted small">
                          {order.lineItems.edges.map(({ node }, idx) => (
                            <li key={idx}>• {node.title}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-md-end text-start">
                        <div className="fw-bold text-zesty-orange fs-5">
                          {order.totalPrice.currencyCode} {order.totalPrice.amount}
                        </div>
                        <span className="badge bg-secondary rounded-pill fw-normal mt-1">
                          Completed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
