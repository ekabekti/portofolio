import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 5;
const submissions = new Map<string, number[]>();

function getClientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous"
  );
}

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (submissions.get(key) ?? []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW);
  recent.push(now);
  submissions.set(key, recent);
  return recent.length > RATE_LIMIT_MAX;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function cleanString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Format request tidak valid." }, { status: 400 });
  }

  if (!isRecord(payload)) {
    return NextResponse.json({ success: false, error: "Data formulir tidak valid." }, { status: 400 });
  }

  // Honeypot: return success so bots do not learn how the filter works.
  if (cleanString(payload.honeypot, 120)) {
    return NextResponse.json({ success: true });
  }

  const name = cleanString(payload.name, 120);
  const email = cleanString(payload.email, 200).toLowerCase();
  const subject = cleanString(payload.subject, 160);
  const message = cleanString(payload.message, 5000);

  if (name.length < 2) {
    return NextResponse.json({ success: false, error: "Nama minimal 2 karakter." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, error: "Format email belum valid." }, { status: 400 });
  }

  if (message.length < 10) {
    return NextResponse.json({ success: false, error: "Ceritakan konteksnya minimal 10 karakter." }, { status: 400 });
  }

  if (isRateLimited(getClientKey(request))) {
    return NextResponse.json(
      { success: false, error: "Terlalu banyak percobaan. Coba lagi sebentar lagi." },
      { status: 429 },
    );
  }

  const supabase = getAdminSupabase();
  if (!supabase) {
    return NextResponse.json(
      { success: false, error: "Backend belum dikonfigurasi. Silakan kirim email langsung." },
      { status: 503 },
    );
  }

  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    subject: subject || null,
    message,
  });

  if (error) {
    console.error("Contact message insert failed", error.message);
    return NextResponse.json(
      { success: false, error: "Pesan belum tersimpan. Silakan coba lagi atau kirim via email." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { success: true, message: "Pesan berhasil diterima." },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
}
