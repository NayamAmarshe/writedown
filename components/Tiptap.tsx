import { IChannelData } from "@/types/utils/firebaseOperations";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TiptapProps {
  channelData: IChannelData;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}

const Tiptap = ({ channelData, setInput, input }: TiptapProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: input,
    editorProps: {
      attributes: {
        class:
          "h-full focus:outline-none w-full border-2 rounded-xl p-2 prose max-w-none border-gray-200 py-3 px-4 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400",
      },
    },
    onUpdate: ({ editor }) => {
      setInput(editor.getHTML());
    },
    autofocus: true,
  });

  return (
    <EditorContent
      editor={editor}
      className="max-h-96 w-full overflow-y-auto"
    />
  );
};

export default Tiptap;
