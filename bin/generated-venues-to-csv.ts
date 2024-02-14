#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { writeCSV } from "../utils/csv.js";

// Load environment variables.
const pathDataExport = process.env.PATH_DATA_EXPORT;
if (!pathDataExport) {
  console.error("Missing environment variable PATH_DATA_EXPORT");
  process.exit(1);
}

function loadVenuesFromGeneratedVenues(pathDataExport: string) {
  const pathToJSON = join(pathDataExport, `generated-venues.json`);
  if (!existsSync(pathToJSON)) {
    console.log("File does not exist: generated-venues.json");
  }
  const file = readFileSync(pathToJSON, "utf8");
  const venues = JSON.parse(file);

  console.log("Count of venues =", venues.length);

  return { venues };
}

const { venues } = loadVenuesFromGeneratedVenues(pathDataExport);
writeCSV(
  venues,
  pathDataExport,
  "generated-venues",
  process.env.PAGE_SIZE ? Number(process.env.PAGE_SIZE) : Number.MAX_VALUE,
);
