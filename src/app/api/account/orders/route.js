import { NextResponse } from 'next/server';
import { getCustomerOrders } from '@/utils/shopify';

export const runtime = 'edge';

export async function GET(request) {
  const token = request.cookies.get('shopify_customer_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const orders = await getCustomerOrders(token);
    return NextResponse.json({ orders: orders || [] });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
