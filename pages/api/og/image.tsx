import { ImageResponse } from "next/server";
import { API_URL } from "@/lib/constants";

export const config = {
  runtime: "edge",
};

const InterFont = fetch(
  new URL("/public/fonts/Inter-Bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const team = url.searchParams.get("team");
  const mode = url.searchParams.get("mode");

  const { teamData, avatar } = await fetch(
    `${API_URL}/api/og/team?team=${team}`
  ).then((res) => res.json());

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: mode === "light" ? "#FFFFFF" : "#141414",
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
                tw={`text-7xl ${
                  mode === "light" ? "text-black" : "text-white"
                }`}
              >
                {teamData.nickname}
              </span>
            </h2>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Typewriter",
          data: await InterFont,
          style: "normal",
        },
      ],
    }
  );
}
