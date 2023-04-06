import {
  toggleEmphasisCommand,
  toggleStrongCommand,
  wrapInOrderedListCommand,
  wrapInBlockquoteCommand,
  toggleInlineCodeCommand,
  wrapInHeadingCommand,
} from "@milkdown/preset-commonmark";
import MaterialUnorderedList from "../icons/MaterialUnorderedList";
import { toggleStrikethroughCommand } from "@milkdown/preset-gfm";
import OutlineStrikethrough from "../icons/OutlineStrikethrough";
import MaterialFormatItalic from "../icons/MaterialFormatItalic";
import MaterialCodeRounded from "../icons/MaterialCodeRounded";
import MaterialFormatBold from "../icons/MaterialFormatBold";
import MingcuteQuoteRight from "../icons/MingcuteQuoteRight";
import MaterialHeadingOne from "../icons/MaterialHeadingOne";
import { Editor, CmdKey } from "@milkdown/core";
import { callCommand } from "@milkdown/utils";
import { useEditor } from "@milkdown/react";
import "@milkdown/theme-nord/style.css";
import React from "react";

type EditorButtonsProps = {
  shiftRight?: boolean;
};

const EditorButtons = ({ shiftRight }: EditorButtonsProps) => {
  const editor = useEditor(() => Editor.make());

  function call<T>(command: CmdKey<T>, payload?: T) {
    return editor.get()?.action(callCommand(command, payload));
  }
  return (
    <div
      className={`m-4 flex w-full max-w-3xl flex-row items-center justify-around rounded-xl bg-white p-1 transition-transform duration-300 ${
        shiftRight ? "translate-x-24" : "translate-x-0"
      }`}
    >
      <button
        className="rounded-xl p-2 hover:bg-slate-200"
        onClick={() => call(wrapInHeadingCommand.key)}
      >
        <MaterialHeadingOne />
      </button>
      <button
        className="rounded-xl p-2 hover:bg-slate-200"
        onClick={() => call(toggleStrongCommand.key)}
      >
        <MaterialFormatBold />
      </button>
      <button
        className="rounded-xl p-2 hover:bg-slate-200"
        onClick={() => call(toggleEmphasisCommand.key)}
      >
        <MaterialFormatItalic />
      </button>
      <button
        className="rounded-xl p-2 hover:bg-slate-200"
        onClick={() => call(wrapInBlockquoteCommand.key)}
      >
        <MingcuteQuoteRight />
      </button>
      <button
        className="rounded-xl p-2 hover:bg-slate-200"
        onClick={() => call(toggleStrikethroughCommand.key)}
      >
        <OutlineStrikethrough />
      </button>
      <button
        className="rounded-xl p-2 hover:bg-slate-200"
        onClick={() => call(wrapInOrderedListCommand.key)}
      >
        <MaterialUnorderedList />
      </button>
      <button
        className="rounded-xl p-2 hover:bg-slate-200"
        onClick={() => call(toggleInlineCodeCommand.key)}
      >
        <MaterialCodeRounded />
      </button>
    </div>
  );
};
export default EditorButtons;
