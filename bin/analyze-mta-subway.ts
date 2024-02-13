#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { writeCSV } from "../utils/csv.js";
import { Venue } from "../utils/types.js";

// Load environment variables.
const pathDataExport = process.env.PATH_DATA_EXPORT;
if (!pathDataExport) {
  console.error("Missing environment variable PATH_DATA_EXPORT");
  process.exit(1);
}

function loadStations(pathDataExport: string): { stations: Venue[] } {
  const pathToJSON = join(pathDataExport, `generated-venues.json`);
  if (!existsSync(pathToJSON)) {
    console.error("Missing generated-venues.json");
    return { stations: [] };
  }

  const file = readFileSync(pathToJSON, "utf8");
  const venues: Venue[] = JSON.parse(file);
  const stations = venues.filter((venue) => {
    if (
      venue.categories.some((category) => category.name === "Sandwich Spot")
    ) {
      // Ignore Subway fast food restaurant.
      return false;
    }

    if (venue.chains.length > 0 && venue.chains[0].name === "MTA Subway") {
      return true;
    }

    if (
      venue.name.includes("MTA") &&
      (venue.name.includes("Station") || venue.name.includes("Subway"))
    ) {
      return true;
    }

    return false;
  });

  return { stations };
}

const { stations } = loadStations(pathDataExport);

writeCSV(
  stations,
  pathDataExport,
  "generated-stations",
  process.env.PAGE_SIZE ? Number(process.env.PAGE_SIZE) : Number.MAX_VALUE,
);
