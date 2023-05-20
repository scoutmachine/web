import { Dispatch, SetStateAction } from "react";
import { Modal } from "./Modal";
import { FaMapMarkerAlt } from "react-icons/fa";

type Props = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  team: any;
};

const ModalHeader = (props: any) => (
  <>
    <>
      <h1 className="font-semibold text-lg flex mb-3">
        <FaMapMarkerAlt className="text-2xl mr-1" /> {props.team.school_name}
      </h1>
    </>
  </>
);

const ModalBody = (props: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  team: any;
}) => {
  return (
    <div className="w-full h-full">
      <iframe
        src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
          props.team.school_name
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
        loading="lazy"
        className="w-full h-[450px] filter rounded-2xl border-2 border-gray-300"
        style={{
          filter: "invert(100%) hue-rotate(180deg)",
          borderRadius: "20px",
        }}
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export const LocationModal = ({ isOpen, setOpen, team }: Props) => {
  return (
    <Modal
      header={<ModalHeader team={team} />}
      body={<ModalBody setOpen={setOpen} team={team} />}
      isOpen={isOpen}
      setOpen={setOpen}
    />
  );
};
