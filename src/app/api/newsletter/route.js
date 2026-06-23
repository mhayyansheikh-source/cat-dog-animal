import { subscribeToNewsletter } from "@/utils/shopify";

export const runtime = "edge";

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return Response.json({ error: "Email is required." }, { status: 400 });
    }

    const result = await subscribeToNewsletter(email);
    if (!result) {
      return Response.json({ error: "Subscription failed. Please try again later." }, { status: 500 });
    }
    
    if (result.customerUserErrors?.length > 0) {
      return Response.json({ error: result.customerUserErrors[0].message }, { status: 400 });
    }
    
    return Response.json({ success: true, message: "Successfully subscribed!" });
  } catch (error) {
    return Response.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}
