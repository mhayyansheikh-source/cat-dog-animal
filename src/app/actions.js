"use server";

import { createShopifyCheckout } from "@/utils/shopify";

export async function checkoutAction(lineItems) {
  return await createShopifyCheckout(lineItems);
}
