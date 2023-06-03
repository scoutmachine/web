import Head from "next/head";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
}

export const SEO = (props: SEOProps) => (
  <Head>
    <meta
      name="description"
      content={props.description ?? "Smarter FRC data insights"}
    />
    <meta
      name="keywords"
      content="frc,robotics,scoutmachine,scout machine,firstrobticscompetition,FIRST Robotics,FIRST Robotics Competition,robotics,first,firstrobotics,competition,team,regionals,matches,videos"
    />
    <meta
      name="og:description"
      content={props.description ?? "Smarter FRC data insights"}
    />
    <meta name="og:title" content={props.title ?? "Scout Machine"} />
    <meta name="twitter:title" content={props.title ?? "Scout Machine"} />
    <meta
      name="twitter:image"
      content={props.image ?? "/ScoutMachineBanner.png"}
    />
    <meta name="og:image" content={props.image ?? "/ScoutMachineBanner.png"} />
    <meta name="twitter:card" content="summary_large_image" />
    <title>{props.title ?? "Scout Machine"}</title>
    <meta
      name="twitter:description"
      content={props.description ?? "Smarter FRC data insights"}
    />
    <meta name="theme-color" content="#FBBB04" />
    <link rel="shortcut icon" href="/smLogo.png" />

    <meta name="application-name" content="Scout Machine" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Scout Machine" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" sizes="180x180" href="/smLogo180.png" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="mobile-web-app-capable" content="yes" />
  </Head>
);
