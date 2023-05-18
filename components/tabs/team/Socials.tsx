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
      case "facebook":
        return (
          <a
            key={key}
            href={`https://facebook.com/${social.handle}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Social
              icon={FaFacebook}
              name={social.handle}
              className="text-blue-500"
            />
          </a>
        );
      case "github":
        return (
          <a
            key={key}
            href={`https://github.com/${social.handle}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Social
              icon={FaGithub}
              name={social.handle}
              className="text-white"
            />
          </a>
        );
      case "instagram":
        return (
          <a
            key={key}
            href={`https://instagram.com/${social.handle}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Social
              icon={FaInstagram}
              name={social.handle}
              className="text-pink-400"
            />
          </a>
        );
      case "twitter":
        return (
          <a
            key={key}
            href={`https://twitter.com/${social.handle}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Social
              icon={FaTwitter}
              name={social.handle}
              className="text-sky-400"
            />
          </a>
        );
      case "youtube":
        return (
          <a
            key={key}
            href={`https://youtube.com/${social.handle}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Social
              icon={FaYoutube}
              name={social.handle}
              className="text-red-500"
            />
          </a>
        );
      default:
        return null;
    }
  });
};
