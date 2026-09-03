import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.email || !body.password) return NextResponse.json({ error: { code: "INVALID_CREDENTIALS", message: "E-mail e password são obrigatórios." } }, { status: 400 });
  return NextResponse.json({ data: { id: "demo-customer", name: "Cliente Demo", email: body.email }, meta: { source: "mock", token: "mock-session-token" } });
}
