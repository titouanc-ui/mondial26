import type { FootballProvider } from "./types";
import { FootballDataOrgProvider } from "./football-data-org";
import { MockProvider } from "./mock-provider";

let instance: FootballProvider | null = null;

export function getFootballProvider(): FootballProvider {
  if (instance) return instance;

  const choice = (process.env.FOOTBALL_PROVIDER ?? "mock").toLowerCase();

  switch (choice) {
    case "football-data-org":
      instance = new FootballDataOrgProvider();
      break;
    case "mock":
    default:
      instance = new MockProvider();
      break;
  }

  return instance;
}

export type * from "./types";
