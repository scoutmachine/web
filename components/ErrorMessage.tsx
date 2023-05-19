import { ReactNode } from "react";

export const ErrorMessage = (props: { message: string | ReactNode }) => {
  return (
    <p className="text-red-400 font-bold py-3 px-5 mt-5 rounded-lg border-2 border-red-500">
      {props.message}
    </p>
  );
};
