import {
  toggleEmphasisCommand,
  toggleStrongCommand,
  wrapInOrderedListCommand,
  wrapInBlockquoteCommand,
  toggleInlineCodeCommand,
  wrapInHeadingCommand,
  insertImageCommand,
  UpdateImageCommandPayload,
} from "@milkdown/preset-commonmark";
import {
  Bold,
  Code,
  Heading,
  Heading1,
  Image,
  Italic,
  List,
  Quote,
  Strikethrough,
} from "lucide-react";
import { toggleStrikethroughCommand } from "@milkdown/preset-gfm";
import React, { useCallback, useState } from "react";
import { Editor, CmdKey } from "@milkdown/core";
import { callCommand } from "@milkdown/utils";
import { useEditor } from "@milkdown/react";
import "@milkdown/theme-nord/style.css";
import Modal from "../../ui/Modal";
import Input from "../../ui/Input";
type EditorButtonsProps = {
  shiftRight?: boolean;
};

const EditorButtons = ({ shiftRight }: EditorButtonsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const editor = useEditor(() => Editor.make());

  const call = <T,>(command: CmdKey<T>, payload?: T) => {
    return editor.get()?.action(callCommand(command, payload));
  };

  // Object for inserting images
  const imageHandler = useCallback(() => {
    const link = { title, url };
    const image: UpdateImageCommandPayload = { src: link.url, alt: link.title };

    call(insertImageCommand.key, image);
  }, [title, url]);

  return (
    <div
      className={`m-4 flex w-full max-w-3xl items-center justify-center rounded-xl bg-white p-1 transition-transform duration-300 sm:justify-start ${
        shiftRight ? "translate-x-52" : "translate-x-0"
      }`}
    >
      <div className="flex flex-row items-center gap-2 overflow-x-auto sm:w-full sm:justify-evenly">
        <button
          className="rounded-xl p-2 hover:bg-slate-200"
          onClick={() => call(wrapInHeadingCommand.key)}
        >
          <Heading className="h-5 w-5" />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-200"
          onClick={() => call(toggleStrongCommand.key)}
        >
          <Bold className="h-5 w-5" />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-200"
          onClick={() => call(toggleEmphasisCommand.key)}
        >
          <Italic className="h-5 w-5" />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-200"
          onClick={() => call(wrapInBlockquoteCommand.key)}
        >
          <Quote className="h-5 w-5" />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-200"
          onClick={() => call(toggleStrikethroughCommand.key)}
        >
          <Strikethrough className="h-5 w-5" />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-200"
          onClick={() => call(wrapInOrderedListCommand.key)}
        >
          <List className="h-5 w-5" />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-200"
          onClick={() => call(toggleInlineCodeCommand.key)}
        >
          <Code className="h-5 w-5" />
        </button>
        <button
          onClick={() => setIsOpen(isOpen ? false : true)}
          className="rounded-xl p-2 hover:bg-slate-200"
        >
          <Image className="h-5 w-5" />
        </button>
        <Modal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title="Insert Image"
          description="Enter a title and the link to an image."
          saveText="Insert"
          closeText="Cancel"
          saveHandler={imageHandler}
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
