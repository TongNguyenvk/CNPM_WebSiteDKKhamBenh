'use client';

import { useRef, useEffect, useState } from 'react';

interface SimpleEditorProps {
    value: string;
    onChange: (content: string) => void;
}

export default function SimpleEditor({ value, onChange }: SimpleEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (editorRef.current && !isEditing) {
            editorRef.current.innerHTML = value;
        }
    }, [value, isEditing]);

    const handleInput = () => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML;
            onChange(content);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.execCommand('insertLineBreak');
        }
    };

    const toggleBold = () => {
        document.execCommand('bold', false);
        handleInput();
    };

    const toggleItalic = () => {
        document.execCommand('italic', false);
        handleInput();
    };

    const toggleUnderline = () => {
        document.execCommand('underline', false);
        handleInput();
    };

    const toggleList = () => {
        document.execCommand('insertUnorderedList', false);
        handleInput();
    };

    return (
        <div className="simple-editor">
            <style jsx global>{`
                .simple-editor {
                    border: 1px solid #e2e8f0;
                    border-radius: 0.375rem;
                    background: white;
                }
                .editor-toolbar {
                    padding: 0.5rem;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    gap: 0.5rem;
                }
                .editor-toolbar button {
                    padding: 0.25rem 0.5rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.25rem;
                    background: white;
                    cursor: pointer;
                    font-size: 0.875rem;
                }
                .editor-toolbar button:hover {
                    background: #f7fafc;
                }
                .editor-content {
                    min-height: 150px;
                    padding: 1rem;
                    outline: none;
                }
                .editor-content:focus {
                    outline: none;
                }
                .editor-content ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                }
            `}</style>

            <div className="editor-toolbar">
                <button onClick={toggleBold} title="In đậm">
                    <strong>B</strong>
                </button>
                <button onClick={toggleItalic} title="In nghiêng">
                    <em>I</em>
                </button>
                <button onClick={toggleUnderline} title="Gạch chân">
                    <u>U</u>
                </button>
                <button onClick={toggleList} title="Danh sách">
                    • List
                </button>
            </div>

            <div
                ref={editorRef}
                className="editor-content"
                contentEditable
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsEditing(true)}
                onBlur={() => setIsEditing(false)}
                suppressContentEditableWarning
            />
        </div>
    );
} 