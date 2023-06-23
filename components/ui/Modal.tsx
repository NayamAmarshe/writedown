import { Dialog, Transition } from "@headlessui/react";
import Button from "./Button";
import React from "react";

interface ModalProps {
  title?: string;
  description?: string;
  saveHandler?: () => void;
  saveText?: string;
  closeText?: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
}

const Modal = ({
  title,
  description,
  saveText,
  saveHandler,
  closeText,
  isOpen,
  setIsOpen,
  children,
}: ModalProps) => {
  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-50 p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-800">
                {title && (
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6 text-slate-900 dark:text-slate-100"
                  >
                    {title}
                  </Dialog.Title>
                )}

                <Dialog.Description className="mb-4 mt-2">
                  <p className="text-sm text-slate-500 dark:text-slate-600">
                    {description}
                  </p>
                </Dialog.Description>

                {children}

                <div className="mt-4 flex justify-end gap-2">
                  {saveText && (
                    <Button onClick={saveHandler}>{saveText}</Button>
                  )}

                  {closeText && (
                    <Button
                      variant="red"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      {closeText}
                    </Button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
