import {
  toggleEmphasisCommand,
  toggleStrongCommand,
  wrapInBulletListCommand,
  wrapInOrderedListCommand,
  wrapInBlockquoteCommand,
  toggleInlineCodeCommand,
  wrapInHeadingCommand,
} from "@milkdown/preset-commonmark";
import {
  AiOutlineItalic,
  AiOutlineOrderedList,
  AiOutlineUnorderedList,
  AiOutlineStrikethrough,
  AiOutlineUnderline,
  AiOutlineBold,
} from "react-icons/ai";
import { toggleStrikethroughCommand } from "@milkdown/preset-gfm";
import { VscQuote, VscCode } from "react-icons/vsc";
import { CgFormatHeading } from "react-icons/cg";
import { Editor, CmdKey } from "@milkdown/core";
import { callCommand } from "@milkdown/utils";
import { useEditor } from "@milkdown/react";
import "@milkdown/theme-nord/style.css";
import React from "react";

const EditorButtons = () => {
  const editor = useEditor(() => Editor.make());

  function call<T>(command: CmdKey<T>, payload?: T) {
    return editor.get()?.action(callCommand(command, payload));
  }
  return (
    <div className="flex w-full gap-4 pb-4">
      <button onClick={() => call(wrapInHeadingCommand.key)}>
        <CgFormatHeading size={20} />
      </button>
      <button onClick={() => call(toggleStrongCommand.key)}>
        <AiOutlineBold />
      </button>
      <button onClick={() => call(toggleEmphasisCommand.key)}>
        <AiOutlineItalic />
      </button>
      <button onClick={() => call(wrapInBlockquoteCommand.key)}>
        <VscQuote />
      </button>
      <button onClick={() => call(toggleStrikethroughCommand.key)}>
        <AiOutlineStrikethrough />
      </button>
      <button onClick={() => call(wrapInBulletListCommand.key)}>
        <AiOutlineUnorderedList />
      </button>
      <button onClick={() => call(wrapInOrderedListCommand.key)}>
        <AiOutlineOrderedList />
      </button>
      <button onClick={() => call(toggleInlineCodeCommand.key)}>
        <VscCode size={20} />
      </button>
    </div>
  );
};
export default EditorButtons;
