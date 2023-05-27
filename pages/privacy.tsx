import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Navbar } from "@/components/navbar";
import { JSX } from "react";
import { Card } from "@/components/misc/Card";

export default function PrivacyPage(): JSX.Element {
  return (
    <>
      <Navbar />
      <Header title="Privacy Policy" desc="Scout Machine Privacy Policy" />
      <div className="pl-4 pr-4 md:pl-8 md:pr-8 max-w-screen-3xl">
        <Card>
          <h1 className="text-lightGray">Updated: May 17, 2023</h1>
          <br />

          <h1 className="text-white font-bold text-2xl">
            What information Scout Machine collects and why
          </h1>

          <p className="text-lightGray">
            Information from your web browser that most websites collect such as
            IP for rough region, browser type, and operating system. We use this
            information to help us understand how people use our website, and to
            help us improve our website. We rely upon Vercel&apos;s website
            analytics to collect this information.
          </p>

          <br />

          <h2 className="text-white font-bold text-2xl">
            Information from users with accounts
          </h2>
          <p className="text-lightGray">
            We use Google sign-in & GitHub sign-in to authenticate users. Only
            the email address is stored in our database, your password and
            personal information is stored on Google or GitHub&apos;s servers.
            We use the email address to identify users and allow for users to
            request contact within in the marketplace for listings you may
            create, and to reach users in the event of an issue with their
            account or a security breach. We do not share your email address
            with outside parties.
          </p>

          <br />

          <h1 className="text-white font-bold text-2xl">
            What information Scout Machine does not collect
          </h1>
          <p className="text-lightGray">
            We do not intentionally collect sensitive personal information, such
            as address of residency, health information, address of site access,
            & we do not save geolocation data users may choose to give in the
            events or marketplace search functions. The only information we
            collect is what you directly give to us, email address, username,
            team number. Users under the age of 13 are not allowed to create
            accounts, and we do not knowingly collect information from users
            under the age of 13. If you are a parent or guardian, and you are
            aware that your child has provided us with personal information,
            please contact us so that we will be able to take the necessary
            steps to wipe that information from our servers.
          </p>

          <br />

          <h1 className="text-white font-bold text-2xl">
            How do we share the information we collect
          </h1>
          <p className="text-lightGray">
            We do not share, sell, or rent your personal information to third
            parties for any purpose.
          </p>

          <br />

          <h1 className="text-white font-bold text-2xl">
            Our use of cookies and tracking
          </h1>
          <p className="text-lightGray">
            Our site currently relies wholly upon Vercel&apos;s website
            analytics, and does not use any other cookies or tracking outside
            what Vercel uses, Vercel&apos;s website analytics can be found at
            https://vercel.com/docs/concepts/analytics/privacy-policy).
          </p>

          <br />

          <h1 className="text-white font-bold text-2xl">
            In the event of change
          </h1>
          <p className="text-lightGray">
            We will update this policy both on GitHub and on our website, and
            will notify users of any changes to this policy.
          </p>

          <br />

          <h1 className="text-white font-bold text-2xl">License</h1>
          <p className="text-lightGray">
            This Privacy Policy is adapted from GitHub&apos;s Privacy Statement
            at
            https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement)
            and is licensed under the Creative Commons Attribution available at
            https://creativecommons.org/licenses/by/4.0/) license. You may use
            it freely under the terms of the Creative Commons license.
          </p>

          <br />
          <h1 className="text-white font-bold text-2xl">Contact us</h1>
          <p className="text-lightGray">
            If you have any questions about this Privacy Policy, please contact
            us on the Scout Machine GitHub Repository at
            https://github.com/scoutmachine/web or reach out to us on the Scout
            Machine Discord at https://discord.com/invite/yYtc8gpsXK
          </p>
        </Card>
      </div>
      <Footer />
    </>
  );
}
