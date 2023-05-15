import { Social } from "@/components/Social";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

export const Socials = (props: any) => {
  return props.socials.map((social: any, key: number) => {
    switch (social.type) {
      case "facebook-profile":
        return (
          <a
            key={key}
            href={`https://facebook.com/${social.foreign_key}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Social
              icon={FaFacebook}
              name={social.foreign_key}
              className="text-blue-500"
            />
          </a>
        );
      case "github-profile":
        return (
          <a
            key={key}
            href={`https://github.com/${social.foreign_key}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Social
              icon={FaGithub}
              name={social.foreign_key}
              className="text-white"
            />
          </a>
        );
      case "instagram-profile":
        return (
          <a
            key={key}
            href={`https://instagram.com/${social.foreign_key}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Social
              icon={FaInstagram}
              name={social.foreign_key}
              className="text-pink-400"
            />
          </a>
        );
      case "twitter-profile":
        return (
          <a
            key={key}
            href={`https://twitter.com/${social.foreign_key}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Social
              icon={FaTwitter}
              name={social.foreign_key}
              className="text-sky-400"
            />
          </a>
        );
      case "youtube-channel":
        return (
          <a
            key={key}
            href={`https://youtube.com/${social.foreign_key}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Social
              icon={FaYoutube}
              name={social.foreign_key}
              className="text-red-500"
            />
          </a>
        );
      default:
        return null;
    }
  });
};
