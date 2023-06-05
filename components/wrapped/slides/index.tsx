import { FirstSlide } from "./FirstSlide";
import { SecondSlide } from "./SecondSlide";
import { ThirdSlide } from "./ThirdSlide";

export interface Slide {
  name: string;
  component: React.FC;
  duration: number;
  spotify?: string;
}

export const SLIDES: Slide[] = [
  {
    name: "First Slide",
    component: FirstSlide,
    duration: 6000,
    spotify: "spotify:track:0RiRZpuVRbi7oqRdSMwhQY",
  },
  {
    name: "Second Slide",
    component: SecondSlide,
    duration: 6000,
    spotify: "spotify:track:47Mf1u67oqXtWBAaUHUSi7",
  },
  {
    name: "Third Slide",
    component: ThirdSlide,
    duration: 6000,
    spotify: "spotify:track:14zDy9P7qf0oBDOtHMNoKV",
  },
];
