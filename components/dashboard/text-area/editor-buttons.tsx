import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Editor } from "@tiptap/react";
import {
  BoldIcon,
  CheckSquareIcon,
  Code2Icon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  QuoteIcon,
  StrikethroughIcon,
} from "lucide-react";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

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
      className={`m-4 sticky top-0 z-30 flex max-w-3xl items-center justify-center transition-transform duration-300 sm:justify-start ${
        shiftRight ? "translate-x-52" : "translate-x-0"
      }`}
    >
      <div className="flex flex-row items-center gap-2 overflow-x-auto sm:w-full sm:justify-evenly">
        {/* Headings Group */}
        <div className="flex rounded-md border border-input">
          <Toggle
            variant="white"
            size="sm"
            pressed={editor.isActive("heading", { level: 1 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className="rounded-none border-0 first:rounded-l-md"
          >
            <Heading1Icon />
          </Toggle>
          <Toggle
            variant="white"
            size="sm"
            pressed={editor.isActive("heading", { level: 2 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className="rounded-none border-0 border-l"
          >
            <Heading2Icon />
          </Toggle>
          <Toggle
            variant="white"
            size="sm"
            pressed={editor.isActive("heading", { level: 3 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className="rounded-none border-0 border-l"
          >
            <Heading3Icon />
          </Toggle>
          <Toggle
            variant="white"
            size="sm"
            pressed={editor.isActive("heading", { level: 4 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            className="rounded-none border-0 border-l last:rounded-r-md"
          >
            <Heading4Icon />
          </Toggle>
        </div>

        {/* Text Formatting Group */}
        <div className="flex rounded-md border border-input">
          <Toggle
            variant="white"
            size="sm"
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            className="rounded-none border-0 first:rounded-l-md"
          >
            <BoldIcon />
          </Toggle>
          <Toggle
            variant="white"
            size="sm"
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            className="rounded-none border-0 border-l"
          >
            <ItalicIcon />
          </Toggle>
          <Toggle
            variant="white"
            size="sm"
            pressed={editor.isActive("strike")}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            className="rounded-none border-0 border-l last:rounded-r-md"
          >
            <StrikethroughIcon />
          </Toggle>
        </div>

        {/* Block Elements Group */}
        <div className="flex rounded-md border border-input">
          <Toggle
            variant="white"
            size="sm"
            pressed={editor.isActive("blockquote")}
            onPressedChange={() =>
              editor.chain().focus().toggleBlockquote().run()
            }
            className="rounded-none border-0 first:rounded-l-md"
          >
            <QuoteIcon />
          </Toggle>
          <Toggle
            variant="white"
            size="sm"
            pressed={editor.isActive("codeBlock")}
            onPressedChange={() => editor.chain().focus().setCodeBlock().run()}
            className="rounded-none border-0 border-l last:rounded-r-md"
          >
            <Code2Icon />
          </Toggle>
        </div>

        {/* Lists Group */}
        <div className="flex rounded-md border border-input">
          <Toggle
            variant="white"
            size="sm"
            pressed={editor.isActive("orderedList")}
            onPressedChange={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
            className="rounded-none border-0 first:rounded-l-md"
          >
            <ListOrderedIcon />
          </Toggle>
          <Toggle
            variant="white"
            size="sm"
            pressed={editor.isActive("bulletList")}
            onPressedChange={() =>
              editor.chain().focus().toggleBulletList().run()
            }
            className="rounded-none border-0 border-l"
          >
            <ListIcon />
          </Toggle>
          <Toggle
            variant="white"
            size="sm"
            pressed={editor.isActive("taskList")}
            onPressedChange={() =>
              editor.chain().focus().toggleTaskList().run()
            }
            className="rounded-none border-0 border-l last:rounded-r-md"
          >
            <CheckSquareIcon />
          </Toggle>
        </div>

        {/* Media & Actions Group */}
        <div className="flex rounded-md border border-input">
          <Toggle
            variant="white"
            size="sm"
            onPressedChange={() => setIsUrlPromptOpen(true)}
            className="rounded-none border-0 first:rounded-l-md"
          >
            <LinkIcon />
          </Toggle>
          <Toggle
            variant="white"
            size="sm"
            onPressedChange={() => setIsOpen(true)}
            className="rounded-none border-0 border-l"
          >
            <ImageIcon />
          </Toggle>
          <Toggle
            variant="white"
            size="sm"
            onPressedChange={() =>
              editor.chain().focus().setHorizontalRule().run()
            }
            className="rounded-none border-0 border-l last:rounded-r-md"
          >
            <MinusIcon />
          </Toggle>
        </div>

        <Dialog open={isUrlPromptOpen} onOpenChange={setIsUrlPromptOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Link</DialogTitle>
              <DialogDescription>
                Add a link to your content with optional preview.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Link Preview:</span>
                <Switch
                  variant="wd"
                  size="wd"
                  checked={isLinkPreview}
                  onCheckedChange={() => setIsLinkPreview((prev) => !prev)}
                />
              </div>

              <Input
                id="url"
                placeholder="Enter URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <Button onClick={() => setIsUrlPromptOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (url) {
                      isLinkPreview
                        ? editor.chain().setLinkPreview({ url: url }).run()
                        : editor
                            .chain()
                            .insertContent(`[${url}](${url})`)
                            .run();
                      setIsUrlPromptOpen(false);
                      setUrl("");
                    }
                  }}
                  disabled={!url}
                >
                  Insert Link
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Image</DialogTitle>
              <DialogDescription>
                Enter a title and the link to an image.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <Input
                id="title"
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                id="url"
                placeholder="Enter URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <Button variant="red" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="blue"
                  onClick={() => {
                    if (url) {
                      editor
                        .chain()
                        .focus()
                        .setImage({ src: url, title })
                        .run();
                      setIsOpen(false);
                      setTitle("");
                      setUrl("");
                    }
                  }}
                  disabled={!url}
                >
                  Insert Image
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
export default EditorButtons;
