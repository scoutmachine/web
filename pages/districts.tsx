import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Loading } from "@/components/Loading";
import { Navbar } from "@/components/navbar";
import { API_URL, CURR_YEAR } from "@/lib/constants";
import {getStorage, setStorage} from "@/utils/localStorage";
import {JSX, useEffect, useState} from "react";

async function fetchDistrictsData(): Promise<any> {
    const districts = getStorage(`districts_${CURR_YEAR}`);
    if (districts) return districts;

    const fetchDistricts = await fetch(`${API_URL}/api/districts`).then((res: Response) =>
        res.json()
    );

    setStorage(`districts_${CURR_YEAR}`, fetchDistricts);
    return fetchDistricts;
}

export default function DistrictsPage(): JSX.Element {
    const [districts, setDistricts] = useState<any>();

    useEffect((): void => {
        const fetchData = async (): Promise<void> => {
            const data = await fetchDistrictsData();
            setDistricts(data.districts);
        };

        fetchData();
    }, []);

    if (!districts) return <Loading/>;

    return (
    <>
      <Navbar />
      <Header title="Districts" desc={`${CURR_YEAR} Season Districts`} />

      <div className="pr-4 pl-4 md:pr-8 md:pl-8 max-w-screen-3xl w-full">
        <div className="mt-5 grid grid-cols-2 gap-3">
          {districts.map((district: any, key: number) => {
            return (
              <a
                key={key}
                href={`https://frc-events.firstinspires.org/2023/district/${district.code}`}
                rel="noopener noreferrer"
                target="_blank"
                className="w-full"
              >
                <div className="border border-[#2A2A2A] bg-card hover:border-gray-600 rounded-lg px-5 py-5">
                  <h1 className="font-bold text-2xl">
                    {district.name} District
                  </h1>
                  <p className="text-lightGray">{district.code}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <Footer />
    </>
  );
}
