import React, { useState } from "react";
import {
  LuBold,
  LuLink,
  LuCode,
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
import Toggle from "@/components/toggle";
import { Editor } from "@tiptap/react";
import { LucideCheckSquare } from "lucide-react";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type EditorButtonsProps = {
  shiftRight?: boolean;
  editor: Editor | null;
};

const EditorButtons = ({ shiftRight, editor }: EditorButtonsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  // Image preview states
  const [isUrlPromptOpen, setIsUrlPromptOpen] = useState(false);
  const [isLinkPreview, setIsLinkPreview] = useState(false);

  if (!editor) return <></>;

  return (
    <div
      className={`m-4 flex w-full max-w-3xl items-center justify-center rounded-xl bg-white p-1 transition-transform duration-300 sm:justify-start dark:bg-slate-900 ${
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
          <LucideCheckSquare className="dark:text-slate-200" />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() => editor.chain().focus().setCodeBlock().run()}
        >
          <LuCode className="dark:text-slate-200" />
        </button>
        {/* <button className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-700">
          <MaterialLink />
        </button> */}
        <button
          className="rounded-xl p-3 hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() => setIsUrlPromptOpen(true)}
        >
          <LuLink className="dark:text-slate-200" />
        </button>

        <Dialog open={isUrlPromptOpen} onOpenChange={setIsUrlPromptOpen}>
          <div className="flex flex-col items-center gap-2">
            <div className="mb-2 inline-flex w-full items-center justify-end gap-4">
              <span>Link Preview: </span>
              <Toggle
                enabled={isLinkPreview}
                onChange={() => setIsLinkPreview((prev) => !prev)}
              />
            </div>

            <Input
              id="url"
              placeholder="Enter URL"
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              isLinkPreview
                ? editor.chain().setLinkPreview({ url: url }).run()
                : editor.chain().insertContent(`[${url}](${url})`).run();
              setIsUrlPromptOpen(false);
            }}
          >
            Save
          </button>
        </Dialog>

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

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button
              onClick={() => {
                editor.chain().focus().setImage({ src: url, title }).run();
                setIsOpen(false);
              }}
            >
              Insert Image
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Image</DialogTitle>
              <DialogDescription>
                Enter a title and the link to an image.
              </DialogDescription>
            </DialogHeader>

            <div>
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
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
export default EditorButtons;
