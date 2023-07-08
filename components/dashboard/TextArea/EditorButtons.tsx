import {
  LuBold,
  LuCode,
  LuDivide,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuImage,
  LuItalic,
  LuList,
  LuListOrdered,
  LuMinus,
  LuQuote,
  LuRuler,
  LuStrikethrough,
} from "react-icons/lu";
import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import Modal from "../../ui/Modal";
import Input from "../../ui/Input";

type EditorButtonsProps = {
  shiftRight?: boolean;
  editor: Editor | null;
};

const EditorButtons = ({ shiftRight, editor }: EditorButtonsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  return (
    <div
      className={`m-4 flex w-full max-w-3xl items-center justify-center rounded-xl bg-white p-1 transition-transform duration-300 dark:bg-slate-900 sm:justify-start ${
        shiftRight ? "translate-x-52" : "translate-x-0"
      }`}
    >
      <div className="flex flex-row items-center gap-2 overflow-x-auto sm:w-full sm:justify-evenly">
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <LuHeading1 className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <LuHeading2 className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <LuHeading3 className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <LuHeading4 className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <LuBold className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <LuItalic className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <LuQuote className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <LuStrikethrough className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <LuListOrdered className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <LuList className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <LuCode className="dark:text-slate-200" />
        </button>
        {/* <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <MaterialLink />
        </button> */}
        <button className="rounded-xl p-3 hover:bg-slate-200 dark:hover:bg-slate-700">
          <LuImage className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <LuMinus className="dark:text-slate-200" />
        </button>
        <Modal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title="Insert Image"
          description="Enter a title and the link to an image."
          saveText="Insert"
          closeText="Cancel"
          saveHandler={() => {}}
        >
          <div className="flex flex-col items-center gap-2">
            <Input
              id="title"
              placeholder="Enter Title"
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              id="url"
              placeholder="Enter URL"
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};
export default EditorButtons;
