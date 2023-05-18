import { Social } from "@/components/Social";
import { Socials as socials } from "@/lib/lists/socials";

export const Socials = (props: any) => {
  const sortedSocials = props.socials
    .map((social: any) => ({
      ...social,
      order: socials.findIndex(
        (item) => item.name.toLowerCase() === social.type
      ),
    }))
    .sort((a: any, b: any) => a.order - b.order);

  return sortedSocials.map((social: any, key: number) => {
    const socialType = socials.find(
      (item) => item.name.toLowerCase() === social.type
    );
    if (!socialType) return null;

    const { icon: Icon, className } = socialType;

    return (
      <a
        key={key}
        href={
          social.type === "Support Email"
            ? `mailto:${social.handle}`
            : `https://${social.type.toLowerCase()}.com/${social.handle}`
        }
        rel="noopener noreferrer"
        target="_blank"
      >
        <Social
          icon={Icon}
          name={social.handle}
          className={`text-${className}`}
        />
      </a>
    );
  });
};
