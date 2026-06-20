import { NextResponse } from "next/server";
import { getPredictiveSearch } from "@/utils/shopify";

export const runtime = 'edge';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await getPredictiveSearch(query);
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Predictive search route error:", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
