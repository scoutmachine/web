import {
  FaDiscord,
  FaEnvelope,
  FaFacebook,
  FaGithub,
  FaGitlab,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaTiktok,
  FaTwitch,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { IconType } from "react-icons";

export const Socials: (
  | { name: string; icon: IconType; className: string; url?: undefined }
  | { name: string; icon: IconType; className: string; url: string }
)[] = [
  {
    name: "Support Email",
    icon: FaEnvelope,
    className: "text-black dark:text-white",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    className: "text-pink-400",
  },
  {
    name: "Facebook",
    icon: FaFacebook,
    className: "text-blue-400",
  },
  {
    name: "Twitter",
    icon: FaTwitter,
    className: "text-sky-400",
  },
  {
    name: "Linkedin",
    icon: FaLinkedin,
    className: "text-blue-500",
  },
  {
    name: "GitHub",
    icon: FaGithub,
    className: "text-black dark:text-white",
  },
  {
    name: "Gitlab",
    icon: FaGitlab,
    className: "text-orange-400",
  },
  {
    name: "YouTube",
    icon: FaYoutube,
    className: "text-red-500",
    url: "https://youtube.com/@",
  },
  {
    name: "Discord",
    icon: FaDiscord,
    className: "text-violet-400",
    url: "https://discord.gg/",
  },
  {
    name: "Twitch",
    icon: FaTwitch,
    className: "text-indigo-400",
  },
  {
    name: "Tiktok",
    icon: FaTiktok,
    className: "text-pink-500",
    url: "https://tiktok.com/@",
  },
  {
    name: "Pinterest",
    icon: FaPinterest,
    className: "text-red-400",
  },
];
