import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { Venue } from "./types.js";
import { json2csv } from "json-2-csv";

async function jsonToCsvHelper(venues: Venue[]): Promise<string> {
  // Delete all the nested stuff under related_places which is excessive and not very relevant.
  // Workaround this issue with `excludeKeys`: https://github.com/mrodrig/json-2-csv/issues/244
  venues = venues.map((venue) => {
    delete venue.related_places;
    return venue;
  });

  const csv = await json2csv(venues, {
    expandArrayObjects: true,
  });
  return csv;
}

export async function writeCSV(
  venues: Venue[],
  pathFolder: string,
  pathFilenameWithoutExtension: string,
  pageSize: number = Number.MAX_VALUE,
) {
  if (venues.length < pageSize) {
    const csv = await jsonToCsvHelper(venues);
    const path = join(pathFolder, pathFilenameWithoutExtension + ".csv");
    writeFileSync(path, csv, "utf8");
    console.log("Wrote to", path);
  } else {
    const splits = Math.ceil(venues.length / pageSize);
    for (let index = 0; index < splits; index++) {
      const csv = await jsonToCsvHelper(
        venues.slice(index * pageSize, (index + 1) * pageSize),
      );
      const path = join(
        pathFolder,
        pathFilenameWithoutExtension + "-" + (index + 1) + ".csv",
      );
      writeFileSync(
        join(
          pathFolder,
          pathFilenameWithoutExtension + "-" + (index + 1) + ".csv",
        ),
        csv,
        "utf8",
      );
      console.log("Wrote to", path);
    }
  }
}
