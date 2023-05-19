export const EventsTab = (props: any) => {
  return (
    <>
      <table className="w-full mt-5 text-sm text-left bg-[#191919] border border-[#2A2A2A]">
        <thead className="text-xs text-white uppercase">
          <tr>
            <th scope="col" className="px-6 py-3">
              Event
            </th>
          </tr>
        </thead>
        <tbody>
          {props.events.reverse().map((event: any, key: number) => {
            return (
              <tr
                key={key}
                className="text-lightGray border border-[#2A2A2A] bg-card hover:bg-[#191919]"
              >
                <td scope="row" className="px-6 py-4 whitespace-nowrap">
                  {event.name}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
