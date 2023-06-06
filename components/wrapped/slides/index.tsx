import { TotalMatches } from "./TotalMatches";
import { TotalEvents } from "./TotalEvents";
import { TotalAwards } from "./TotalAwards";
import { TotalFavourited } from "./TotalFavourited";

export interface Slide {
  name: string;
  component: React.FC;
  duration: number;
  spotify?: string;
}

export const SLIDES: Slide[] = [
  {
    name: "Total Events",
    component: TotalEvents,
    duration: 6000,
    spotify: "spotify:track:42GOIiPxJQPPLupSqJUmSS",
  },
  {
    name: "Total Awards",
    component: TotalAwards,
    duration: 6000,
  },
  {
    name: "Total Matches",
    component: TotalMatches,
    duration: 6000,
    spotify: "spotify:track:3bidbhpOYeV4knp8AIu8Xn",
  },
  {
    name: "Total Favourited",
    component: TotalFavourited,
    duration: 6000,
  },
];
