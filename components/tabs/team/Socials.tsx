import { Social } from "@/components/Social";
import { IconType } from "react-icons";
import {
  FaEnvelope,
  FaFacebook,
  FaGithub,
  FaGitlab,
  FaInstagram,
  FaTiktok,
  FaTwitch,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

type SocialMapping = {
  [key: string]: { icon: IconType; className: string };
};

const socialMapping: SocialMapping = {
  "support email": { icon: FaEnvelope, className: "text-white" },
  instagram: { icon: FaInstagram, className: "text-pink-400" },
  facebook: { icon: FaFacebook, className: "text-blue-500" },
  twitter: { icon: FaTwitter, className: "text-sky-400" },
  github: { icon: FaGithub, className: "text-white" },
  gitlab: { icon: FaGitlab, className: "text-orange-400" },
  youtube: { icon: FaYoutube, className: "text-red-500" },
  tiktok: { icon: FaTiktok, className: "text-pink-500" },
  twitch: { icon: FaTwitch, className: "text-indigo-400" },
};

export const Socials = (props: any) => {
  const sortedSocials = props.socials
    .map((social: any) => ({
      ...social,
      order: Object.keys(socialMapping).indexOf(social.type),
    }))
    .sort((a: any, b: any) => a.order - b.order);

  return sortedSocials.map((social: any, key: number) => {
    const socialType = socialMapping[social.type];
    if (!socialType) return null;

    const { icon: Icon, className } = socialType;

    return (
      <a
        key={key}
        href={
          social.type === "support email"
            ? `mailto:${social.handle}`
            : `https://${social.type}.com/${social.handle}`
        }
        rel="noopener noreferrer"
        target="_blank"
      >
        <Social icon={Icon} name={social.handle} className={className} />
      </a>
    );
  });
};
