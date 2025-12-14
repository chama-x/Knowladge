"use client";
import React, { useState } from 'react';
import { Zap } from 'lucide-react';

const AdaptiveBar = ({ color, darkColor, heightPct, value, label, powerBase, powerExp }: any) => {
    // Note: color prop is expected to be a Tailwind text class e.g. "text-[var(--color-accent)]"
    // darkColor is a hex/var string for background style

    // We need to parse the color prop to extract the variable if we want to use it for background opacity
    // For simplicity in this port, we will stick to the logic provided but adapt classes.

    const Content = ({ textColor, subColor }: any) => (
        <div className="flex flex-col items-center pb-4 min-w-[100px]">
            <span className={`text-3xl font-black ${textColor}`}>{value}</span>
            <span className={`text-[10px] font-bold uppercase ${subColor}`}>{label}</span>
            <span className={`text-xs ${textColor === 'text-white' ? 'bg-white/20' : 'bg-[var(--color-slate-200)]'} px-2 py-1 rounded mt-2 font-mono ${textColor}`}>
                {powerBase}<sup>{powerExp}</sup>
            </span>
        </div>
    );

    return (
        <div className="relative w-full md:w-32 h-full flex items-end">
            <div className="absolute bottom-0 w-full flex justify-center z-0">
                <Content textColor={color} subColor="opacity-60 text-[var(--color-slate-400)]" />
            </div>
            <div
                className="relative w-full rounded-t-2xl shadow-lg flex flex-col justify-end items-center z-10 overflow-hidden transition-all duration-500 ease-out"
                style={{ height: `${heightPct}%`, backgroundColor: darkColor }}
            >
                <div className="w-full flex justify-center absolute bottom-0">
                    <Content textColor="text-white" subColor="opacity-80 text-white" />
                </div>
            </div>
        </div>
    )
}

export const TradeOffInteractive = () => {
    const [balance, setBalance] = useState(50);
    const step = Math.round((balance / 100) * 6); // 0 to 6
    const currentCidr = 24 + step;
    const subnets = Math.pow(2, step);
    const hosts = Math.pow(2, 32 - currentCidr);

    return (
        <section id="tradeoff" className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-[var(--color-text)] mb-4">5. The Great Trade-off</h2>
                <p className="text-[var(--color-slate-500)] text-lg max-w-xl mx-auto">You can't have it all. To create more <span className="text-[var(--color-accent)] font-bold">Subnets</span> (Rooms), you must shrink the <span className="text-[var(--color-secondary)] font-bold">Hosts</span> (People) in each room.</p>
            </div>
            <div className="bg-[var(--color-card)] rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-[var(--color-card)]/50">
                <div className="flex flex-col md:flex-row justify-center items-end gap-4 h-64 mb-12 relative px-4 md:px-12">
                    <AdaptiveBar
                        color="text-[var(--color-accent)]"
                        darkColor="var(--color-accent)"
                        heightPct={(step / 6) * 80 + 20}
                        value={subnets}
                        label="Subnets"
                        powerBase="2"
                        powerExp={step}
                    />
                    <div className="text-[var(--color-slate-300)] pb-2 hidden md:block"><Zap size={32} /></div>
                    <AdaptiveBar
                        color="text-[var(--color-secondary)]"
                        darkColor="var(--color-secondary)"
                        heightPct={(1 - step / 6) * 80 + 20}
                        value={hosts}
                        label="Total IPs"
                        powerBase="2"
                        powerExp={8 - step}
                    />
                </div>

                <div className="max-w-2xl mx-auto text-center">
                    <div className="mb-8 p-4 bg-[#1F2437] rounded-xl text-white font-mono flex flex-col items-center shadow-inner">
                        <div className="text-xs text-[var(--color-slate-400)] mb-2 uppercase tracking-widest">Borrowing Bits from Last Octet</div>
                        <div className="flex gap-2 text-xl md:text-3xl font-bold items-center flex-wrap justify-center">
                            <div className="relative group cursor-help">
                                <span className="text-[var(--color-slate-500)]">192.168.1.</span>
                            </div>
                            <div className="flex">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <span key={i} className={`${i < step ? 'text-[var(--color-accent)]' : 'text-[var(--color-secondary)]'}`}>0</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-4 mt-2 text-xs">
                            <span className="text-[var(--color-accent)]">● Borrowed ({step} bits)</span>
                            <span className="text-[var(--color-secondary)]">● Hosts ({8 - step} bits)</span>
                        </div>
                    </div>

                    <input type="range" min="0" max="6" step="1" value={step} onChange={(e) => setBalance((parseInt(e.target.value) / 6) * 100)} className="w-full h-4 bg-[var(--color-slate-100)] rounded-full appearance-none cursor-pointer accent-[var(--color-text)] mb-4" />
                    <p className="text-[var(--color-slate-500)] font-bold">Slide to Borrow Bits: <span className="text-[var(--color-text)] font-black">/{currentCidr}</span></p>
                    <p className="text-xs text-[var(--color-slate-400)] mt-2">Formula: Usable Hosts = Total IPs - 2 (Network + Broadcast)</p>
                </div>
            </div>
        </section>
    );
};
