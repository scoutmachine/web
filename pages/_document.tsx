import { Head, Html, Main, NextScript } from "next/document";
import { JSX } from "react";

export default function Document(): JSX.Element {
  return (
    <Html lang="en">
      <Head />

      <body className="bg-[#f7f7f7] dark:bg-[#141414]">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
