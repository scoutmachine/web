import Link from "next/link";

export const EventsTab = (props: any) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full mt-5 text-sm text-left bg-[#191919] border border-[#2A2A2A]">
        <thead className="text-xs text-white uppercase">
          <tr>
            <th scope="col" className="px-6 py-3">
              Year
            </th>
            <th scope="col" className="px-6 py-3">
              Event Name
            </th>
          </tr>
        </thead>
        <tbody>
          {props.events.map((event: any, key: number) => {
            return (
              <tr
                key={key}
                className="group text-lightGray border border-[#2A2A2A] bg-card hover:bg-[#191919]"
              >
                <td
                  scope="row"
                  className="group-hover:text-primary px-6 py-4 whitespace-nowrap"
                >
                  <Link href={`/events/${event.event_code}`}>
                    {event.event_code.substring(0, 4)}
                  </Link>
                </td>
                <td className="group-hover:text-primary px-6 py-4 whitespace-nowrap">
                  <Link href={`/events/${event.event_code}`}>{event.name}</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
