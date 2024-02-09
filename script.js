const { readFileSync, writeFileSync, existsSync } = require("fs");
const { join } = require("path");
const sdk = require("api")("@fsq-developer/v1.0#18rps1flohmmndw");

// Load environment variables.
const fsqPlacesApiKey = process.env.FSQ_PLACES_API_KEY;
if (!fsqPlacesApiKey) {
  console.error("Missing environment variable FSQ_PLACES_API_KEY");
  process.exit(1);
}

sdk.auth(fsqPlacesApiKey);

const pathDataExport = process.env.PATH_DATA_EXPORT;
if (!pathDataExport) {
  console.error("Missing environment variable PATH_DATA_EXPORT");
  process.exit(1);
}

function loadVenuesFromDataRequest(pathDataExport) {
  const venues = new Set();
  const checkinsMissingVenues = [];

  let page = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Retrieve json for this page of checkins.
    const pathToJSON = join(pathDataExport, `checkins${page}.json`);
    if (!existsSync(pathToJSON)) {
      break;
    }
    const file = readFileSync(pathToJSON, "utf8");
    const json = JSON.parse(file);

    // Go through all checkins in this page.
    for (const item of json.items) {
      const venue = item.venue;
      if (!venue || !venue.id) {
        console.log(
          `Missing venue for checkin ID ${item.id} on ${item.createdAt}.`,
        );
        checkinsMissingVenues.push(item.id);
        continue;
      }

      venues.add(venue.id);
    }

    page++;
  }

  console.log(`Loaded ${page - 1} pages of checkins.`);

  return { venues, checkinsMissingVenues };
}

async function retrieveVenueDetails(venues, limit = Number.MAX_VALUE) {
  const venuesFromAPI = new Map();
  const irretrievableVenues = [];

  const { default: pLimit } = await import("p-limit");
  const limitRequests = pLimit(3); // Roughly satisfy the max 50 QPS allowed: https://location.foursquare.com/developer/reference/rate-limits

  console.log(`Retrieving details for ${venues.size} venues.`);

  let countRequests = 0;
  for (const fsq_id of venues) {
    countRequests++;
    if (countRequests > limit) {
      break;
    }

    await limitRequests(async () => {
      await sdk
        .placeDetails({ fsq_id })
        .then(({ data }) => venuesFromAPI.set(fsq_id, data))
        .catch((err) => {
          console.error(err.data);
          irretrievableVenues.push(fsq_id);
        });
    });

    if (countRequests % 50 === 0) {
      console.log(
        `Retrieved details for ${countRequests} of ${venues.size} venues.`,
      );
    }
  }

  return { venuesFromAPI, irretrievableVenues };
}

const { venues, checkinsMissingVenues } =
  loadVenuesFromDataRequest(pathDataExport);

retrieveVenueDetails(venues, process.env.LIMIT).then(
  ({ venuesFromAPI, irretrievableVenues }) => {
    const json = JSON.stringify([...venuesFromAPI.values()]);
    const pathToGeneratedVenues = join(pathDataExport, "generated-venues.json");
    writeFileSync(pathToGeneratedVenues, json, "utf8");
    console.log("Saved venues to", pathToGeneratedVenues);

    writeFileSync(
      join(pathDataExport, "generated-irretrievable-checkins.csv"),
      checkinsMissingVenues.join(","),
      "utf8",
    );
    writeFileSync(
      join(pathDataExport, "generated-irretrievable-venues.csv"),
      irretrievableVenues.join(","),
      "utf8",
    );
  },
);
