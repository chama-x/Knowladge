"use client";
import React, { useState } from 'react';

export const FLSMInteractive = () => {
    const [cuts, setCuts] = useState(2);
    const [baseCidr, setBaseCidr] = useState(24);
    const numSubnets = Math.pow(2, cuts);

    const totalIPsInBase = Math.pow(2, 32 - baseCidr);
    const blockSize = totalIPsInBase / numSubnets;

    const blockColors = ['bg-[var(--color-primary)]', 'bg-[var(--color-secondary)]', 'bg-[var(--color-accent)]', 'bg-[#3B82F6]'];

    // Helper to format offsets based on CIDR context
    const formatOffset = (idx: number) => {
        const start = idx * blockSize;
        const end = (idx + 1) * blockSize - 1;

        if (baseCidr === 24) {
            // Simple single octet display
            return { start: `.${start}`, end: `.${end}` };
        } else {
            // /16 Display: Show 3rd and 4th octet values
            const s3 = Math.floor(start / 256);
            const s4 = start % 256;
            const e3 = Math.floor(end / 256);
            const e4 = end % 256;
            return { start: `.${s3}.${s4}`, end: `.${e3}.${e4}` };
        }
    };

    return (
        <section id="flsm" className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <div className="inline-block px-3 py-1 bg-[var(--color-primary)] text-white rounded-full text-xs font-bold mb-4 uppercase tracking-widest">Fixed Length</div>
                <h2 className="text-3xl md:text-4xl font-black text-[var(--color-text)] mb-4">6. Fixed Slicing (FLSM)</h2>
                <p className="text-[var(--color-slate-500)] text-lg max-w-xl mx-auto">FLSM means fairness. You start with a block and cut it into <strong className="text-[var(--color-accent)]">equal slices</strong>.</p>
            </div>

            <div className="bg-[var(--color-text)] rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden text-white">

                {/* SETTINGS TOGGLE */}
                <div className="absolute top-6 right-6 flex items-center gap-2 bg-[#1F2437] p-1 rounded-lg border border-white/10">
                    <button
                        onClick={() => setBaseCidr(24)}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${baseCidr === 24 ? 'bg-[var(--color-primary)] text-[#1F2437] shadow-sm' : 'text-[var(--color-slate-400)] hover:text-white'}`}
                    >
                        Class C (/24)
                    </button>
                    <button
                        onClick={() => setBaseCidr(16)}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${baseCidr === 16 ? 'bg-[var(--color-accent)] text-white shadow-sm' : 'text-[var(--color-slate-400)] hover:text-white'}`}
                    >
                        Class B (/16)
                    </button>
                </div>

                <div className="max-w-xl mx-auto mb-12 text-center mt-8">
                    <div className="flex justify-between items-end mb-4 px-2">
                        <div className="text-left">
                            <span className="block text-xs font-bold text-[var(--color-slate-400)] uppercase tracking-widest">Base</span>
                            <span className="text-xl font-mono font-bold text-[var(--color-primary)]">/{baseCidr}</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-4xl font-black text-[var(--color-accent)] mb-1">{cuts}</span>
                            <span className="text-[10px] font-bold text-[var(--color-slate-400)] uppercase">Bits Borrowed</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-xs font-bold text-[var(--color-slate-400)] uppercase tracking-widest">New</span>
                            <span className="text-xl font-mono font-bold text-[var(--color-accent)]">/{baseCidr + cuts}</span>
                        </div>
                    </div>
                    <input type="range" min="0" max="4" step="1" value={cuts} onChange={(e) => setCuts(parseInt(e.target.value))} className="w-full h-4 bg-[#1F2437] rounded-full appearance-none cursor-pointer accent-[var(--color-accent)] border border-white/10" />
                    <div className="flex justify-between px-1 mt-2 text-xs font-bold text-[var(--color-slate-500)] font-mono"><span>0 bits</span><span>4 bits</span></div>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between text-xs font-bold text-[var(--color-slate-400)] mb-2 uppercase tracking-widest">
                        <span>Total Block: {totalIPsInBase.toLocaleString()} Addresses</span>
                    </div>
                    <div className="relative w-full h-32 md:h-40 bg-slate-800 rounded-2xl overflow-hidden flex ring-4 ring-white/10 shadow-inner">
                        {Array.from({ length: numSubnets }).map((_, i) => {
                            const range = formatOffset(i);
                            return (
                                <div key={i} className={`h-full border-r border-slate-900/10 relative group transition-all duration-500 flex flex-col justify-between p-3 ${blockColors[i % blockColors.length]}`} style={{ width: `${100 / numSubnets}%` }}>
                                    <div className="flex justify-between text-[10px] md:text-xs font-mono font-bold text-white/90 mix-blend-overlay">
                                        <span>{range.start}</span>
                                        <span>{range.end}</span>
                                    </div>
                                    <div className="self-center font-black text-white/30 text-2xl md:text-4xl group-hover:text-white/60 transition-colors pointer-events-none select-none">{numSubnets <= 16 ? String.fromCharCode(65 + i) : ''}</div>
                                    <div className="text-center">
                                        <span className="inline-block bg-black/20 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap">{blockSize.toLocaleString()} IPs</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="relative w-full h-6 mt-2">
                        <div className="absolute top-0 left-0 w-px h-full bg-slate-500/50"></div>
                        <div className="absolute top-0 right-0 w-px h-full bg-slate-500/50"></div>
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-500/30"></div>
                        {Array.from({ length: numSubnets + 1 }).map((_, i) => { const pos = (i / numSubnets) * 100; return (<div key={i} className="absolute top-0 w-px h-3 bg-slate-500/50 transition-all duration-500" style={{ left: `${pos}%` }}></div>) })}
                    </div>
                </div>

                <div className="text-center flex flex-col gap-2">
                    <p className="text-lg">You sliced the block into <strong className="text-white">{numSubnets} continuous segments</strong>.</p>
                    <p className="text-sm text-[var(--color-slate-400)]">Notice how one ends exactly where the next begins. The first is usually the <strong className="text-[var(--color-primary)]">Gateway</strong>.</p>
                </div>
            </div>
        </section>
    );
};
