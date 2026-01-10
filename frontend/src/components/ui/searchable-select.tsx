'use client';

import { useState, useRef, useEffect, useMemo } from 'react';

interface Option {
    value: string | number;
    label: string;
    subLabel?: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = 'Chọn...',
    disabled = false,
    className = ''
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedOption = options.find(o => o.value.toString() === value.toString());

    const filteredOptions = useMemo(() => {
        if (!search.trim()) return options;
        const searchLower = search.toLowerCase();
        return options.filter(o => 
            o.label.toLowerCase().includes(searchLower) ||
            o.subLabel?.toLowerCase().includes(searchLower)
        );
    }, [options, search]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (option: Option) => {
        onChange(option.value);
        setIsOpen(false);
        setSearch('');
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setSearch('');
    };

    const displayValue = isOpen 
        ? search 
        : selectedOption 
            ? `${selectedOption.label}${selectedOption.subLabel ? ` - ${selectedOption.subLabel}` : ''}`
            : '';

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <div className={`relative flex items-center border rounded-lg transition
                ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-gray-400'}`}>
                <svg className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    ref={inputRef}
                    type="text"
                    value={displayValue}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={() => !disabled && setIsOpen(true)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full pl-9 pr-8 py-2 text-sm bg-transparent outline-none disabled:cursor-not-allowed"
                />
                {(selectedOption || search) && !disabled && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-8 p-1 text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className="absolute right-2 p-1 text-gray-400"
                >
                    <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredOptions.length === 0 ? (
                        <div className="px-3 py-4 text-sm text-gray-500 text-center">
                            Không tìm thấy kết quả
                        </div>
                    ) : (
                        filteredOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelect(option)}
                                className={`w-full px-3 py-2 text-left text-sm hover:bg-blue-50 transition
                                    ${option.value.toString() === value.toString() ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}`}
                            >
                                <div className="font-medium">{option.label}</div>
                                {option.subLabel && (
                                    <div className="text-xs text-gray-500">{option.subLabel}</div>
                                )}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
