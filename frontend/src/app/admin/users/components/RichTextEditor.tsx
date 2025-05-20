'use client';

import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const editorRef = useRef<any>(null);

    return (
        <div className="rich-text-editor">
            <Editor
                apiKey="your-api-key-here" // Bạn có thể đăng ký key miễn phí tại https://www.tiny.cloud/
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={value}
                init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
                        'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'table', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist | ' +
                        'removeformat',
                    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }'
                }}
                onEditorChange={(content) => {
                    onChange(content);
                }}
            />
        </div>
    );
} 