import fs from "node:fs/promises";
import path from "node:path";
import type { LandingPageData } from "../types/landing";

// In production/SSR, we want to read from the actual file system
// to ensure we get the latest data without a rebuild.
const DATA_FILE = path.join(process.cwd(), "src/data/landing.json");

export async function getLandingData(): Promise<LandingPageData> {
  try {
    const fileContent = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(fileContent) as LandingPageData;
  } catch (error) {
    console.error("Error reading landing data:", error);
    // Fallback or re-throw depending on desired behavior
    throw new Error("Failed to load landing page data");
  }
}

export async function saveLandingData(data: LandingPageData): Promise<void> {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving landing data:", error);
    throw new Error("Failed to save landing page data");
  }
}
