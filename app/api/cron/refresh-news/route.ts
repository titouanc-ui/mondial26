import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { fetchAllNews } from "@/lib/news/fetcher";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(req: Request): boolean {
  // Vercel envoie automatiquement Authorization: Bearer <CRON_SECRET>
  // pour les cron jobs si la variable CRON_SECRET est définie.
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  return auth === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const start = Date.now();
  const articles = await fetchAllNews();
  revalidatePath("/news");

  return NextResponse.json({
    ok: true,
    count: articles.length,
    durationMs: Date.now() - start,
  });
}
