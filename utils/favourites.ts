import { API_URL } from "@/lib/constants";
import router from "next/router";

export const getFavourites = async (setFavourites: any) => {
  const data = await fetch(`${API_URL}/api/@me/favourites`);

  if (data.ok) {
    const JSONdata = await data.json();
    setFavourites(JSONdata.favouritedTeams);
  }
};

export const favouriteTeam = async (data: any) => {
  await fetch(`${API_URL}/api/@me/favourites`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const unfavouriteTeam = async (
  favouritedTeam: any,
  noReload?: boolean
) => {
  await fetch(`${API_URL}/api/@me/favourites?id=${favouritedTeam[0].id}`, {
    method: "DELETE",
  });

  if (!noReload) router.push(router.pathname);
};
