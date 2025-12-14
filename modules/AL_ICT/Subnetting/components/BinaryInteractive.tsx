"use client";
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useBinaryLogic } from '../hooks/useBinaryLogic';
import { BinarySwitch } from '@/components/core/BinarySwitch';
import { ExamTip } from '@/components/core/ExamTip';

export const BinaryInteractive = () => {
    const { byte, isBitOn, toggleBit, reset } = useBinaryLogic();

    return (
        <section id="binary" className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-[var(--color-text)] mb-4">1. The Magic Switches</h2>
                <p className="text-[var(--color-slate-500)] text-lg max-w-xl mx-auto">Computers use 8 tiny switches called an <strong className="text-[var(--color-primary)]">Octet</strong>.</p>
            </div>
            <div className="bg-[var(--color-card)] rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-[var(--color-card)]/50 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(var(--color-text) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="relative mb-12 group cursor-pointer" onClick={reset} title="Click to Reset">
                        <div className="text-[8rem] leading-none font-black text-[var(--color-text)] tabular-nums tracking-tighter transition-all duration-300">{byte}</div>
                        <span className="absolute -right-8 top-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-slate-300)]"><RefreshCw size={24} /></span>
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4 mb-8">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (<BinarySwitch key={i} value={Math.pow(2, 7 - i)} active={isBitOn(i)} onClick={() => toggleBit(i)} />))}
                    </div>

                    <ExamTip title="How to Count">
                        <p>1. Write powers of 2: <strong>128, 64, 32, 16, 8, 4, 2, 1</strong></p>
                        <p>2. If switch is ON (1), add the number.</p>
                        <p>Example: 10000001 = 128 + 1 = 129</p>
                    </ExamTip>
                </div>
            </div>
        </section>
    );
};
