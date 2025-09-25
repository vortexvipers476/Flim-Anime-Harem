// 
import { NextResponse } from "next/server";

export function middleware(req) {
  const userAgent = req.headers.get("user-agent") || "";
  const url = req.nextUrl.clone();

  // 1. Blokir kalau ga ada user-agent
  if (!userAgent) {
    return new NextResponse("Blocked: Missing User-Agent", { status: 403 });
  }

  // 2. Blokir user-agent yang biasa dipakai axios, node-fetch, cheerio, curl
  const botPatterns = [
    "axios",
    "node-fetch",
    "cheerio",
    "curl",
    "python-requests",
    "java",
    "okhttp"
  ];
  if (botPatterns.some(p => userAgent.toLowerCase().includes(p))) {
    return new NextResponse("Blocked: Bot detected", { status: 403 });
  }

  // 3. Bisa tambahin proteksi rate limit per IP
  const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";
  const blockedIps = ["1.2.3.4"]; // contoh IP blacklist
  if (blockedIps.includes(ip)) {
    return new NextResponse("Blocked: IP not allowed", { status: 403 });
  }

  return NextResponse.next();
}

// ✅ Middleware aktif untuk semua halaman (termasuk index.js)
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
