import MaterialHorizontalRule from "@/components/icons/MaterialHorizontalRule";
import MaterialHeadingThree from "@/components/icons/MaterialHeadingThree";
import MaterialHeadingFour from "@/components/icons/MaterialHeadingFour";
import MaterialOrderedList from "@/components/icons/MaterialOrderedList";
import MaterialHeadingTwo from "@/components/icons/MaterialHeadingTwo";
import MaterialUnorderedList from "../../icons/MaterialUnorderedList";
import OutlineStrikethrough from "../../icons/OutlineStrikethrough";
import MaterialFormatItalic from "../../icons/MaterialFormatItalic";
import MaterialCodeRounded from "../../icons/MaterialCodeRounded";
import MaterialFormatBold from "../../icons/MaterialFormatBold";
import MingcuteQuoteRight from "../../icons/MingcuteQuoteRight";
import MaterialHeadingOne from "../../icons/MaterialHeadingOne";
import BootstrapImage from "../../icons/BootstrapImage";
import React, { useCallback, useState } from "react";
import Modal from "../../ui/Modal";
import Input from "../../ui/Input";
type EditorButtonsProps = {
  shiftRight?: boolean;
};

const EditorButtons = ({ shiftRight }: EditorButtonsProps) => {
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
          <MaterialHeadingOne className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <MaterialHeadingTwo className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <MaterialHeadingThree className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <MaterialHeadingFour className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <MaterialFormatBold className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <MaterialFormatItalic className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <MingcuteQuoteRight className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <OutlineStrikethrough className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <MaterialOrderedList className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <MaterialUnorderedList className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <MaterialCodeRounded className="dark:text-slate-200" />
        </button>
        {/* <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <MaterialLink />
        </button> */}
        <button className="rounded-xl p-3 hover:bg-slate-200 dark:hover:bg-slate-700">
          <BootstrapImage className="dark:text-slate-200" />
        </button>
        <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <MaterialHorizontalRule className="dark:text-slate-200" />
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
