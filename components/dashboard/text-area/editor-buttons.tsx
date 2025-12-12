import { useState, useEffect, useRef } from "react";
import { ButtonGroup } from "@/components/ui/button-group";
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

  // Fade effect states for horizontal scrolling
  const [isFadeVisible, setIsFadeVisible] = useState({
    left: false,
    right: false,
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const isScrolledToRight = scrollLeft + clientWidth >= scrollWidth - 10; // 10px threshold
    setIsFadeVisible({
      left: scrollLeft > 10,
      right: !isScrolledToRight && scrollWidth > clientWidth,
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Check initial state
    handleScroll();

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-30 flex self-start sm:self-center w-full sm:w-fit max-w-3xl items-center justify-center transition-transform duration-300 sm:justify-start ${
        shiftRight ? "translate-x-52" : "translate-x-0"
      }`}
    >
      <div className="flex flex-row gap-2 bg-white dark:bg-slate-900 p-2 rounded-md overflow-scroll shadow-md dark:shadow-black/30">
        {/* Left fade effect */}
        {isFadeVisible.left && (
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-slate-200/80 via-slate-200/40 to-transparent dark:from-slate-800/80 dark:via-slate-800/40 z-20"></div>
        )}
        {/* Headings Group */}
        <Button
          variant="secondary"
          // isActive={editor?.isActive("heading", { level: 1 }) ?? false}
          aria-label="Heading 1"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1Icon />
        </Button>
        <Button
          variant="secondary"
          // // isActive={editor?.isActive("heading", { level: 2 }) ?? false}
          aria-label="Heading 2"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2Icon />
        </Button>
        <Button
          variant="secondary"
          // // isActive={editor?.isActive("heading", { level: 3 }) ?? false}
          aria-label="Heading 3"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3Icon />
        </Button>
        <Button
          variant="secondary"
          // // isActive={editor?.isActive("heading", { level: 4 }) ?? false}
          aria-label="Heading 4"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 4 }).run()
          }
        >
          <Heading4Icon />
        </Button>

        {/* Text Formatting Group */}
        <Button
          variant="secondary"
          // // isActive={editor?.isActive("bold") ?? false}
          aria-label="Bold"
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <BoldIcon />
        </Button>
        <Button
          variant="secondary"
          // // isActive={editor?.isActive("italic") ?? false}
          aria-label="Italic"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon />
        </Button>
        <Button
          variant="secondary"
          // // isActive={editor?.isActive("strike") ?? false}
          aria-label="Strikethrough"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          <StrikethroughIcon />
        </Button>

        {/* Block Elements Group */}
        <Button
          variant="secondary"
          // // isActive={editor?.isActive("blockquote") ?? false}
          aria-label="Blockquote"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <QuoteIcon />
        </Button>
        <Button
          variant="secondary"
          // // isActive={editor?.isActive("codeBlock") ?? false}
          aria-label="Code block"
          onClick={() => editor?.chain().focus().setCodeBlock().run()}
        >
          <Code2Icon />
        </Button>

        {/* Lists Group */}
        <Button
          variant="secondary"
          // // isActive={editor?.isActive("orderedList") ?? false}
          aria-label="Numbered list"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrderedIcon />
        </Button>
        <Button
          variant="secondary"
          // // isActive={editor?.isActive("bulletList") ?? false}
          aria-label="Bulleted list"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <ListIcon />
        </Button>
        <Button
          variant="secondary"
          // // isActive={editor?.isActive("taskList") ?? false}
          aria-label="Task list"
          onClick={() => editor?.chain().focus().toggleTaskList().run()}
        >
          <CheckSquareIcon />
        </Button>

        {/* Media & Actions Group */}
        <Button
          variant="secondary"
          aria-label="Insert link"
          onClick={() => setIsUrlPromptOpen(true)}
        >
          <LinkIcon />
        </Button>
        <Button
          variant="secondary"
          aria-label="Insert image"
          onClick={() => setIsOpen(true)}
        >
          <ImageIcon />
        </Button>
        <Button
          variant="secondary"
          aria-label="Insert divider"
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        >
          <MinusIcon />
        </Button>
      </div>

      {/* Right fade effect */}
      {isFadeVisible.right && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-slate-200/80 via-slate-200/40 to-transparent dark:from-slate-800/80 dark:via-slate-800/40 z-20"></div>
      )}

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
                variant="default"
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
              <Button onClick={() => setIsUrlPromptOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  if (url) {
                    isLinkPreview
                      ? editor?.chain().setLinkPreview({ url: url }).run()
                      : editor?.chain().insertContent(`[${url}](${url})`).run();
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
                    editor?.chain().focus().setImage({ src: url, title }).run();
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
  );
};
export default EditorButtons;
