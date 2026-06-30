'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function OrdersPage() {
  const [orders, setOrders] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch('/api/account/orders');
        if (res.status === 401) {
          router.push('/account/login');
          return;
        }
        const data = await res.json();
        if (data.error) {
          router.push('/account/login');
        } else {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        router.push('/account/login');
      }
    }
    loadOrders();
  }, [router]);

  if (orders === null) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="h3 mb-4">Order History</h1>

      {orders.length === 0 ? (
        <div className="card border-0 bg-light p-5 text-center rounded-card">
          <p className="text-muted mb-0">You haven&apos;t placed any orders yet.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => (
            <div key={order.id} className="card border p-4 rounded-card shadow-sm">
              <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3 gap-2">
                <div>
                  <h3 className="h6 mb-1">Order #{order.orderNumber}</h3>
                  <small className="text-muted">
                    {new Date(order.processedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </small>
                </div>
                <div className="text-end flex-shrink-0">
                  <span className="badge bg-dark d-block mb-1">
                    {order.fulfillmentStatus || 'UNFULFILLED'}
                  </span>
                  <div className="fw-bold">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: order.totalPrice.currencyCode,
                    }).format(order.totalPrice.amount)}
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column gap-3">
                {order.lineItems.edges.map(({ node: item }, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-3">
                    {item.variant?.image?.url ? (
                      <div
                        className="rounded overflow-hidden bg-light flex-shrink-0"
                        style={{ width: '60px', height: '60px', position: 'relative' }}
                      >
                        <Image
                          src={item.variant.image.url}
                          alt={item.title}
                          fill
                          sizes="60px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    ) : (
                      <div
                        className="rounded bg-secondary flex-shrink-0"
                        style={{ width: '60px', height: '60px' }}
                      />
                    )}
                    <div>
                      <div className="fw-bold">{item.title}</div>
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
