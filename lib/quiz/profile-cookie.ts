import { cookies } from "next/headers";

const COOKIE_NAME = "m26_pid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

export async function getCurrentProfileId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function setCurrentProfileId(profileId: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, profileId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearCurrentProfileId(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
