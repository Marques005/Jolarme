import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", service: "jolarme-mock-api", version: "1.0.0" });
}
