import React, { useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Loader2 } from "lucide-react";
import WrappedPlayer from "./WrappedPlayer";
import { WrappedContainer } from "./WrappedContainer";
import SpotifyFramePlayer from "./spotify/FramePlayer";

type WrappedPlayerComponentProps = {
  spotify: SpotifyFramePlayer | null;
  team: any;
};

const LoadingPlayerComponent: React.FC = () => (
  <WrappedContainer>
    <Loader2 size={32} className="animate-spin" />
  </WrappedContainer>
);

const WrappedPlayerComponent: React.FC<WrappedPlayerComponentProps> = ({
  spotify,
  ...props
}) => {
  const [player] = useState<WrappedPlayer>(() => new WrappedPlayer(spotify));
  const [, setForceUpdate] = useState<number>(0);

  useEffect(() => {
    const forceUpdateHandler = () => setForceUpdate((prev) => prev + 1);

    player.on("update", forceUpdateHandler);
    player.play();

    return () => {
      player.off("update", forceUpdateHandler);
    };
  }, [player]);

  useEffect(() => {
    player.spotifyPlayer = spotify;
  }, [player, spotify]);

  const Component = player.currentSlide?.component || LoadingPlayerComponent;

  return (
    <TransitionGroup>
      <CSSTransition
        key={player.currentSlide?.name || "none"}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <Component {...props} {...props.team} />
      </CSSTransition>
    </TransitionGroup>
  );
};

export default WrappedPlayerComponent;
