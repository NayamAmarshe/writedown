import {
  LuBold,
  LuCheckSquare,
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

  if (!editor) return <></>;

  return (
    <div
      className={`m-4 flex w-full max-w-3xl items-center justify-center rounded-xl bg-white p-1 transition-transform duration-300 dark:bg-slate-900 sm:justify-start ${
        shiftRight ? "translate-x-52" : "translate-x-0"
      }`}
    >
      <div className="flex flex-row items-center gap-2 overflow-x-auto sm:w-full sm:justify-evenly">
        <button
          className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 1,
              })
              .run()
          }
        >
          <LuHeading1 className="dark:text-slate-200" />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
        >
          <LuHeading2 className="dark:text-slate-200" />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <LuHeading3 className="dark:text-slate-200" />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 4,
              })
              .run()
          }
        >
          <LuHeading4 className="dark:text-slate-200" />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <LuBold className="dark:text-slate-200" />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <LuItalic className="dark:text-slate-200" />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <LuQuote className="dark:text-slate-200" />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <LuStrikethrough className="dark:text-slate-200" />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <LuListOrdered className="dark:text-slate-200" />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <LuList className="dark:text-slate-200" />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <LuCheckSquare className="dark:text-slate-200" />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() =>
            editor.chain().focus().toggleCodeBlock().unsetCode().run()
          }
        >
          <LuCode className="dark:text-slate-200" />
        </button>
        {/* <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <MaterialLink />
        </button> */}
        <button
          className="rounded-xl p-3 hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() => setIsOpen(true)}
        >
          <LuImage className="dark:text-slate-200" />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <LuMinus className="dark:text-slate-200" />
        </button>
        <Modal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title="Insert Image"
          description="Enter a title and the link to an image."
          saveText="Insert"
          closeText="Cancel"
          saveHandler={() => {
            editor.chain().focus().setImage({ src: url, title }).run();
            setIsOpen(false);
          }}
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
