export const dev: boolean = process.env.NODE_ENV !== "production";

export const CURR_YEAR: number = 2023;

export const API_URL: string = dev
    ? "http://localhost:3000"
    : "https://machine.frc6070.ca";

export const GITHUB_URL: string = "https://www.github.com/scoutmachine/web";
export const BMAC_URL: string = "https://www.buymeacoffee.com/scoutmachine";
export const DISCORD_URL: string = "https://discord.com/invite/yYtc8gpsXK";
