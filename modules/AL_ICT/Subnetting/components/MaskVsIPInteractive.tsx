"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Binary, MapPin, Home, ArrowRight } from 'lucide-react';
import { ipToLong, longToIp } from '@/lib/utils/ip-math';

const DraggableOctet = ({ value, onChange, label }: { value: number, onChange: (v: number) => void, label: string }) => {
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const startVal = useRef(0);
    const ref = useRef<HTMLDivElement>(null);

    const handleStart = (clientX: number) => {
        setIsDragging(true);
        startX.current = clientX;
        startVal.current = value;
        document.body.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none';

        // Add global listeners
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleEnd);
    };

    const handleMove = useCallback((e: MouseEvent) => {
        const delta = e.clientX - startX.current;
        // Sensitivity: 2 pixels per 1 unit change
        const change = Math.floor(delta / 2);
        const newVal = Math.min(255, Math.max(0, startVal.current + change));
        onChange(newVal);
    }, [onChange]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        const delta = e.touches[0].clientX - startX.current;
        const change = Math.floor(delta / 2);
        const newVal = Math.min(255, Math.max(0, startVal.current + change));
        onChange(newVal);
    }, [onChange]);

    const handleEnd = useCallback(() => {
        setIsDragging(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleEnd);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleEnd);
    }, [handleMove, handleTouchMove]);

    return (
        <div
            ref={ref}
            onMouseDown={(e) => handleStart(e.clientX)}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            className={`
                relative cursor-ew-resize select-none touch-none group flex flex-col items-center justify-center p-2 rounded-xl transition-all
                ${isDragging ? 'bg-white/10 scale-110 ring-2 ring-white/20' : 'hover:bg-white/5'}
            `}
            title="Slide horizontally to change value"
        >
            <span className={`font-mono font-bold text-xl md:text-3xl tracking-tight transition-colors ${isDragging ? 'text-[var(--color-accent)]' : 'text-white group-hover:text-[var(--color-primary-light)]'}`}>
                {value}
            </span>
            {/* Hint line */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
    );
};

