import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // 占位：Phase 3 实现 R2
  // 需在 Workers 运行时通过 env.BLOG_MEDIA.put
  return NextResponse.json({ error: "Not implemented - Phase 3 R2 upload" }, { status: 501 });
}

export async function GET() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
