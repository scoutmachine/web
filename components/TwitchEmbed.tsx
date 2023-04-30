import { dev } from "@/lib/constants";
import React from "react";

interface Props {
  channel: string;
}

export const TwitchEmbed = (props: Props) => {
  return (
    <iframe
      src={`https://player.twitch.tv/?channel=${props.channel}&parent=${dev ? 'localhost' : 'machine.frc6070.ca'}&muted=true`}
      className="rounded-lg border dark:border-[#2A2A2A] dark:bg-card hover:border-gray-600 px-2 py-3 md:h-[250px] md:w-[415px]"
    ></iframe>
  );
};