export const MaskVsIPInteractive = () => {
    const [cidr, setCidr] = useState(25);
    // Dynamic IP State
    const [ipBytes, setIpBytes] = useState([192, 168, 1, 10]);

    const ipBinary = ipBytes.map(byte => byte.toString(2).padStart(8, '0').split(''));

    const ipLong = ipToLong(ipBytes);
    const maskLong = 0xFFFFFFFF << (32 - cidr);
    const netLong = (ipLong & maskLong) >>> 0;
    const netIp = longToIp(netLong);
    const hostId = (ipLong & ~maskLong) >>> 0;

    const splitOctetIndex = Math.floor((cidr - 1) / 8);
    const splitOctetBinary = ipBinary[splitOctetIndex];

    const updateOctet = (index: number, val: number) => {
        const newIp = [...ipBytes];
        newIp[index] = val;
        setIpBytes(newIp);
    };

    return (
        <section id="ipvsmask" className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-3xl font-black text-[var(--color-text)] mb-4">4. The Dynamic Duo</h2>
                <p className="text-[var(--color-slate-500)] text-lg max-w-xl mx-auto">
                    The <strong className="text-[var(--color-primary)]">Network ID</strong> (Street) and <strong className="text-[var(--color-secondary)]">Host ID</strong> (House) are found by filtering the bits.
                </p>
                <p className="text-xs text-[var(--color-slate-400)] mt-2 font-bold uppercase tracking-widest animate-pulse">
                    Tip: Try sliding the decimal numbers!
                </p>
            </div>

            <div className="bg-[var(--color-card)] rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-[var(--color-card)]/50 flex flex-col items-center">

                <div className="relative w-full max-w-4xl mb-12">
                    <div className="flex justify-between items-end mb-4 px-2 text-xs font-bold text-[var(--color-slate-400)] uppercase tracking-widest hidden md:flex">
                        <span>Network Portion (Street)</span>
                        <span>Host Portion (House)</span>
                    </div>

                    {/* Interactive Bits Visualizer */}
                    <div className="bg-[#1F2437] rounded-3xl p-4 md:p-8 shadow-inner relative select-none w-full border border-slate-800 flex flex-col items-center">

                        {/* Bits Container - Fully Fluid */}
                        <div className="flex justify-between items-end w-full max-w-full gap-2 md:gap-8 px-1 md:px-4">
                            {ipBinary.map((bits, octetIndex) => (
                                <div key={octetIndex} className={`flex flex-col items-center gap-2 md:gap-4 transition-opacity duration-300 w-full ${octetIndex === splitOctetIndex ? 'opacity-100' : (octetIndex < splitOctetIndex ? 'opacity-90' : 'opacity-50')}`}>

                                    {/* Dynamic Draggable Octet */}
                                    <DraggableOctet
                                        value={ipBytes[octetIndex]}
                                        onChange={(v) => updateOctet(octetIndex, v)}
                                        label={`Octet ${octetIndex + 1}`}
                                    />

                                    <div className="flex justify-between w-full gap-[2px] md:gap-[5px]">
                                        {bits.map((bit, bitIndex) => {
                                            const globalIndex = (octetIndex * 8) + bitIndex;
                                            const isNet = globalIndex < cidr;
                                            const isBoundary = globalIndex === cidr - 1;

                                            return (
                                                <div key={bitIndex} className="relative group flex-1 flex justify-center">
                                                    {/* Hit Area for Click */}
                                                    <button
                                                        onClick={() => setCidr(globalIndex + 1)}
                                                        className={`
                                                            w-full h-6 sm:h-8 md:h-12 rounded-[2px] md:rounded-md transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95
                                                            ${isNet
                                                                ? 'bg-[var(--color-primary)] shadow-[0_0_8px_rgba(46,196,182,0.4)]'
                                                                : 'bg-slate-700 hover:bg-[var(--color-secondary)]'}
                                                        `}
                                                        title={`Bit ${globalIndex + 1}`}
                                                    />

                                                    {isBoundary && (
                                                        <div className="absolute top-[-6px] bottom-[-6px] right-[-2px] md:right-[-4px] w-[2px] md:w-[4px] bg-white z-20 pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-in fade-in zoom-in duration-300">
                                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-[#1F2437] text-[10px] md:text-xs font-black px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg whitespace-nowrap shadow-xl border-2 border-[var(--color-primary)]">
                                                                /{cidr}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Granular Slider Controls */}
                <div className="w-full max-w-xl mb-10 bg-[var(--color-slate-50)] p-4 rounded-2xl border border-[var(--color-slate-200)] flex items-center gap-4">
                    <button
                        onClick={() => setCidr(Math.max(8, cidr - 1))}
                        className="p-3 rounded-xl bg-white border border-[var(--color-slate-200)] shadow-sm hover:bg-[var(--color-slate-100)] active:translate-y-0.5 text-[var(--color-text)] font-bold transition-all"
                    >
                        -
                    </button>

                    <div className="flex-1 relative">
                        <input
                            type="range" min="8" max="30" value={cidr}
                            onChange={(e) => setCidr(parseInt(e.target.value))}
                            className="w-full h-8 bg-transparent cursor-pointer appearance-none relative z-10 opacity-0"
                        />
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-4 bg-[var(--color-slate-200)] rounded-full overflow-hidden pointer-events-none">
                            <div className="h-full bg-[var(--color-primary)] transition-all duration-100" style={{ width: `${((cidr - 8) / (30 - 8)) * 100}%` }}></div>
                        </div>
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white border-4 border-[var(--color-primary)] rounded-full shadow-lg pointer-events-none transition-all duration-100 flex items-center justify-center font-bold text-[8px] text-[var(--color-primary-dark)]"
                            style={{ left: `${((cidr - 8) / (30 - 8)) * 100}%`, transform: 'translate(-50%, -50%)' }}
                        >
                            <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full"></div>
                        </div>
                    </div>

                    <button
                        onClick={() => setCidr(Math.min(30, cidr + 1))}
                        className="p-3 rounded-xl bg-white border border-[var(--color-slate-200)] shadow-sm hover:bg-[var(--color-slate-100)] active:translate-y-0.5 text-[var(--color-text)] font-bold transition-all"
                    >
                        +
                    </button>

                    <div className="min-w-[50px] text-center font-black text-xl text-[var(--color-primary)]">
                        /{cidr}
                    </div>
                </div>

                <div className="w-full max-w-3xl bg-[var(--color-slate-50)] border border-[var(--color-slate-200)] rounded-3xl p-6 mb-8">
                    <div className="flex items-center gap-2 mb-4 text-[var(--color-text)] font-bold text-sm uppercase tracking-widest">
                        <Binary size={16} className="text-[var(--color-accent)]" /> Bitwise Logic: Octet {splitOctetIndex + 1}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1">
                            <div className="flex justify-between font-mono text-[10px] text-[var(--color-slate-400)] mb-1 px-1">
                                {[128, 64, 32, 16, 8, 4, 2, 1].map((v, i) => (
                                    <span key={i} className={`w-6 text-center ${i >= (cidr % 8 === 0 ? 8 : cidr % 8) ? 'text-[var(--color-secondary)] font-bold' : ''}`}>{v}</span>
                                ))}
                            </div>

                            <div className="relative">
                                {/* Binary Comparison Viz */}
                                <div className="flex justify-between bg-white p-3 rounded-xl border border-[var(--color-slate-200)] shadow-sm font-mono text-lg font-bold">
                                    {splitOctetBinary.map((bit, i) => {
                                        const isHostBit = (splitOctetIndex * 8) + i >= cidr;
                                        return (
                                            <div key={i} className="w-6 text-center flex flex-col items-center gap-1">
                                                <span className={isHostBit ? 'text-[var(--color-secondary)]' : 'text-[var(--color-primary)]'}>{bit}</span>
                                                <div className="h-px w-4 bg-[var(--color-slate-200)] my-1"></div>
                                                <span className={isHostBit ? 'text-[var(--color-slate-300)]' : 'text-[var(--color-primary)]'}>{isHostBit ? '0' : bit}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        <ArrowRight className="hidden md:block text-[var(--color-slate-300)]" />

                        <div className="text-center">
                            <div className="text-xs font-bold text-[var(--color-slate-400)] uppercase tracking-widest mb-1">Network Result</div>
                            <div className="text-3xl font-black text-[var(--color-primary)]">{longToIp(netLong).split('.')[splitOctetIndex]}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                    <div className="bg-[var(--color-primary-light)]/20 border-2 border-[var(--color-primary-light)] p-6 rounded-2xl flex items-center gap-4 transition-all hover:scale-105">
                        <div className="bg-[var(--color-primary)] p-3 rounded-xl text-white">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-[var(--color-primary-dark)] uppercase tracking-widest mb-1">Street Name (Network ID)</div>
                            <div className="text-xl md:text-2xl font-black text-[var(--color-text)] font-mono">{netIp}</div>
                        </div>
                    </div>

                    <div className="bg-[var(--color-secondary-light)]/20 border-2 border-[var(--color-secondary-light)] p-6 rounded-2xl flex items-center gap-4 transition-all hover:scale-105">
                        <div className="bg-[var(--color-secondary)] p-3 rounded-xl text-white">
                            <Home size={24} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-[var(--color-secondary-dark)] uppercase tracking-widest mb-1">House Number (Host ID)</div>
                            <div className="text-xl md:text-2xl font-black text-[var(--color-text)] font-mono">.{hostId}</div>
                        </div>
                    </div>
                </div>

            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 8px; /* Horizontal scrollbar height */
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #334155;
                    border-radius: 20px;
                }
            `}</style>
        </section>
    )
};
