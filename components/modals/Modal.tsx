import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, JSX, SetStateAction } from "react";

type Props = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onClose?: () => void;
  header?: JSX.Element;
  body: JSX.Element;
  footer?: JSX.Element;
  noClose?: boolean;
};

export const Modal = ({
  isOpen,
  setOpen,
  header,
  body,
  footer,
  onClose,
  noClose,
}: Props) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={(): void => {
            !noClose && setOpen(false);
            onClose && onClose();
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-white/75 dark:bg-black/75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`w-full ${
                    noClose ? "max-w-xl" : "max-w-md"
                  } transform overflow-hidden rounded-2xl p-6 transition-all bg-white border border-solid dark:border-[#2A2A2A] dark:bg-[#191919]`}
                >
                  {header}
                  {body}
                  {footer}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
