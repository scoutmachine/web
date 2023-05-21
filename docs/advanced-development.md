# Advanced Development

## 1: Filling out the .env file

The .env file is used to store sensitive information such as API keys and database credentials. The .env file is not
included in the repository for security reasons. You will need to create your own .env file in the root directory of the
project. The .env file can copy the .env.example file in the root of the project and should contain the following
information:

```dotenv
# Required
BLUE_ALLIANCE_API_KEY="key"
FIRST_API_KEY="key"

# Optional
DATABASE_URL=http://
NEXT_PUBLIC_SECRET="key"
NEXTAUTH_URL=http://localhost:3000/api/auth
GOOGLE_CLIENT_ID="key"
GOOGLE_CLIENT_SECRET="key"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="key"
GITHUB_CLIENT_ID="key"
GITHUB_CLIENT_SECRET="key"
```

It is your responsibility to fill out the .env file with the correct information. The following sections will explain
where to acquire the necessary API keys and how to set up the database.

### 1.1: The Blue Alliance API Key

The Blue Alliance API key is used to access the Blue Alliance API. You can get a Blue Alliance API key by creating an
account on [The Blue Alliance](https://www.thebluealliance.com/). Once you have created an account, you can find your
API key on at [thebluealliance.com](https://www.thebluealliance.com/account)

### 1.2: FRC Events API Key

The FRC Events API key is used to access the FRC Events read only API. You can get an FRC Events API key by creating an
account on [frc-events.firstinspires.org](https://frc-events.firstinspires.org/services/API). Once you have created an
account, you need to request an API key from
[frc-events.firstinspires.org](https://frc-events.firstinspires.org/services/API). and confirm your email address. Once
you have confirmed your email address, you will be sent an API key within 24 hours.

### 1.3: Google Maps API Key

The Google Maps API key is used to access the Google Maps API. You can get a Google Maps API key by creating a project
on [Google Cloud Platform](https://console.cloud.google.com/). Once you have created a project, you can find your API
key on the [Google Cloud Platform](https://console.cloud.google.com/) dashboard. You will also need to enable the
following maps API and sign up for a billing account.

### 1.4: Google OAuth

The Google OAuth credentials are used to allow users to sign in with Google. You can get Google OAuth credentials by
creating a Google OAuth app on [Google Cloud Platform](https://console.cloud.google.com/). Once you have created a
Google OAuth app, you can find your client ID and client secret on the
[Google Cloud Platform](https://console.cloud.google.com/) dashboard.

### 1.5: GitHub OAuth

The GitHub OAuth credentials are used to allow users to sign in with GitHub. You can get GitHub OAuth credentials by
creating a GitHub OAuth app on [GitHub](https://github.com) under your account settings navigate to developer settings
and click on OAuth Apps. Once you have created a GitHub OAuth app, you can find your client ID and client secret on the
OAuth Apps page.

### 1.6: NextAuth URL

The NextAuth URL is used to redirect users to the correct URL after signing in. The NextAuth URL should be in the
following format:

```text
http://localhost:3000/api/auth
```

But may be changed if you are running a production build.

### 1.7: Database URL

The database URL is used to connect to the database. You can get a database URL by creating a database on
[PostgreSQL](https://www.postgresql.org/). Once you have created a database, you can find your database URL on the
database dashboard. The database URL should be in the following format:

```text
postgres://username:password@host:port/database
```

**Note**: Be sure to run the `npx prisma db push` command afterward, to synchronize your Prisma schema with your database schema.

## 2: GitHub Actions

GitHub Actions are used to automate the build and deployment process. The GitHub Actions are located in the
[.github/workflows](./.github/workflows) directory. The GitHub Actions are configured to run on every push to the main
branch. The GitHub Actions are configured to run the following jobs:

- Linting the code for formatting issues including Markdown files
- Running security checks and reporting any vulnerabilities

## 3: Security Vulnerabilities

### 3.1: Discovering Simple Vulnerabilities

GitHub Actions are used to run security checks on the code. The security checks are run on every push to the main
and generate a report of any vulnerabilities. The security checks are run using the following GitHub Action:
[codeql.yml](./.github/workflows/codeql.yml)

### 3.2: Dependabot Package Vulnerabilities

Dependencies are checked for vulnerabilities using dependabot. Dependabot is configured to check for vulnerabilities in
packages used by the project and generate a report of any vulnerabilities. Dependabot is configured to check for
vulnerabilities every 24 hours and will generate a PR to bump the version of any packages with vulnerabilities.

### 3.3: Reporting Vulnerabilities

Vulnerabilities are also reported by users through GitHub issues. If you find a vulnerability, please
[create a security report](../../../issues/new/choose) or join the
[Scout Machine discord](https://discord.com/invite/yYtc8gpsXK) and privately message a developer. Please do not openly
post a security vulnerability as this may put other users at risk. You can expect a response within 24 hours of
reporting a security vulnerability, and it will be made a top priority to fix the vulnerability as soon as possible.
