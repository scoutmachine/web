import { API_URL } from "@/lib/constants";
import router from "next/router";

export async function getFavourites(setFavourites: any): Promise<void> {
  const data: Response = await fetch(`${API_URL}/api/@me/favourites`);

  if (data.ok) {
    const JSONdata = await data.json();
    setFavourites(JSONdata.favouritedTeams);
  }
}

export async function favouriteTeam(data: any): Promise<void> {
  await fetch(`${API_URL}/api/@me/favourites`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function unfavouriteTeam(
  favouritedTeam: any,
  noReload?: boolean
): Promise<void> {
  await fetch(`${API_URL}/api/@me/favourites?id=${favouritedTeam[0].id}`, {
    method: "DELETE",
  });

  if (!noReload) await router.push(router.pathname);
}
