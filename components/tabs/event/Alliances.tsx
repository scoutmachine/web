import Link from "next/link";
import { ImCross } from "react-icons/im";

export const AlliancesScreen = (props: any) => {
  return (
    <div className="flex flex-wrap items-center justify-center">
      <table className="w-full mt-5 text-sm text-left bg-gray-600 border-2 border-gray-500">
        <thead className="text-xs text-white uppercase">
          <tr>
            <th scope="col" className="px-6 py-3">
              #
            </th>
            <th scope="col" className="px-6 py-3">
              Captain
            </th>
            <th scope="col" className="px-6 py-3">
              1st Pick
            </th>
            <th scope="col" className="px-6 py-3">
              2nd Pick
            </th>
            <th scope="col" className="px-6 py-3">
              Backup
            </th>
          </tr>
        </thead>
        <tbody>
          {props.alliances.map((alliance: any, key: number) => {
            return (
              <tr
                key={key}
                className="text-gray-300 bg-gray-700 border-2 border-gray-500 hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-bold">{alliance.name}</td>

                <td className="px-6 py-4">
                  <Link
                    href={`/teams/${alliance.picks[0].slice(3)}`}
                    legacyBehavior
                  >
                    <a>{alliance.picks[0].slice(3)}</a>
                  </Link>
                </td>

                <td className="px-6 py-4">
                  <Link
                    href={`/teams/${alliance.picks[1].slice(3)}`}
                    legacyBehavior
                  >
                    <a>{alliance.picks[1].slice(3)}</a>
                  </Link>
                </td>

                <td className="px-6 py-4">
                  <Link
                    href={`/teams/${alliance.picks[2].slice(3)}`}
                    legacyBehavior
                  >
                    <a>{alliance.picks[2].slice(3)}</a>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  {alliance.picks.length > 3 ? (
                    <Link
                      href={`/teams/${alliance.picks[3].slice(3)}`}
                      legacyBehavior
                    >
                      <a>{alliance.picks[3].slice(3)}</a>
                    </Link>
                  ) : (
                    <ImCross className="text-gray-500" />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
