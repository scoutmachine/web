import Link from "next/link";
import { FaTimes } from "react-icons/fa";

export const AlliancesTab = (props: any) => {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full mt-5 text-sm text-left bg-[#191919] border border-[#2A2A2A]">
        <thead className="text-xs text-black dark:text-white uppercase">
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
                className="text-lightGray border border-[#2A2A2A] bg-card hover:bg-[#191919]"
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
                  {alliance.picks[3] ? (
                    <Link
                      href={`/teams/${alliance.picks[3].slice(3)}`}
                      legacyBehavior
                    >
                      <a>{alliance.picks[3].slice(3)}</a>
                    </Link>
                  ) : (
                    <FaTimes className="text-gray-500" />
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
