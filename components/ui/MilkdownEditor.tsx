/* eslint-disable react-hooks/exhaustive-deps */
import {
  toggleEmphasisCommand,
  toggleStrongCommand,
  wrapInBulletListCommand,
  wrapInOrderedListCommand,
  wrapInBlockquoteCommand,
} from "@milkdown/preset-commonmark";
import {
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineOrderedList,
  AiOutlineUnorderedList,
  AiOutlineStrikethrough,
} from "react-icons/ai";
import {
  defaultValueCtx,
  Editor,
  rootCtx,
  editorViewOptionsCtx,
} from "@milkdown/core";
import { history, redoCommand, undoCommand } from "@milkdown/plugin-history";
import { selectedChannelIdAtom } from "@/stores/selectedChannelIdAtom";
import { gfm, toggleStrikethroughCommand } from "@milkdown/preset-gfm";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { IChannelData } from "@/types/utils/firebaseOperations";
import { commonmark } from "@milkdown/preset-commonmark";
import { clipboard } from "@milkdown/plugin-clipboard";
import { Milkdown, useEditor } from "@milkdown/react";
import React, { useEffect, useState } from "react";
import { BiUndo, BiRedo } from "react-icons/bi";
import { MdFormatQuote } from "react-icons/md";
import { callCommand } from "@milkdown/utils";
import { replaceAll } from "@milkdown/utils";
import { nord } from "@milkdown/theme-nord";
import "@milkdown/theme-nord/style.css";
import { useAtom } from "jotai";

interface editorProps {
  channelData?: IChannelData;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  clearSwitch: boolean;
  setClearSwitch: React.Dispatch<React.SetStateAction<boolean>>;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
}

const MilkdownEditor = ({
  setInput,
  input,
  clearSwitch,
  setClearSwitch,
  className,
}: editorProps) => {
  const [selectedChannelId, setSelectedChannelId] = useAtom(
    selectedChannelIdAtom
  );

  const editor = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, input);
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          attributes: {
            class: className ? className : "",
          },
        }));
        ctx.get(listenerCtx).markdownUpdated((_, markdown, prevMarkdown) => {
          if (markdown !== prevMarkdown) {
            setInput(markdown);
          }
        });
      })
      .config(nord)
      .use(listener)
      .use(gfm)
      .use(commonmark)
      .use(history)
      .use(clipboard)
  );

  useEffect(() => {
    if (clearSwitch === false) {
      return;
    }

    editor.get()?.action(replaceAll(""));

    setClearSwitch(false);
  }, [clearSwitch]);

  /* NOT SURE IF WE WANT THE TEXT FIELD TO RESET IF THE ACTIVE CHANNEL IS CHANGED
useEffect(() => {
    editor.get()?.action(replaceAll(""));
  }, [selectedChannelId]);
*/

  // const editorMenu = [
  //   {
  //     btnName: "undo",
  //     icon: <BiUndo />,
  //     func: () => editor.get()?.action(callCommand(undoCommand.key)),
  //   },
  // ];

  const [editorMenu, setEditorMenu] = useState([
    {
      btnName: "undo",
      icon: <BiUndo size={20} />,
      func: () => editor.get()?.action(callCommand(undoCommand.key)),
    },
    {
      btnName: "redo",
      icon: <BiRedo size={20} />,
      func: () => editor.get()?.action(callCommand(redoCommand.key)),
    },
    {
      btnName: "bold",
      icon: <AiOutlineBold size={20} />,
      func: () => editor.get()?.action(callCommand(toggleStrongCommand.key)),
    },
    {
      btnName: "italic",
      icon: <AiOutlineItalic size={20} />,
      func: () => editor.get()?.action(callCommand(toggleEmphasisCommand.key)),
    },
    {
      btnName: "strikethrough",
      icon: <AiOutlineStrikethrough size={20} />,
      func: () =>
        editor.get()?.action(callCommand(toggleStrikethroughCommand.key)),
    },
    {
      btnName: "ul",
      icon: <AiOutlineUnorderedList size={20} />,
      func: () =>
        editor.get()?.action(callCommand(wrapInBulletListCommand.key)),
    },
    {
      btnName: "ol",
      icon: <AiOutlineOrderedList size={20} />,
      func: () =>
        editor.get()?.action(callCommand(wrapInOrderedListCommand.key)),
    },
    {
      btnName: "blockquote",
      icon: <MdFormatQuote size={20} />,
      func: () =>
        editor.get()?.action(callCommand(wrapInBlockquoteCommand.key)),
    },
  ]);

  const handleItemClick = (btnName: string) => {
    const item = editorMenu.find((e) => e.btnName === btnName);
    if (item) {
      item.func();
    }
  };
  return (
    <div className="w-full">
      <div className=" flex gap-1 rounded-t-2xl border-x border-t py-1 px-2 pt-2">
        {editorMenu.map((e) => (
          <button
            className="first rounded-md bg-gray-100 px-2 py-1"
            key={e.btnName}
            onClick={() => handleItemClick(e.btnName)}
          >
            {e.icon}
          </button>
        ))}
      </div>
      <Milkdown />
    </div>
  );
};

export default MilkdownEditor;
