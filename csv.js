const { writeFileSync } = require("fs");
const { join } = require("path");

function linesToFile(lines) {
  const file = [
    ["Name", "Latitude", "Longitude", "Address"].join(","),
    ...lines,
  ].join("\n");

  return file;
}

function writeCSV(
  venues,
  pathFolder,
  pathFilenameWithoutExtension,
  pageSize = Number.MAX_VALUE,
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
    for (let i = 0; i < splits; i++) {
      const splitFile = linesToFile(
        lines.slice(i * pageSize, (i + 1) * pageSize),
      );
      const path = join(
        pathFolder,
        pathFilenameWithoutExtension + "-" + (i + 1) + ".csv",
      );
      writeFileSync(
        join(pathFolder, pathFilenameWithoutExtension + "-" + (i + 1) + ".csv"),
        splitFile,
        "utf8",
      );
      console.log("Wrote to", path);
    }
  }
}

module.exports = { writeCSV };
