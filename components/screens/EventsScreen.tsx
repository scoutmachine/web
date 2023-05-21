import { CURR_YEAR } from "@/lib/constants";
import { convertDate } from "@/utils/date";
import Link from "next/link";
import { Search } from "../Search";
import React, { JSX, ReactNode, useEffect, useRef, useState } from "react";
import haversine from "haversine-distance";
import { GeoData } from "@/utils/geo";
import {
  FaArrowUp,
  FaCrosshairs,
  FaFileCsv,
  FaGlobe,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { getGeoData } from "@/utils/geo";
import exportFromJSON from "export-from-json";
import { getStorage } from "@/utils/localStorage";
import { Loading } from "../Loading";

const Event = (props: any) => {
  return (
    <Link href={`/events/${props.event.key}`} legacyBehavior>
      <a>
        <div
          className={`hover:cursor-pointer border border-[#2A2A2A] bg-card hover:border-gray-600 px-5 py-5 h-40 rounded-lg relative w-full`}
        >
          <h1 className="text-xl font-bold text-left text-white">
            {props.event.name.length > 49
              ? `${props.event.name.slice(0, 49)}...`
              : props.event.name}
          </h1>
          <p className="text-lightGray">
            {convertDate(props.event.start_date)} -{" "}
            {convertDate(props.event.end_date)}, {props.year}
          </p>
          <h2 className="absolute text-left text-lightGray bottom-3 left-5 md:text-left">
            📌 {props.event.city}, {props.event.state_prov},{" "}
            {props.event.country} <br />
            {!props.invalidNavigation &&
              !isNaN(props.eventDistances[props.event.event_code]) && (
                <p className="text-sm">
                  <span className="font-medium text-gray-400">
                    {String(
                      Math.trunc(props.eventDistances[props.event.event_code])
                    ).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    km
                  </span>{" "}
                  away
                </p>
              )}
          </h2>
        </div>
      </a>
    </Link>
  );
};

export const EventsScreen = (props: any): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState("");
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [showNearbyEvents, setShowNearbyEvents] = useState(false);
  const [nearbyRange, setNearbyRange] = useState<string | number>(350);
  const [invalidNavigation, setInvalidNavigation] = useState(false);
  const [eventDistances, setEventDistances] = useState({});
  const [address, setAddress] = useState("");
  const [filterByAddress, setFilterByAddress] = useState(false);
  const [seasonDropDown, setSeasonDropDown] = useState<boolean>(false);
  const [weekDropDown, setWeekDropDown] = useState(false);
  const [weekQuery, setWeekQuery] = useState<any>();
  const seasons: number[] = [...Array(CURR_YEAR - 1997 + 1).keys()].map(
    (x: number) => x + 1997
  );
  const weeks: number[] = [...Array(7).keys()];
  const weeksArray: (string | number)[] = [
    "Preseason",
    ...weeks.slice(1).map((week: number) => week - 1),
    "Championship",
    "Offseason",
  ];

  const today: Date = new Date();
  const newToday: string = today.toISOString().split("T")[0];
  today.setHours(0, 0, 0, 0);

  const weekDropdownRef: React.RefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);

  useEffect((): void => {
    if (nearbyRange === "") {
      setNearbyRange(350);
    }

    const fetchGeoData = async (): Promise<GeoData | null> => {
      return await getGeoData(address);
    };

    if (filterByAddress) {
      fetchGeoData()
        .then((data: GeoData | null): void => {
          const lat: number = Number(data?.lat);
          const lng: number = Number(data?.lng);
          const eventDistances: any = {};

          const nearbyEvents = props.events.filter((event: any): boolean => {
            const distance: number =
              haversine(
                { lat: event.lat, lng: event.lng },
                {
                  lat,
                  lng,
                }
              ) / 1000; // convert to km

            eventDistances[event.event_code] = distance;
            return distance <= Number(nearbyRange); // events within x km range
          });

          setNearbyEvents(nearbyEvents);
          setEventDistances(eventDistances);
        })
        .then(() => setFilterByAddress(false));
    } else if (address === "") {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result: PermissionStatus): void => {
          if (result.state === "granted") {
            navigator.geolocation.getCurrentPosition(
              (position: GeolocationPosition): void => {
                const eventDistances: any = {};

                const nearbyEvents = props.events.filter(
                  (event: any): boolean => {
                    const distance: number =
                      haversine(
                        { lat: event.lat, lng: event.lng },
                        {
                          lat: position.coords.latitude,
                          lng: position.coords.longitude,
                        }
                      ) / 1000; // convert to km

                    eventDistances[event.event_code] = distance;
                    return distance <= Number(nearbyRange); // events within x km range
                  }
                );

                setNearbyEvents(nearbyEvents);
                setEventDistances(eventDistances);
              }
            );
          } else {
            setInvalidNavigation(true);
          }
        });
    }
  }, [props.events, nearbyRange, filterByAddress, address]);

  useEffect(() => {
    const closeWeekDropdown = (event: MouseEvent): void => {
      if (
        weekDropdownRef.current &&
        !weekDropdownRef.current.contains(event.target as Node)
      ) {
        setWeekDropDown(false);
      }
    };

    if (weekDropDown) document.addEventListener("click", closeWeekDropdown);
    return () => document.removeEventListener("click", closeWeekDropdown);
  }, [weekDropDown]);

  const renderEventsSection = (
    filterCondition: any,
    title: string | ReactNode
  ) => (
    <div className="w-full max-w-screen-3xl">
      {props.events.some(filterCondition) && (
        <>
          <h1 className="flex mt-10 mb-5 text-lightGray">
            <p className="text-2xl font-bold text-white">{title}</p>
            <span className="border border-[#2A2A2A] text-lightGray text-xl px-2 mt-[-1px] ml-1 rounded-full font-semibold">
              {props.events.filter(filterCondition).length}{" "}
              {props.events.filter(filterCondition).length === 1
                ? "event"
                : "events"}
            </span>
          </h1>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {props.events.filter(filterCondition).length > 0 ? (
              props.events
                .filter(filterCondition)
                .map((event: any, key: number) => {
                  return (
                    <Event
                      key={key}
                      event={event}
                      eventDistances={eventDistances}
                      invalidNavigation={invalidNavigation}
                      year={props.year}
                    />
                  );
                })
            ) : (
              <p className="text-lightGray whitespace-nowrap">
                Uh oh, looks like there were no events found.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );

  if (props.events.length === 0) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full pl-4 pr-4 md:pl-8 md:pr-8 max-w-screen-3xl">
      <div className="flex flex-wrap gap-x-3">
        <button
          onClick={(): void => {
            if (weekQuery) {
              setShowNearbyEvents(false);
              setWeekQuery("");
            } else {
              setShowNearbyEvents(!showNearbyEvents);
            }
          }}
          className="hover:cursor-pointer flex text-sm mt-5 bg-card border border-[#2A2A2A] hover:border-gray-600 text-lightGray hover:text-white transition-all duration-150 rounded-lg px-3 py-2"
        >
          {!showNearbyEvents && !weekQuery && (
            <FaCrosshairs className="mr-2 text-lg" />
          )}{" "}
          {showNearbyEvents || weekQuery ? "Show All Events" : "Search Nearby"}
        </button>

        {showNearbyEvents ? (
          <>
            <Search
              placeholder="City / Zip Code / Address"
              onChange={(e: any) => setAddress(e.target.value)}
              icon={<FaMapMarkerAlt className="text-sm text-lightGray" />}
            />
            <Search
              placeholder="Radius (in km)"
              onChange={(e: any) => setNearbyRange(e.target.value)}
              icon={<FaGlobe className="text-sm text-lightGray" />}
            />
            {address && (
              <button
                onClick={() => setFilterByAddress(true)}
                className="flex text-sm mt-5 bg-card border border-[#2A2A2A] hover:border-gray-600 text-lightGray hover:text-white transition-all duration-150 rounded-lg px-3 py-2"
              >
                Search
              </button>
            )}
          </>
        ) : (
          <div className="flex items-center ">
            <Search
              placeholder="Search all events..."
              onChange={(e: any) => setSearchQuery(e.target.value)}
            />
            <div className="relative ml-3" ref={weekDropdownRef}>
              {" "}
              <div
                className={`flex items-center text-sm mt-5 px-10 bg-card border border-[#2A2A2A] hover:border-gray-600 text-lightGray hover:text-white transition-all duration-150 rounded-lg py-2 z-20 select-none hover:cursor-pointer ${
                  weekDropDown && "rounded-b-none"
                }`}
                onClick={() => setWeekDropDown(!weekDropDown)}
              >
                <h1 className="mr-2">Sort by Week</h1>
                <FaArrowUp
                  className={`transform text-lightGray group-hover:text-white transition-all duration-150 ${
                    weekDropDown ? "-rotate-180 text-white" : ""
                  }`}
                />
              </div>
              <div
                className={`absolute select-none flex flex-col items-center justify-center duration-150 right-0 left-0 border border-[#2A2A2A] bg-card text-white rounded-b-lg px-4 py-2 ${
                  weekDropDown ? "block" : "hidden"
                } z-20`}
              >
                {weeksArray.map((week: string | number, i: number) => (
                  <div
                    key={i}
                    className="my-1 font-semibold duration-150 hover:cursor-pointer hover:text-white text-lightGray"
                    onClick={() =>
                      setWeekQuery(
                        typeof week === "number" && week !== 6 ? week + 1 : week
                      )
                    }
                  >
                    <h1
                      className={`text-center ${
                        weekQuery === Number(week) + 1
                          ? "font-bold text-white"
                          : ""
                      }`}
                    >
                      {typeof week === "number" ? `Week ${week + 1}` : week}
                    </h1>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative ml-3">
              <div
                className={`flex items-center text-sm mt-5 px-10 bg-card border border-[#2A2A2A] hover:border-gray-600 text-lightGray hover:text-white transition-all duration-150 rounded-lg py-2 z-20 select-none hover:cursor-pointer ${
                  seasonDropDown && "rounded-b-none"
                }`}
                onClick={() => setSeasonDropDown(!seasonDropDown)}
              >
                Season
                <FaArrowUp
                  className={`ml-2 transform text-lightGray group-hover:text-white transition-all duration-150 ${
                    seasonDropDown ? "-rotate-180 text-white" : ""
                  }`}
                />
              </div>
              <div
                className={`absolute select-none flex flex-col items-center justify-center duration-150  border border-[#2A2A2A] bg-card text-white rounded-b-lg px-4 py-2 ${
                  seasonDropDown ? "block" : "hidden"
                } z-20`}
              >
                <div className="grid grid-cols-2 gap-1">
                  {seasons.map((szn: number, i: number) => (
                    <div
                      key={i}
                      className="text-center transition-all flex items-center justfiy-center duration-150 cursor-pointer text-lightGray hover:text-white bg-card border border-[#2A2A2A] hover:cursor-pointer py-1 px-2 rounded-lg"
                      onClick={(): void => {
                        props.setYear(szn);
                        props.setEvents([]);
                      }}
                    >
                      {szn}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          className="mt-5 bg-card hover:bg-[#191919] px-3 py-1 text-lightGray text-sm rounded-lg border border-[#2A2A2A] hover:text-white transition-all duration-150"
          onClick={(): void => {
            exportFromJSON({
              data: getStorage(`events_${CURR_YEAR}`),
              fileName: `Events__ScoutMachine_${CURR_YEAR}`,
              exportType: exportFromJSON.types.csv,
            });
          }}
        >
          <FaFileCsv className="mr-1 inline-block text-xs mb-[3px]" /> Export
          Data (CSV)
        </button>
      </div>

      {weekQuery &&
        renderEventsSection(
          (event: any): boolean =>
            typeof weekQuery === "number"
              ? event.week === weekQuery - 1
              : event.event_type_string === weekQuery
              ? weekQuery === "Championship"
              : ["Championship Division", "Championship Finals"].includes(
                  event.event_type_string
                ),
          `${typeof weekQuery === "number" ? `Week ${weekQuery}` : weekQuery}`
        )}

      {searchQuery &&
        renderEventsSection(
          (event: any) =>
            (
              event.name +
              event.location_name +
              event.city +
              event.country +
              event.district?.abbreviation
            )
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
          <p>
            Searching Events{" "}
            <span className="text-lightGray">({searchQuery})</span>
          </p>
        )}

      {showNearbyEvents &&
        renderEventsSection(
          (event: any) =>
            nearbyEvents.some(
              (nearbyEvent: any): boolean => nearbyEvent.name === event.name
            ),
          <p>
            Nearby <span className="text-lightGray">({nearbyRange}km)</span>
          </p>
        )}

      {!weekQuery && !showNearbyEvents && !searchQuery && (
        <div>
          {renderEventsSection(
            (event: any): boolean => newToday <= event.end_date,
            "Upcoming"
          )}
          {renderEventsSection(
            (event: any): boolean => event.event_type_string === "Preseason",
            "Preseason"
          )}

          {renderEventsSection(
            (event: any): boolean => event.week === 0,
            "Week 1"
          )}
          {renderEventsSection(
            (event: any): boolean => event.week === 1,
            "Week 2"
          )}
          {renderEventsSection(
            (event: any): boolean => event.week === 2,
            "Week 3"
          )}
          {renderEventsSection(
            (event: any): boolean => event.week === 3,
            "Week 4"
          )}
          {renderEventsSection(
            (event: any): boolean => event.week === 4,
            "Week 5"
          )}
          {renderEventsSection(
            (event: any): boolean => event.week === 5,
            "Week 6"
          )}

          {renderEventsSection(
            (event: any) =>
              ["Championship Division", "Championship Finals"].includes(
                event.event_type_string
              ),
            "FIRST Championship"
          )}
          {renderEventsSection(
            (event: any): boolean => event.event_type_string === "Offseason",
            "Offseason"
          )}
        </div>
      )}
    </div>
  );
};
