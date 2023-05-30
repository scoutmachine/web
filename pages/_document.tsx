import { Head, Html, Main, NextScript } from "next/document";
import { JSX } from "react";

export default function Document(): JSX.Element {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Smarter FRC data insights" />
        <meta
          name="keywords"
          content="frc,robotics,scoutmachine,firstrobticscompetition,FIRST Robotics,FIRST Robotics Competition,robotics,first,firstrobotics,competition,team,regionals,matches,videos"
        />
        <meta name="og:title" content="Scout Machine" />
        <meta name="og:description" content="Smarter FRC data insights" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Scout Machine" />
        <meta name="twitter:description" content="Smarter FRC data insights" />
        <meta name="twitter:image" content="/ScoutMachineBanner.png" />
        <meta name="og:image" content="/ScoutMachineBanner.png" />
        <meta name="theme-color" content="#FBBB04" />
        <link rel="shortcut icon" href="/smLogo.png" />

        <meta name="application-name" content="Scout Machine" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Scout Machine" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/smLogo180.png" />
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
      </Head>

      <body className="bg-[#f7f7f7] dark:bg-[#141414]">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
