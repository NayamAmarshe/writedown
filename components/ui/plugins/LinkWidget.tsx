import ArrowTopRightOnSquare from "@/components/icons/ArrowTopRightOnSquare";
import type { useWidgetViewFactory } from "@prosemirror-adapter/react";
import { useWidgetViewContext } from "@prosemirror-adapter/react";
import { updateLinkCommand } from "@milkdown/preset-commonmark";
import { DecorationSet } from "@milkdown/prose/view";
import { Plugin } from "@milkdown/prose/state";
import { useInstance } from "@milkdown/react";
import { commandsCtx } from "@milkdown/core";
import { $prose } from "@milkdown/utils";
import type { FC } from "react";

export const LinkWidgetComponent: FC = () => {
  const { spec } = useWidgetViewContext();
  const [loading, editor] = useInstance();
  const href = spec?.href ?? "";
  const title = spec?.title ?? "";

  return (
    <span className="relative">
      <span className="absolute bottom-7 flex flex-row items-center gap-2 rounded-lg bg-slate-800 p-2">
        <input
          size={href.length}
          placeholder="Enter a Link Here"
          className="rounded border-none bg-slate-500 text-xs text-slate-50"
          onBlur={(e) => {
            if (loading) return;
            editor().action((ctx) => {
              const commands = ctx.get(commandsCtx);
              commands.call(updateLinkCommand.key, {
                href: e.target.value,
              });
            });
          }}
          type="text"
          defaultValue={href}
        />
        <a href={href} target="_blank" rel="noreferrer">
          <ArrowTopRightOnSquare className="h-5 w-5 text-slate-50" />
        </a>
      </span>
    </span>
  );
};

export const linkPlugin = (
  widgetViewFactory: ReturnType<typeof useWidgetViewFactory>
) => {
  const linkComponent = widgetViewFactory({
    as: "span",
    component: LinkWidgetComponent,
  });

  return $prose(
    () =>
      new Plugin({
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr) {
            const { selection } = tr;

            const { $from, $to } = selection;
            const node = tr.doc.nodeAt(selection.from);

            const mark = node?.marks.find((mark) => {
              return mark.type.name === "link";
            });
            if (!mark) return DecorationSet.empty;

            let markPos = { start: -1, end: -1 };
            tr.doc.nodesBetween($from.start(), $to.end(), (n, pos) => {
              if (node === n) {
                markPos = {
                  start: pos,
                  end: pos + Math.max(n.textContent.length, 1),
                };

                // stop recursing if result is found
                return false;
              }
              return undefined;
            });

            return DecorationSet.create(tr.doc, [
              linkComponent(markPos.start, {
                href: mark.attrs.href,
                title: node?.textContent,
              }),
            ]);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
          // ! Disable triple click to fix bug
          handleTripleClick() {
            return true;
          },
        },
      })
  );
};
