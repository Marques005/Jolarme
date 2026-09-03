import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.name || !body.email || !body.message) return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Preencha os campos obrigatórios." } }, { status: 400 });
  return NextResponse.json({ data: { requestId: `JOL-${Date.now()}`, status: "received", estimatedReply: "1 dia útil" }, meta: { source: "mock", delivered: false } }, { status: 201 });
}
