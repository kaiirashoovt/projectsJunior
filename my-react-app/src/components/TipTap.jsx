import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { Bold, Italic, Strikethrough, Link as LinkIcon, List, ListOrdered, Quote } from 'lucide-react';

const Tiptap = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Placeholder.configure({ placeholder: 'Расскажите о себе...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <>
      <div className="toolbar flex space-x-2 mb-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'active' : ''}
          aria-label="Жирный"
        >
          <Bold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'active' : ''}
          aria-label="Курсив"
        >
          <Italic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'active' : ''}
          aria-label="Зачеркнутый"
        >
          <Strikethrough />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'active' : ''}
          aria-label="Маркированный список"
        >
          <List />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'active' : ''}
          aria-label="Нумерованный список"
        >
          <ListOrdered />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'active' : ''}
          aria-label="Цитата"
        >
          <Quote />
        </button>
        {/* Для вставки ссылки можно сделать кастомный модал */}
      </div>
      <EditorContent editor={editor} className="border border-gray-700 rounded p-4 min-h-[120px]" />
      <style jsx>{`
        .toolbar button {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #ccc;
          transition: color 0.2s;
        }
        .toolbar button.active,
        .toolbar button:hover {
          color: #a855f7; /* purple */
        }
      `}</style>
    </>
  );
};

export default Tiptap;
