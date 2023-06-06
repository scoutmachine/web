import EventEmitter from "events";

export default class SpotifyFramePlayer extends EventEmitter {
  public embedController: EmbedController | null = null;
  public canPlaySongs = false;

  private currentIFrame: HTMLIFrameElement | null = null;
  private previousIFrame: HTMLIFrameElement | null = null;

  public loadLibrary(): Promise<void> {
    return new Promise<void>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://open.spotify.com/embed-podcast/iframe-api/v1";
      script.async = true;
      document.body.appendChild(script);

      const timeout = setTimeout(() => {
        resolve();
      }, 7000);

      window.onSpotifyIframeApiReady = (IFrameAPI: SpotifyIframeApi) => {
        const element = document.getElementById("spotify")!;
        const options = {
          uri: "spotify:track:0RiRZpuVRbi7oqRdSMwhQY",
          width: 300,
          height: 80,
          theme: "dark",
        };

        IFrameAPI.createController(element, options, (EmbedController) => {
          this.embedController = EmbedController;

          const enablePlayback = () => {
            if (this.canPlaySongs) return;

            this.canPlaySongs = true;
            this.embedController!.removeListener("ready", enablePlayback);
            this.emit("ready");

            clearTimeout(timeout);
            resolve();
          };

          const defaultIframe = document
            .getElementById("spotify-wrapper")
            ?.querySelector("iframe");

          if (defaultIframe) {
            defaultIframe.style.opacity = "0";
            defaultIframe.style.position = "absolute";
            defaultIframe.style.top = "-1000px";
          }

          this.embedController!.addListener("ready", enablePlayback);
        });
      };
    });
  }

  public playSong(uri: string): Promise<void> {
    return new Promise<void>(async (resolve) => {
      if (!this.canPlaySongs) return resolve();
      if (!this.embedController) return resolve();

      const playTimeout = setTimeout(() => {
        this.canPlaySongs = false;
        resolve();
      }, 6000);

      const container = document.getElementById("spotify-wrapper");
      this.previousIFrame = this.currentIFrame;
      const frameElement = document.createElement("div");

      if (container?.firstChild) {
        container!.insertBefore(frameElement, container.firstChild);
      } else {
        container!.appendChild(frameElement);
      }

      const oembed = await fetch(`https://open.spotify.com/oembed?url=${uri}`)
        .then((response) => response.json())
        .catch(() => {
          return {
            html: "",
          };
        });

      if (!oembed.html) {
        this.destroyPreviousIFrame();
        resolve();
        return;
      }

      oembed.html = oembed.html.replace("encrypted-media; ", "");
      frameElement.innerHTML = oembed.html;

      this.setupNewIframe(frameElement);

      await this.waitForIframe();

      this.embedController.loadUri(uri);
      this.embedController.resume();

      setTimeout(() => this.destroyPreviousIFrame(), 1000);
      await this.waitForSpotify();

      this.currentIFrame!.style.opacity = "1";
      clearTimeout(playTimeout);
      resolve();
    });
  }

  private setupNewIframe(frameElement: HTMLDivElement): void {
    const iframe = frameElement.querySelector("iframe")!;
    this.embedController!.iframeElement = iframe;
    this.currentIFrame = iframe;
    this.currentIFrame!.style.opacity = "0";
    this.currentIFrame!.setAttribute("width", "300");
    this.currentIFrame!.setAttribute("height", "80");
  }

  private waitForIframe(): Promise<void> {
    return new Promise<void>((resolve) => {
      const checkIfReady = (e: MessageEvent) => {
        if (
          e.source === this.currentIFrame?.contentWindow &&
          e.data.type === "ready"
        ) {
          window.removeEventListener("message", checkIfReady);
          resolve();
        }
      };

      window.addEventListener("message", checkIfReady);
    });
  }

  private destroyPreviousIFrame(): void {
    if (this.previousIFrame) {
      this.previousIFrame.remove();
      this.previousIFrame = null;
    }
  }

  private waitForSpotify(): Promise<void> {
    return new Promise<void>((resolve) => {
      let hasResolved = false;

      const checkIfReady = (state: {
        data: {
          isBuffering: boolean;
          duration: number;
          position: number;
        };
      }) => {
        if (hasResolved) {
          return;
        }

        if (
          !state.data.isBuffering &&
          state.data.duration > 0 &&
          state.data.position > 0
        ) {
          this.embedController?.removeListener("playback_update", checkIfReady);
          hasResolved = true;
          resolve();
        }
      };

      this.embedController?.addListener("playback_update", checkIfReady);
    });
  }

  public async pause(): Promise<void> {
    if (!this.canPlaySongs) return;
    if (!this.embedController) return;

    this.embedController.pause();
  }
}
