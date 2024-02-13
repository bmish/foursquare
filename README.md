# Foursquare Swarm Check-in Venue Data Retrieval

When you [request](#data-request) your [Swarm](https://swarmapp.com/) historical check-in data from [Foursquare](https://foursquare.com/), only the venue name and ID of each of your check-ins are included:

```json
{
  "venue": {
    "id": "42829c80f964a5206a221fe3",
    "name": "Grand Central Terminal",
    "url": "https://foursquare.com/v/grand-central-terminal/42829c80f964a5206a221fe3"
  }
}
```

This is generally not enough data to be useful for analysis or even just storing the data in your own personal record.

So the included script retrieves the full details for each venue you have visited from the [Foursquare Get Place Details API](https://location.foursquare.com/developer/reference/place-details), particularly the:

* Address
* Geo-coded latitude and longitude
* Category

## Setup

### Data Request

In the Swarm [app](https://apps.apple.com/us/app/foursquare-swarm-check-in-app/id870161082), go to Profile -> Settings -> Privacy Settings -> Initiate Data Download Request to request a zipped JSON/CSV copy of your data to be emailed to you within a few days.

### API Key

Login to your [Foursquare developer account](https://foursquare.com/developers/home).

Create a project.

Generate a "Places API Key".

### Repository

Retrieve this repository:

```sh
git clone ...
```

From inside the repository folder:

```sh
npm install
```

```sh
npm run build
```

## Usage

Run the following command from inside this project folder. Be sure to fill-in the environment variables with your [API key](#api-key) and the path to the folder of the [exported data request](#data-request) from Foursquare:

```sh
FSQ_PLACES_API_KEY=your_places_api_key PATH_DATA_EXPORT=./data-export-123 npm run generate-venues
```

The following files will be generated in the provided data export folder:

* `generated-venues.json` with a list of all your check-in venues
* `generated-venues.csv` with a list of all your check-in venues
* `generated-irretrievable-checkins.csv` with any check-ins that did not have associated venues, possibly because the venue has been deleted
* `generated-irretrievable-venues.csv` with any venues that could be not retrieved from the API, possibly because the venue is private, or another unknown reason (TODO: see this [thread](https://discord.com/channels/1002230925935005747/1205607917513085039/1205607918976892948) about why the API is returning "invalid venue specified" for a large number of venues)

For testing purposes, a `LIMIT` environment variable can be set to limit the number of venues to be retrieved from the Foursquare API.

Optionally use the `PAGE_SIZE` environment variable to choose how many rows to include in each CSV file. No limit by default.

**Warning**: This will use some of your Foursquare developer account budget/credits. Each venue/places API request costs 5 credits. You get 200,000 ($200) free credits per month.

## Future / TODO

* Customizable output file path
* Add a CLI command
* Publish this on NPM

## Special Analysis

### MTA NYC Subway Stations

One-off analysis script for testing and demonstration purposes.

```sh
PATH_DATA_EXPORT=./data-export-123 npm run analyze-mta-subway
```
