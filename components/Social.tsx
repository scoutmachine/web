import { IconType } from "react-icons";

export const Social = (props: {
  className: string;
  name: string;
  icon?: IconType;
}) => {
  return (
    <p className={`flex ${props.className} hover:text-primary`}>
      {props.icon && <props.icon className="text-2xl mr-1" />}
      {props.name}
    </p>
  );
};
