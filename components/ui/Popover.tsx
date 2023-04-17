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
    <HeadlessPopover {...rest}>
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
            <HeadlessPopover.Panel className="absolute left-0 z-10 mt-2 w-52">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-slate-900 ring-opacity-5">
                <div className="relative flex flex-col gap-2 bg-white p-2 lg:grid-cols-2">
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
