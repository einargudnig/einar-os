import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incrementalCache override: nothing in this app calls revalidate, so there
// is no ISR to persist. Add r2IncrementalCache here if that changes.
export default defineCloudflareConfig();
