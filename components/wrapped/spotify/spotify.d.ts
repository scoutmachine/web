interface EmbedController {
  loadUri(uri: string): void;
  play(): void;
  playFromStart(): void;
  togglePlay(): void;
  pause(): void;
  resume(): void;
  seek(seconds: number): void;
  destroy(): void;

  addListener(event: string, callback: (state: any) => void): void;
  once(event: string, callback: () => void): void;
  removeListener(event: string, callback: (state: any) => void): void;

  iframeElement: HTMLIFrameElement;
}

interface SpotifyIframeApi {
  createController(
    element: HTMLElement,
    options: { uri: string; width?: number; height?: number },
    callback: (embedController: EmbedController) => void
  ): void;
}

interface Window {
  onSpotifyIframeApiReady: (iframeAPI: SpotifyIframeApi) => void;
}
