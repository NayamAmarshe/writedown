import { Popover as HeadlessPopover, Transition } from "@headlessui/react";
import { Fragment } from "react";

type PopoverProps = {
  button?: React.ReactNode;
  buttonStyle?: string;
  openStyle?: string;
  children: React.ReactNode;
};

export default function Popover({
  button,
  buttonStyle,
  openStyle,
  children,
  ...rest
}: PopoverProps) {
  return (
    <HeadlessPopover className="relative h-full" {...rest}>
      {({ open }) => (
        <>
          <HeadlessPopover.Button
            className={`
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
            <HeadlessPopover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
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
