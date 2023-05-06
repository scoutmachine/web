import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Navbar } from "@/components/navbar";
import { TwitchEmbed } from "@/components/TwitchEmbed";

const channels = [
  {
    official: [
      "FIRSTinspires",
      "FIRSTinspires1",
      "FIRSTinspires2",
      "FIRSTinspires3",
      "FIRSTinspires_Edison",
      "FIRSTinspires_Galileo",
      "FIRSTinspires_Newton",
      "FIRSTinspires_Daly",
      "FIRSTinspires13",
      "FIRSTinspires12",
      "FIRSTinspires11",
      "FIRSTinspires14",
      "FIRSTinspires9",
      "FIRSTinspires8",
      "FIRSTinspires7",
      "FIRSTinspires6",
      "FIRSTinspires5",
      "FIRSTinspires15",
      "FIRSTinspires16",
      "FIRSTinspires17",
      "FIRSTinspires18",
      "FIRSTinspires19",
      "FIRSTinspires20",
      "FIRSTinspires10",
      "FIRSTinspires21",
      "FIRSTinspires24",
      "FIRSTOntario2",
      "FIRSTOntario1",
      "FIRSTOntario3",
      "FIRSTOntario4",
      "FIRSTOntario5",
      "FIRSTOntario6",
      "FIRSTCanada",
    ],
    special: ["firstupdatesnow", "robosportsnetwork"],
  },
];

export default function GameDayPage() {
  return (
    <>
      <Navbar active="Game Day" />
      <Header
        title="Game Day"
        desc="Watch all your favourite teams compete for the trophy - in one place."
      />

      <div className="pl-4 pr-4 md:pl-8 md:pr-8 max-w-screen-3xl w-full">
        <h1 className="mt-10 mb-5 font-extrabold text-2xl">
          Official Event Streams
        </h1>
        <div className="flex flex-col md:grid sm:grid sm:grid-cols-2 md:grid-cols-5 gap-5">
          {channels[0].official.map((channel: string, key: number) => {
            return <TwitchEmbed key={key} channel={channel} />;
          })}
        </div>

        <h1 className="mt-10 mb-5 font-extrabold text-2xl">
          Special Event Streams
        </h1>
        <div className="flex gap-5">
          {channels[0].special.map((channel: string, key: number) => {
            return <TwitchEmbed key={key} channel={channel} />;
          })}
        </div>
      </div>

      <Footer />
    </>
  );
}
