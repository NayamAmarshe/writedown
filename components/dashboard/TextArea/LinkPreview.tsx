import { LuLink } from "react-icons/lu";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  Node,
  mergeAttributes,
} from "@tiptap/react";
import React, { useEffect, useState } from "react";

const LinkPreviewCard = ({ node }: { node: any }) => {
  const { url } = node.attrs;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(
    "https://placehold.co/900x600/000000/FFF?text=writedown&font=raleway/jpeg"
  );
  const sanitizedUrl = url.split("/").slice(0, 3).join("/");

  useEffect(() => {
    (async () => {
      const { title, description, image } = await fetch(
        `/api/link-preview?url=${url}`
      ).then((res) => res.json());

      setTitle(title);
      setDescription(description);
      setImage(image);
    })();
  }, []);

  return (
    <NodeViewWrapper contenteditable="false">
      <a
        href={url}
        target="_blank"
        className="not-prose mb-4 flex w-full cursor-pointer items-center gap-4 rounded-lg bg-slate-100 p-3 transition-colors hover:bg-slate-200 "
      >
        {image && (
          <div className="w-1/3 overflow-hidden">
            <img
              src={image}
              alt={`${title}-preview`}
              className="not-prose rounded-lg"
            />
          </div>
        )}
        <div className="w-2/3 space-y-2 text-xs md:text-sm">
          <div className="truncate">{title} </div>

          <div className="line-clamp-2 text-slate-400 md:line-clamp-3">
            {description}
          </div>
          <p className="hidden cursor-pointer  items-center gap-2 font-medium text-sky-500 md:inline-flex">
            <LuLink />
            {sanitizedUrl}
          </p>
        </div>
      </a>
    </NodeViewWrapper>
  );
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    linkPreview: {
      /**
       * @example editor.commands.setLinkPreview({ url: 'https://example.com' })
       */
      setLinkPreview: ({ url }: { url: string }) => ReturnType;
    };
  }
}

export const LinkPreview = Node.create({
  name: "linkPreview",
  priority: 1000,
  group: "block",
  content: "inline*",

  addAttributes() {
    return {
      url: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [{ tag: "div" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, {})];
  },

  addNodeView() {
    return ReactNodeViewRenderer(LinkPreviewCard);
  },

  addCommands() {
    return {
      setLinkPreview:
        ({ url }) =>
        ({ commands }) => {
          return commands.setNode(this.name, { url });
        },
    };
  },
});
