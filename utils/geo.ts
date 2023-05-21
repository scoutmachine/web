import axios, { AxiosResponse } from "axios";

export interface GeoData {
  lat: number;
  lng: number;
}

interface GeocodeResult {
  results: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }[];
}

export async function getGeoData(address: string): Promise<GeoData | null> {
  const response: AxiosResponse<GeocodeResult, any> =
    await axios.get<GeocodeResult>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address.replace(
        / /g,
        ""
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
  const json: GeocodeResult = response.data;
  if (json.results.length === 0) {
    return null;
  }
  const { lat, lng } = json.results[0].geometry.location;
  return { lat, lng };
}
