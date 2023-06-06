import { ImageResponse } from "next/server";
import { API_URL } from "@/lib/constants";

export const runtime: string = "edge";

const interBlack: Promise<ArrayBuffer> = fetch(
  new URL("/public/fonts/Inter-Black.ttf", import.meta.url)
).then((res: Response) => res.arrayBuffer());

export default async function handler(
  request: Request
): Promise<ImageResponse> {
  const url: URL = new URL(request.url);
  const team: string | null = url.searchParams.get("team");
  const mode: string | null = url.searchParams.get("mode");

  const { teamData, avatar } = await fetch(
    `${API_URL}/api/og/team?team=${team}`
  ).then((res: Response) => res.json());

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: mode === "light" ? "#FFF" : "#000",
          fontFamily: "Inter",
        }}
        tw="relative"
      >
        {/*  eslint-disable-next-line @next/next/no-img-element*/}
        <img
          src={`${API_URL}/api/og/smLogo`}
          tw="absolute top-5 left-15"
          height="75"
          width="75"
          alt="Scout Machine Logo"
        />
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div tw="flex relative">
            <div tw="flex flex-col md:flex-row w-full py-12 px-16 md:items-center justify-between">
              <h2 tw="flex flex-col font-bold tracking-tight text-gray-900 text-left">
                <div tw="flex">
                  {/*  eslint-disable-next-line @next/next/no-img-element*/}
                  <img
                    src={
                      avatar
                        ? `${API_URL}/api/og/avatar?team=${team}`
                        : `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${
                            teamData.website?.startsWith("https")
                              ? teamData.website
                              : `https://${teamData.website?.slice(7)}`
                          }/&size=64`
                    }
                    tw="mr-5"
                    alt="Scout Machine Logo"
                    height="40"
                    width="40"
                  />
                  <span tw="text-5xl text-[#a6a6a6] mb-2">
                    {teamData.team_number}
                  </span>
                </div>
                <span
                  tw={`text-8xl ${
                    mode === "light" ? "text-black" : "text-white"
                  }`}
                >
                  {teamData.nickname}
                </span>
                <span tw="text-[#a6a6a6] mt-3 text-2xl">
                  {teamData.city}, {teamData.state_prov}, {teamData.country}
                </span>
              </h2>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: await interBlack,
          weight: 900,
          style: "normal",
        },
      ],
    }
  );
}
