# Foursquare Swarm Check-in Venue Data Retrieval

When you request your [Swarm](https://swarmapp.com/) check-in data from [Foursquare](https://foursquare.com/), only the venue name and ID of each of your check-ins are included:

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

So the included script retrieves the full details for each venue you have visited from the [Foursquare Places API](https://location.foursquare.com/developer/reference/place-details), particularly the:

* Address
* Geo-coded latitude and longitude
* Category

## Setup

### Data Request

In the Swarm app, go to Profile -> Settings -> Privacy Settings -> Initiative Data Download Request to request a zipped JSON/CSV copy of your data to be emailed to you within a few days.

### Developer Account

Login to your Foursquare developer account: <https://foursquare.com/developers/home>

Create a project.

Generate a "Places API Key".

## Clone

Clone this project with `git clone`.

## Usage

Run the following command from inside this project folder. Be sure to fill-in the environment variables with your API key and the path to the folder of the exported data request from Foursquare:

```sh
FSQ_PLACES_API_KEY=your_places_api_key PATH_DATA_EXPORT=./data-export-123 node script.js
```

The following files will be generated in the provided data export folder:

* `generated-venues.json` with a list of all your check-in venues
* `generated-irretrievable-checkins.csv` with any check-ins that did not have associated venues, likely because the venue has been deleted
* `generated-irretrievable-venues.csv` with any venues that could be not retrieved from the API, possibly because the venue is private, or another unknown reason (TODO: investigate why the API returns "invalid venue specified" for a large number of venues)

A `LIMIT` environment variable can be set to limit the number of venues to be retrieved from the Foursquare API.

**Warning**: This will use some of your Foursquare developer account budget/credits. Each venue/places API request costs 5 credits. You get 200,000 ($200) free credits per month.

## Future / TODO

* Support generating results as either CSV or JSON
* Customizable output file path
* Convert project to TypeScript
* Make this into a CLI tool
* Publish this on NPM
