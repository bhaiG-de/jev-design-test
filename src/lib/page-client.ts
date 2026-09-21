export interface GeneratePageResult {
  pageId: string;
  label: string;
  /** slotId -> optionName -> probability */
  distributions: Record<string, Record<string, number>>;
}

// Calls the dev-server-side route in vite.config.ts, which holds the Jev
// API key — never call @typesafe-ai/sdk directly from browser code.
export async function generatePage(query: string): Promise<GeneratePageResult> {
  const res = await fetch("/api/generate-page", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    throw new Error(`Generate failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}
