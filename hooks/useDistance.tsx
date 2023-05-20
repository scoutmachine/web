import { useEffect, useState } from "react";
import haversine from "haversine-distance";

export const useDistance = (
  latitude: number,
  longitude: number
): number | null => {
  const [distance, setDistance] = useState<number | null>(null);

  useEffect((): void => {
    navigator.permissions
      .query({ name: "geolocation" })
      .then((result: PermissionStatus): void => {
        if (result.state === "granted") {
          navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition): void => {
              const currentDistance: number =
                haversine(
                  {
                    lat: latitude,
                    lng: longitude,
                  },
                  {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  }
                ) / 1000;

              setDistance(currentDistance);
            }
          );
        }
      });
  }, [latitude, longitude]);

  return distance;
};
