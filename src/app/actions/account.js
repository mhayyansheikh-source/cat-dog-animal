'use server';

import { cookies } from 'next/headers';
import { 
  createCustomerAccessToken, 
  createCustomer, 
  deleteCustomerAccessToken,
  getCustomerDetails,
  getCustomerOrders
} from '@/utils/shopify';

const TOKEN_COOKIE = 'shopify_customer_token';

export async function loginAction(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const result = await createCustomerAccessToken(email, password);

  if (result?.customerUserErrors?.length > 0) {
    return { error: result.customerUserErrors[0].message };
  }

  if (result?.customerAccessToken?.accessToken) {
    // Set HTTP-only cookie with the token
    cookies().set(TOKEN_COOKIE, result.customerAccessToken.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(result.customerAccessToken.expiresAt)
    });
    
    return { success: true };
  }

  return { error: "Unknown error occurred during login." };
}

export async function registerAction(formData) {
  const firstName = formData.get('firstName');
  const lastName = formData.get('lastName');
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const result = await createCustomer(firstName, lastName, email, password);

  if (result?.customerUserErrors?.length > 0) {
    return { error: result.customerUserErrors[0].message };
  }

  if (result?.customer?.id) {
    // Automatically log the user in after registration
    return loginAction(formData);
  }

  return { error: "Unknown error occurred during registration." };
}

export async function logoutAction() {
  const token = cookies().get(TOKEN_COOKIE)?.value;
  
  if (token) {
    await deleteCustomerAccessToken(token);
    cookies().delete(TOKEN_COOKIE);
  }
  
  return { success: true };
}

export async function getProfileAction() {
  const token = cookies().get(TOKEN_COOKIE)?.value;
  if (!token) return { error: "Not authenticated" };
  
  const customer = await getCustomerDetails(token);
  if (!customer) return { error: "Failed to fetch profile" };
  
  return { success: true, customer };
}

export async function getOrdersAction() {
  const token = cookies().get(TOKEN_COOKIE)?.value;
  if (!token) return { error: "Not authenticated" };
  
  const orders = await getCustomerOrders(token);
  return { success: true, orders };
}
