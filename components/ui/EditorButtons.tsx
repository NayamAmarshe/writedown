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

const EditorButtons = () => {
  const editor = useEditor(() => Editor.make());

  function call<T>(command: CmdKey<T>, payload?: T) {
    return editor.get()?.action(callCommand(command, payload));
  }
  return (
    <div className="flex w-full gap-4 pb-4">
      <button onClick={() => call(wrapInHeadingCommand.key)}>
        <MaterialHeadingOne />
      </button>
      <button onClick={() => call(toggleStrongCommand.key)}>
        <MaterialFormatBold />
      </button>
      <button onClick={() => call(toggleEmphasisCommand.key)}>
        <MaterialFormatItalic />
      </button>
      <button onClick={() => call(wrapInBlockquoteCommand.key)}>
        <MingcuteQuoteRight />
      </button>
      <button onClick={() => call(toggleStrikethroughCommand.key)}>
        <OutlineStrikethrough />
      </button>
      <button onClick={() => call(wrapInOrderedListCommand.key)}>
        <MaterialUnorderedList />
      </button>
      <button onClick={() => call(toggleInlineCodeCommand.key)}>
        <MaterialCodeRounded />
      </button>
    </div>
  );
};
export default EditorButtons;
