import {
  toggleEmphasisCommand,
  toggleInlineCodeCommand,
  toggleLinkCommand,
  toggleStrongCommand,
  updateLinkCommand,
  wrapInBlockquoteCommand,
  wrapInHeadingCommand,
  wrapInOrderedListCommand,
} from "@milkdown/preset-commonmark";
import MaterialUnorderedList from "@/components/icons/MaterialUnorderedList";
import MaterialFormatItalic from "@/components/icons/MaterialFormatItalic";
import OutlineStrikethrough from "@/components/icons/OutlineStrikethrough";
import MaterialHeadingThree from "@/components/icons/MaterialHeadingThree";
import { tooltipFactory, TooltipProvider } from "@milkdown/plugin-tooltip";
import MaterialCodeRounded from "@/components/icons/MaterialCodeRounded";
import MaterialHeadingFour from "@/components/icons/MaterialHeadingFour";
import MaterialHeadingOne from "@/components/icons/MaterialHeadingOne";
import MaterialFormatBold from "@/components/icons/MaterialFormatBold";
import MingcuteQuoteRight from "@/components/icons/MingcuteQuoteRight";
import MaterialHeadingTwo from "@/components/icons/MaterialHeadingTwo";
import { usePluginViewContext } from "@prosemirror-adapter/react";
import { toggleStrikethroughCommand } from "@milkdown/preset-gfm";
import MaterialLink from "@/components/icons/MaterialLink";
import { useCallback, useEffect, useRef } from "react";
import { useInstance } from "@milkdown/react";
import { callCommand } from "@milkdown/utils";
import { Ctx } from "@milkdown/ctx";

export const tooltip = tooltipFactory("Text");

export const TooltipView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const tooltipProvider = useRef<TooltipProvider>();

  const { view, prevState } = usePluginViewContext();
  const [loading, get] = useInstance();
  const action = useCallback(
    (fn: (ctx: Ctx) => void) => {
      if (loading) return;
      get().action(fn);
    },
    [loading]
  );

  useEffect(() => {
    const div = ref.current;
    if (loading || !div) {
      return;
    }
    tooltipProvider.current = new TooltipProvider({
      content: div,
    });

    return () => {
      tooltipProvider.current?.destroy();
    };
  }, [loading]);

  useEffect(() => {
    tooltipProvider.current?.update(view, prevState);
  });

  return (
    <div>
      <div
        ref={ref}
        className="scrollbar flex flex-row overflow-auto rounded-lg border bg-slate-100 px-2 py-1 text-gray-600 shadow-lg shadow-slate-900/20"
      >
        <button
          className="rounded-xl p-2 hover:bg-slate-300"
          onClick={() => action(callCommand(wrapInHeadingCommand.key))}
        >
          <MaterialHeadingOne />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-300"
          onClick={() => action(callCommand(wrapInHeadingCommand.key, 2))}
        >
          <MaterialHeadingTwo />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-300"
          onClick={() => action(callCommand(wrapInHeadingCommand.key, 3))}
        >
          <MaterialHeadingThree />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-300"
          onClick={() => action(callCommand(wrapInHeadingCommand.key, 4))}
        >
          <MaterialHeadingFour />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-300"
          onClick={() => action(callCommand(toggleStrongCommand.key))}
        >
          <MaterialFormatBold />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-300"
          onClick={() => action(callCommand(toggleEmphasisCommand.key))}
        >
          <MaterialFormatItalic />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-300"
          onClick={() => action(callCommand(wrapInBlockquoteCommand.key))}
        >
          <MingcuteQuoteRight />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-300"
          onClick={() => action(callCommand(toggleStrikethroughCommand.key))}
        >
          <OutlineStrikethrough />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-300"
          onClick={() => action(callCommand(wrapInOrderedListCommand.key))}
        >
          <MaterialUnorderedList />
        </button>
        <button
          className="rounded-xl p-2 hover:bg-slate-300"
          onClick={() => action(callCommand(toggleInlineCodeCommand.key))}
        >
          <MaterialCodeRounded />
        </button>
        {/* <button
          className="rounded-xl p-2 hover:bg-slate-300"
          onClick={() =>
            action(
              callCommand(updateLinkCommand.key, {
                href: "https://example.com",
                text: "example",
              })
            )
          }
        >
          <MaterialLink />
        </button> */}
      </div>
    </div>
  );
};
