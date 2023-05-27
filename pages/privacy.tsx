import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Navbar } from "@/components/navbar";
import { JSX } from "react";
import { Card } from "@/components/misc/Card";

export default function PrivacyPage(): JSX.Element {
  return (
    <>
      <Navbar />
      <Header
        title="Privacy Policy"
        desc="Current Scout Machine Privacy Policy"
      />
      <Card>
        <h1>Updated: May 17, 2023</h1>

        <h1>What information Scout Machine collects and why</h1>

        <p>
          Information from your web browser that most websites collect such as
          IP for rough region, browser type, and operating system. We use this
          information to help us understand how people use our website, and to
          help us improve our website. We rely upon Vercel&aposs website
          analytics to collect this information.
        </p>

        <h2>Information from users with accounts</h2>
        <p>
          We use Google sign-in & GitHub sign-in to authenticate users. Only the
          email address is stored in our database, your password and personal
          information is stored on Google or GitHub&aposs servers. We use the
          email address to identify users and allow for users to request contact
          within in the marketplace for listings you may create, and to reach
          users in the event of an issue with their account or a security
          breach. We do not share your email address with outside parties.
        </p>
        <h1>What information Scout Machine does not collect</h1>
        <p>
          We do not intentionally collect sensitive personal information, such
          as address of residency, health information, address of site access, &
          we do not save geolocation data users may choose to give in the events
          or marketplace search functions. The only information we collect is
          what you directly give to us, email address, username, team number.
          Users under the age of 13 are not allowed to create accounts, and we
          do not knowingly collect information from users under the age of 13.
          If you are a parent or guardian, and you are aware that your child has
          provided us with personal information, please contact us so that we
          will be able to take the necessary steps to wipe that information from
          our servers.
        </p>
        <h1>How do we share the information we collect</h1>
        <p>
          We do not share, sell, or rent your personal information to third
          parties for any purpose.
        </p>

        <h1>Our use of cookies and tracking</h1>
        <p>
          Our site currently relies wholly upon Vercel&aposs website analytics,
          and does not use any other cookies or tracking outside what Vercel
          uses, Vercel&aposs website analytics can be found at
          https://vercel.com/docs/concepts/analytics/privacy-policy).
        </p>
        <h1>In the event of change</h1>
        <p>
          We will update this policy both on GitHub and on our website, and will
          notify users of any changes to this policy.
        </p>
        <h1>License</h1>
        <p>
          This Privacy Policy is adapted from GitHub&aposs Privacy Statement at
          https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement)
          and is licensed under the Creative Commons Attribution available at
          https://creativecommons.org/licenses/by/4.0/) license. You may use it
          freely under the terms of the Creative Commons license.
        </p>

        <h1>Contact us</h1>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          on the Scout Machine GitHub Repository at
          https://github.com/scoutmachine/web or reach out to us on the Scout
          Machine Discord at https://discord.com/invite/yYtc8gpsXK
        </p>
      </Card>
      <Footer />
    </>
  );
}
