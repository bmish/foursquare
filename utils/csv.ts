import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { Venue } from "./types.js";

function linesToFile(lines: string[]): string {
  const file = [
    ["Name", "Latitude", "Longitude", "Address"].join(","),
    ...lines,
  ].join("\n");

  return file;
}

export function writeCSV(
  venues: Venue[],
  pathFolder: string,
  pathFilenameWithoutExtension: string,
  pageSize: number = Number.MAX_VALUE,
) {
  const lines = venues.flatMap((venue) => {
    if (!venue.geocodes.main) {
      return [];
    }
    return [
      [
        venue.name.includes(",") ? `"${venue.name}"` : venue.name,
        venue.geocodes.main.latitude,
        venue.geocodes.main.longitude,
        `"${venue.location.formatted_address}"`,
      ].join(","),
    ];
  });

  if (lines.length < pageSize) {
    const path = join(pathFolder, pathFilenameWithoutExtension + ".csv");

    writeFileSync(path, linesToFile(lines), "utf8");
    console.log("Wrote to", path);
  } else {
    const splits = Math.ceil(lines.length / pageSize);
    for (let index = 0; index < splits; index++) {
      const splitFile = linesToFile(
        lines.slice(index * pageSize, (index + 1) * pageSize),
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
        splitFile,
        "utf8",
      );
      console.log("Wrote to", path);
    }
  }
}
