import { NextResponse } from 'next/server';
import { getCustomerDetails } from '@/utils/shopify';

export const runtime = 'edge';

export async function GET(request) {
  const token = request.cookies.get('shopify_customer_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const customer = await getCustomerDetails(token);

    if (!customer) {
      return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 404 });
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Error fetching customer details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
