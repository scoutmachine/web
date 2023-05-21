import { Social } from "@/components/Social";
import { Socials as socials } from "@/lib/lists/socials";
import { JSX } from "react";
import { IconType } from "react-icons";

export const Socials = (props: any) => {
  const sortedSocials = props.socials
    .map((social: any) => ({
      ...social,
      order: socials.findIndex(
        (
          item:
            | {
                name: string;
                icon: IconType;
                className: string;
                url?: undefined;
              }
            | { name: string; icon: IconType; className: string; url: string }
        ): boolean => item.name.toLowerCase() === social.type
      ),
    }))
    .sort((a: any, b: any) => a.order - b.order);

  return sortedSocials.map((social: any, key: number): null | JSX.Element => {
    const socialType:
      | { name: string; icon: IconType; className: string; url?: undefined }
      | { name: string; icon: IconType; className: string; url: string }
      | undefined = socials.find(
      (item: { name: string; icon: IconType }): boolean =>
        item.name.toLowerCase() === social.type
    );
    if (!socialType) return null;

    const { icon: Icon, className, url } = socialType;

    return (
      <a
        key={key}
        href={
          social.type === "support email"
            ? `mailto:${social.handle}`
            : url
            ? `${url}${social.handle}`
            : `https://${social.type.toLowerCase()}.com/${social.handle}`
        }
        rel="noopener noreferrer"
        target="_blank"
      >
        <Social icon={Icon} name={social.handle} className={className} />
      </a>
    );
  });
};
