import EventEmitter from "events";
import SpotifyFramePlayer from "./spotify/FramePlayer";
import { SLIDES, Slide } from "./slides";

export default class WrappedPlayer extends EventEmitter {
  public currentSlide: Slide | null = null;

  constructor(public spotifyPlayer: SpotifyFramePlayer | null = null) {
    super();
  }

  public async play(): Promise<void> {
    for (let i = 0; i < SLIDES.length; i++) {
      const slide = SLIDES[i];
      this.currentSlide = slide;

      if (this.currentSlide.spotify && this.spotifyPlayer) {
        await this.spotifyPlayer.playSong(this.currentSlide.spotify);
      }

      this.emit("update");
      await this.wait(slide.duration);
    }
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
