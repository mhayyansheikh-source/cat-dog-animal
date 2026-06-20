import { NextResponse } from "next/server";
import { customerCreate, customerAccessTokenCreate } from "@/utils/shopify";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    const createData = await customerCreate(email, password, firstName, lastName);

    if (createData?.customerUserErrors?.length > 0) {
      return NextResponse.json({ success: false, error: createData.customerUserErrors[0].message }, { status: 400 });
    }

    // Immediately log the user in after registration
    const authData = await customerAccessTokenCreate(email, password);
    const token = authData?.customerAccessToken?.accessToken;
    const expiresAt = authData?.customerAccessToken?.expiresAt;

    if (token) {
      cookies().set("shopify_customer_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(expiresAt),
        path: "/",
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Account created but login failed" }, { status: 500 });
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
