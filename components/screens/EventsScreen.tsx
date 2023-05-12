import { CURR_YEAR } from "@/lib/constants";
import { convertDate } from "@/utils/date";
import Link from "next/link";
import { Search } from "../Search";
import { ReactNode, useEffect, useState } from "react";
import haversine from "haversine-distance";
import {
  FaCrosshairs,
  FaGlobe,
  FaMapMarkerAlt,
  FaArrowUp,
} from "react-icons/fa";
import { getGeoData } from "@/utils/geo";

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
            {convertDate(props.event.end_date)}, {CURR_YEAR}
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

export const EventsScreen = (props: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [showNearbyEvents, setShowNearbyEvents] = useState(false);
  const [nearbyRange, setNearbyRange] = useState<string | number>(350);
  const [invalidNavigation, setInvalidNavigation] = useState(false);
  const [eventDistances, setEventDistances] = useState({});
  const [address, setAddress] = useState("");
  const [filterByAddress, setFilterByAddress] = useState(false);
  const [weekDropDown, setWeekDropDown] = useState(false);
  const [weekQuery, setWeekQuery] = useState<any>();
  const weeks = [...Array(7).keys()];
  const weeksArray = [
    "Preseason",
    ...weeks.slice(1).map((week) => week - 1),
    "Championship Division",
    "Offseason",
  ];

  const today = new Date();
  const newToday = today.toISOString().split("T")[0];

  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (nearbyRange === "") {
      setNearbyRange(350);
    }

    const fetchGeoData = async () => {
      const data = await getGeoData(address);
      return data;
    };

    if (filterByAddress) {
      fetchGeoData()
        .then((data) => {
          const lat = Number(data?.lat);
          const lng = Number(data?.lng);
          const eventDistances: any = {};

          const nearbyEvents = props.events.filter((event: any) => {
            const distance =
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
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          navigator.geolocation.getCurrentPosition((position) => {
            const eventDistances: any = {};

            const nearbyEvents = props.events.filter((event: any) => {
              const distance =
                haversine(
                  { lat: event.lat, lng: event.lng },
                  {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  }
                ) / 1000; // convert to km

              eventDistances[event.event_code] = distance;
              return distance <= Number(nearbyRange); // events within x km range
            });

            setNearbyEvents(nearbyEvents);
            setEventDistances(eventDistances);
          });
        } else {
          setInvalidNavigation(true);
        }
      });
    }
  }, [props.events, nearbyRange, filterByAddress, address]);

  const renderEventsSection = (
    filterCondition: any,
    title: string | ReactNode
  ) => (
    <div className="w-full max-w-screen-3xl">
      <h1 className="flex mt-10 mb-5 text-lightGray">
        <h1 className="text-2xl font-bold text-white">{title}</h1>

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
                />
              );
            })
        ) : (
          <p className="text-lightGray whitespace-nowrap">
            Uh oh, looks like there were no events found.
          </p>
        )}
      </div>
    </div>
  );

  console.log(weekQuery);
  return (
    <div className="w-full pl-4 pr-4 md:pl-8 md:pr-8 max-w-screen-3xl">
      <div className="flex flex-wrap gap-x-3">
        <button
          onClick={() => {
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
            <div className="relative ml-3">
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
                {weeksArray.map((week, i) => (
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
          </div>
        )}
      </div>

      {weekQuery &&
        renderEventsSection(
          (event: any) =>
            typeof weekQuery === "number"
              ? event.week === weekQuery - 1
              : event.event_type_string === weekQuery,
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
              (nearbyEvent: any) => nearbyEvent.name === event.name
            ),
          <p>
            Nearby <span className="text-lightGray">({nearbyRange}km)</span>
          </p>
        )}

      {!weekQuery && !showNearbyEvents && !searchQuery && (
        <div>
          {renderEventsSection(
            (event: any) => newToday <= event.end_date,
            "Upcoming"
          )}
          {renderEventsSection(
            (event: any) => event.event_type_string === "Preseason",
            "Preseason"
          )}

          {renderEventsSection((event: any) => event.week === 0, "Week 1")}
          {renderEventsSection((event: any) => event.week === 1, "Week 2")}
          {renderEventsSection((event: any) => event.week === 2, "Week 3")}
          {renderEventsSection((event: any) => event.week === 3, "Week 4")}
          {renderEventsSection((event: any) => event.week === 4, "Week 5")}
          {renderEventsSection((event: any) => event.week === 5, "Week 6")}

          {renderEventsSection(
            (event: any) => event.event_type_string === "Championship Division",
            "FIRST Championship - Houston, TX"
          )}
          {renderEventsSection(
            (event: any) => event.event_type_string === "Offseason",
            "Offseason"
          )}
        </div>
      )}
    </div>
  );
};
