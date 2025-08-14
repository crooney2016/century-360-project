import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "./cn";
import Icon from "@/icons/Icon";

export interface EditorProps {
  content?: string;
  onChange?: (content: string) => void;
  className?: string;
  placeholder?: string;
}

export const Editor = ({ content = "", onChange, className }: EditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn("prose prose-sm max-w-none focus:outline-none", className),
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md">
      <div className="border-b bg-gray-50 p-2 flex gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("p-2 rounded hover:bg-gray-200", editor.isActive("bold") && "bg-gray-200")}
        >
          <Icon name="bold" className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "p-2 rounded hover:bg-gray-200",
            editor.isActive("italic") && "bg-gray-200"
          )}
        >
          <Icon name="italic" className="w-4 h-4" />
        </button>
      </div>
      <EditorContent editor={editor} className="p-3" />
    </div>
  );
};
