const { readFileSync, existsSync } = require("fs");
const { join } = require("path");
const { writeCSV } = require("./csv");

// Load environment variables.
const pathDataExport = process.env.PATH_DATA_EXPORT;
if (!pathDataExport) {
  console.error("Missing environment variable PATH_DATA_EXPORT");
  process.exit(1);
}

function loadStations(pathDataExport) {
  const pathToJSON = join(pathDataExport, `generated-venues.json`);
  if (!existsSync(pathToJSON)) {
    console.error("Missing generated-venues.json");
    return;
  }

  const file = readFileSync(pathToJSON, "utf8");
  const venues = JSON.parse(file);
  const stations = venues.filter((venue) => {
    if (
      venue.categories.length > 0 &&
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
  });

  return { stations };
}

const { stations } = loadStations(pathDataExport);
writeCSV(
  stations,
  pathDataExport,
  "generated-stations",
  process.env.PAGE_SIZE || Number.MAX_VALUE,
);
