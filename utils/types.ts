
/** Based on the Foursquare API. */
export type Checkin = {
  id: string;
  createdAt: string;
  venue: Venue;
};

/** Based on the Foursquare API. */
export type Venue = {
  id: string;
  name: string;
  geocodes: { main?: { latitude: number; longitude: number } };
  location: { formatted_address: string };
  categories: { name: string }[];
  chains: { name: string }[];
};
