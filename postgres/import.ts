import { readFileSync, existsSync } from "fs";
import postgres from "postgres";

// Configuration - update these values for your local PostgreSQL
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost:5432/baby_predictions";

const sql = postgres(DATABASE_URL);

interface ConvexDocument {
  _id: string;
  _creationTime: number;
  prediction: string;
  timestamp: number;
}

async function importJsonl(
  filePath: string,
  tableName: string
): Promise<number> {
  if (!existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return 0;
  }

  const content = readFileSync(filePath, "utf-8").trim();
  if (!content) {
    console.log(`No data in ${filePath}`);
    return 0;
  }

  const lines = content.split("\n").filter((line) => line.trim());
  let count = 0;

  for (const line of lines) {
    const doc: ConvexDocument = JSON.parse(line);
    await sql`
      INSERT INTO ${sql(tableName)} (id, prediction, timestamp)
      VALUES (${doc._id}, ${doc.prediction}, ${doc.timestamp})
      ON CONFLICT (id) DO UPDATE SET
        prediction = EXCLUDED.prediction,
        timestamp = EXCLUDED.timestamp
    `;
    count++;
  }

  return count;
}

async function main() {
  const exportDir = process.argv[2] || "./convex-export-data";

  console.log("Importing Convex data to PostgreSQL...");
  console.log(`Export directory: ${exportDir}`);
  console.log(`Database: ${DATABASE_URL}\n`);

  try {
    // Import each table
    const tables = [
      { jsonl: "votes/documents.jsonl", table: "votes" },
      { jsonl: "arrivalVotes/documents.jsonl", table: "arrival_votes" },
      { jsonl: "weightVotes/documents.jsonl", table: "weight_votes" },
    ];

    for (const { jsonl, table } of tables) {
      const filePath = `${exportDir}/${jsonl}`;
      const count = await importJsonl(filePath, table);
      console.log(`Imported ${count} rows into ${table}`);
    }

    console.log("\nImport complete!");
  } catch (error) {
    console.error("Import failed:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
