import { Popover as HeadlessPopover, Transition } from "@headlessui/react";
import { Fragment } from "react";

type PopoverProps = {
  button?: React.ReactNode;
  buttonStyle?: string;
  openStyle?: string;
  reverse?: boolean;
  children: React.ReactNode;
};

export default function Popover({
  button,
  buttonStyle,
  openStyle,
  reverse = false,
  children,
  ...rest
}: PopoverProps) {
  return (
    <HeadlessPopover {...rest} className="relative">
      {({ open }) => (
        <>
          <HeadlessPopover.Button
            className={`block
                ${open ? "" : openStyle} ${buttonStyle}`}
          >
            {button}
          </HeadlessPopover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <HeadlessPopover.Panel
              className={`absolute ${
                reverse ? "right-0" : "left-0"
              } z-10 mt-2 w-52`}
            >
              <div className="ring-opacity-15 overflow-hidden rounded-lg shadow-lg shadow-black/10 ring-1 ring-slate-200 dark:shadow-slate-900 dark:ring-slate-700">
                <div className="relative flex flex-col gap-1 bg-white p-2 dark:bg-slate-800 lg:grid-cols-2">
                  {children}
                </div>
              </div>
            </HeadlessPopover.Panel>
          </Transition>
        </>
      )}
    </HeadlessPopover>
  );
}
