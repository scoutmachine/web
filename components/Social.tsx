export const Social = (props: any) => {
    return (
      <p className={`flex ${props.className} hover:text-primary`}>
        <props.icon className="text-2xl mr-1" /> {props.name}
      </p>
    );
  };