import Link from "next/link";

export const Header = (props: any) => {
  return (
    <>
      <Link href="/" legacyBehavior>
        <a>
          <h1 className="text-center text-primary hover:text-white md:text-5xl text-3xl font-black mt-16 mb-2">
            {props.title ?? '6070 presents: Scouting Machine'}
          </h1>
        </a>
      </Link>
      <p className="text-gray-400 text-center">
        The all-in-one tool your FRC team needs to find the data you want, whenever you want.
      </p>
    </>
  );
};
