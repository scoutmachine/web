export interface Team {
  address: string | null;
  city: string | null;
  country: string | null;
  gmaps_place_id: string | null;
  gmaps_url: string | null;
  key: string;
  lat: number | null;
  lng: number | null;
  location_name: string | null;
  motto: string | null;
  name: string | null;
  nickname: string;
  postal_code: string | null;
  rookie_year: number;
  school_name: string;
  state_prov: string | null;
  team_number: string;
  website: string | null;
}

export interface FavouritedTeam {
  id: number;
  team_number: number;
  website: string;
  nickname: string;
  city: string;
  state_prov: string;
  country: string;
  rookie_year: string;
}
