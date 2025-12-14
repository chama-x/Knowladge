"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Calculator } from 'lucide-react';

type ExamTipProps = {
    title: string;
    children: React.ReactNode;
};

export const ExamTip: React.FC<ExamTipProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block" ref={ref}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 text-xs font-bold text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-3 py-1.5 rounded-full hover:bg-[var(--color-accent)]/20 transition-colors"
            >
                <Calculator size={14} /> {title}
            </button>
            {isOpen && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 z-50 w-64 bg-[var(--color-card)] p-4 rounded-xl shadow-xl border-2 border-[var(--color-accent)]/20 text-left animate-in zoom-in duration-200">
                    <div className="flex justify-between items-start mb-2">
                        <h5 className="font-bold text-[var(--color-text)] text-sm">Exam Calculation</h5>
                        <button onClick={() => setIsOpen(false)} className="text-[var(--color-slate-400)] hover:text-[var(--color-slate-600)]">×</button>
                    </div>
                    <div className="text-xs text-[var(--color-slate-600)] leading-relaxed space-y-2">
                        {children}
                    </div>
                </div>
            )}
        </div>
    )
};
