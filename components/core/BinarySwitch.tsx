"use client";
import React from 'react';

type BinarySwitchProps = {
    value: number;
    active: boolean;
    onClick: () => void;
};

export const BinarySwitch: React.FC<BinarySwitchProps> = ({ value, active, onClick }) => (
    <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] font-bold text-slate-400 font-mono">{value}</span>
        <button
            onClick={onClick}
            className={`group relative flex flex-col items-center justify-end w-12 h-20 md:w-14 md:h-24 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/30 ${active ? 'translate-y-0' : 'translate-y-2'}`}
            aria-label={`Toggle bit value ${value}`}
            aria-pressed={active}
        >
            <div className={`absolute inset-0 rounded-2xl shadow-xl transition-all duration-200 border-2 ${active ? 'bg-[var(--color-primary)] border-[var(--color-primary)] shadow-[0_6px_0_var(--color-primary-dark)]' : 'bg-white border-slate-200 shadow-[0_6px_0_#cbd5e1]'}`}></div>
            <span className={`relative z-10 mb-6 text-xl md:text-2xl font-black transition-colors ${active ? 'text-white' : 'text-slate-300'}`}>{active ? '1' : '0'}</span>
        </button>
    </div>
);
