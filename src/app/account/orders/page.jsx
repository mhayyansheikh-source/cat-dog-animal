import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { getCustomerOrders } from '@/utils/shopify';

export const runtime = 'edge';

export default async function OrdersPage() {
  const token = cookies().get('shopify_customer_token')?.value;

  if (!token) {
    redirect('/account/login');
  }

  const orders = await getCustomerOrders(token);

  return (
    <div>
      <h1 className="h3 mb-4">Order History</h1>
      
      {orders.length === 0 ? (
        <div className="card border-0 bg-light p-5 text-center rounded-card">
          <p className="text-muted mb-0">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => (
            <div key={order.id} className="card border p-4 rounded-card shadow-sm">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                <div>
                  <h3 className="h6 mb-1">Order #{order.orderNumber}</h3>
                  <small className="text-muted">
                    {new Date(order.processedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </small>
                </div>
                <div className="text-end">
                  <span className="badge bg-dark mb-1">{order.fulfillmentStatus || 'UNFULFILLED'}</span>
                  <div className="fw-bold">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: order.totalPrice.currencyCode }).format(order.totalPrice.amount)}
                  </div>
                </div>
              </div>
              
              <div className="d-flex flex-column gap-3">
                {order.lineItems.edges.map(({ node: item }, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-3">
                    {item.variant?.image?.url ? (
                      <div className="rounded overflow-hidden bg-light" style={{ width: '60px', height: '60px', position: 'relative' }}>
                        <Image 
                          src={item.variant.image.url} 
                          alt={item.title}
                          fill
                          sizes="60px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    ) : (
                      <div className="rounded bg-secondary" style={{ width: '60px', height: '60px' }}></div>
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
