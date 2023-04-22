import { editorViewCtx, parserCtx } from "@milkdown/core";
import { Milkdown as Editor } from "@milkdown/react";
import { usePlayground } from "./usePlayground";
import { Slice } from "@milkdown/prose/model";
import { useImperativeHandle } from "react";
import type { FC, RefObject } from "react";
import { Ctx } from "@milkdown/ctx";

interface MilkdownProps {
  content: string;
  onChange: (markdown: string) => void;
  milkdownRef: RefObject<MilkdownRef>;
}

export interface MilkdownRef {
  update: (markdown: string) => void;
}

export const PlaygroundMilkdown: FC<MilkdownProps> = ({
  content,
  onChange,
  milkdownRef,
}) => {
  const { loading, get } = usePlayground(content, onChange);

  useImperativeHandle(milkdownRef, () => ({
    update: (markdown: string) => {
      if (loading) return;
      const editor = get();
      editor?.action((ctx: Ctx) => {
        const view = ctx.get(editorViewCtx);
        const parser = ctx.get(parserCtx);
        const doc = parser(markdown);
        if (!doc) return;
        const state = view.state;
        view.dispatch(
          state.tr.replace(
            0,
            state.doc.content.size,
            new Slice(doc.content, 0, 0)
          )
        );
      });
    },
  }));

  return <Editor />;
};
