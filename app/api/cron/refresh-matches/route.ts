import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getFootballProvider } from "@/lib/data-providers";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function isAuthorized(req: Request): boolean {
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
  const provider = getFootballProvider();
  const [matches, standings] = await Promise.all([
    provider.getMatches().catch(() => []),
    provider.getStandings().catch(() => []),
  ]);

  revalidatePath("/classement");
  revalidatePath("/stats");

  return NextResponse.json({
    ok: true,
    matches: matches.length,
    groups: standings.length,
    durationMs: Date.now() - start,
  });
}
