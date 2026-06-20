import React from "react";
import { cookies } from "next/headers";
import { getCustomerData } from "@/utils/shopify";
import { redirect } from "next/navigation";
import { Package, User } from "lucide-react";

export default async function AccountPage() {
  const token = cookies().get("shopify_customer_token")?.value;

  if (!token) {
    redirect("/");
  }

  const customer = await getCustomerData(token);

  if (!customer) {
    // Token might be invalid or expired
    redirect("/");
  }

  const orders = customer.orders?.edges || [];

  return (
    <div className="container py-5" style={{ minHeight: "60vh" }}>
      <div className="row g-5">
        <div className="col-lg-4">
          <div className="rounded-card p-4 text-center">
            <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "80px", height: "80px" }}>
              <User size={40} className="text-muted" />
            </div>
            <h4 className="font-heading fw-bold">{customer.firstName} {customer.lastName}</h4>
            <p className="text-muted mb-4">{customer.email}</p>
            
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="btn btn-outline-danger w-100 rounded-pill fw-bold">
                Log Out
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-8">
          <h2 className="font-heading fw-bold mb-4">Order History</h2>
          
          {orders.length === 0 ? (
            <div className="rounded-card p-5 text-center text-muted">
              <Package size={48} className="mb-3 opacity-50" />
              <p className="fs-5">You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {orders.map(({ node: order }) => (
                <div key={order.id} className="rounded-card p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div>
                    <h5 className="font-heading fw-bold mb-1">Order #{order.orderNumber}</h5>
                    <p className="text-muted small mb-0">
                      Placed on {new Date(order.processedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-end">
                    <span className="fs-5 fw-bold text-zesty-orange d-block">${order.totalPrice.amount}</span>
                    <span className="badge bg-success">Processing</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
