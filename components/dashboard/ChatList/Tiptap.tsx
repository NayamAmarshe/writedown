import { IChannelData } from "@/types/utils/firebaseOperations";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface TiptapProps {
  channelData: IChannelData;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  clearSwitch?: boolean;
  setClearSwitch?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Tiptap = ({
  setInput,
  input,
  clearSwitch,
  setClearSwitch,
}: TiptapProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: input,
    editorProps: {
      attributes: {
        class:
          "h-full focus:outline-none w-full border-2 rounded-xl p-2 prose max-w-none border-gray-200 py-3 px-4 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 prose-sm md:prose-base lg:prose-lg",
      },
    },
    onUpdate: ({ editor }) => {
      setInput(editor.getHTML());
    },
    autofocus: false,
  });

  useEffect(() => {
    if (!setClearSwitch || !clearSwitch) return;
    editor?.commands.setContent("");
    setClearSwitch(false);
  }, [clearSwitch]);

  return (
    <EditorContent editor={editor} className="h-full w-full overflow-y-auto" />
  );
};

export default Tiptap;
