'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Tạo một component wrapper đơn giản
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => (
        <div className="h-48 mb-12 border border-gray-300 rounded-md p-4 bg-white">
            Đang tải trình soạn thảo...
        </div>
    ),
});

interface QuillEditorProps {
    value: string;
    onChange: (content: string, delta: any, source: string, editor: any) => void;
}

export default function QuillEditor({ value, onChange }: QuillEditorProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ]
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline',
        'list', 'bullet',
        'link'
    ];

    if (!mounted) {
        return (
            <div className="h-48 mb-12 border border-gray-300 rounded-md p-4 bg-white">
                Đang tải trình soạn thảo...
            </div>
        );
    }

    return (
        <div className="quill-editor">
            <style jsx global>{`
                .quill-editor .ql-container {
                    border-bottom-left-radius: 0.375rem;
                    border-bottom-right-radius: 0.375rem;
                    background: white;
                    min-height: 150px;
                }
                .quill-editor .ql-toolbar {
                    border-top-left-radius: 0.375rem;
                    border-top-right-radius: 0.375rem;
                    background: white;
                }
                .quill-editor .ql-editor {
                    min-height: 150px;
                }
            `}</style>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                className="h-48 mb-12"
            />
        </div>
    );
} 