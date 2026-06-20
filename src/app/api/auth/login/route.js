import { NextResponse } from "next/server";
import { customerAccessTokenCreate } from "@/utils/shopify";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    const authData = await customerAccessTokenCreate(email, password);

    if (authData?.customerUserErrors?.length > 0) {
      return NextResponse.json({ success: false, error: authData.customerUserErrors[0].message }, { status: 401 });
    }

    const token = authData?.customerAccessToken?.accessToken;
    const expiresAt = authData?.customerAccessToken?.expiresAt;

    if (token) {
      // Set HTTP-only cookie
      cookies().set("shopify_customer_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(expiresAt),
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
