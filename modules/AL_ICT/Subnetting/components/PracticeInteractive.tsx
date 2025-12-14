"use client";
import React, { useState } from 'react';
import {
    Check, ArrowRight, Trophy, Scissors, Box, Train,
    Grid, Layout, ArrowDown, ChevronRight, RefreshCw,
    Eraser, CheckCircle2, AlertCircle, Sparkles, Zap
} from 'lucide-react';
import { getIpBinary } from '@/lib/utils/ip-math';

// --- SHARED SHELL COMPONENT ---
const GameShell = ({ active, title, subtitle, color, icon: Icon, children, footer }: any) => {
    if (!active) return null;
    return (
        <div className="w-full max-w-5xl mx-auto min-h-[700px] flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-8">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider mb-4 shadow-sm bg-white border border-slate-100 ${color}`}>
                    <Icon size={16} /> <span>{title}</span>
                </div>
                <div className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
                    {subtitle}
                </div>
            </div>
            <div className="flex-1 bg-white rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border-2 border-slate-50 p-6 md:p-10 relative overflow-hidden flex flex-col">
                {children}
            </div>
            {footer && <div className="mt-8 flex justify-center text-center w-full">{footer}</div>}
        </div>
    )
}

// --- PHASE 1: CAKE SLICER ---
const CakeSlicer = ({ onComplete }: { onComplete: () => void }) => {
    const [mask, setMask] = useState(24);
    const rootCidr = 24;
    const subnetBits = mask - rootCidr;
    const subnetsCreated = Math.pow(2, subnetBits);
    const hostBits = 32 - mask;
    const hostsPerSubnet = Math.pow(2, hostBits) - 2;
    const target = { subnets: 6, hosts: 25 };
    const isSuccess = subnetsCreated >= target.subnets && hostsPerSubnet >= target.hosts;

    return (
        <GameShell
            active={true}
            title="Phase 1: Partitioning"
            color="text-orange-500"
            icon={Scissors}
            subtitle={<span>One block <strong>192.168.100.0/24</strong>. Calculate slices for <strong>6 Subnets</strong> (25 Hosts each).</span>}
            footer={
                <button onClick={onComplete} disabled={!isSuccess} className={`px-10 py-4 rounded-full font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 ${isSuccess ? 'bg-[#FF9F1C] text-white shadow-orange-200' : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'}`}>
                    CONFIRM SLICE <Scissors className="rotate-[-45deg]" />
                </button>
            }
        >
            <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
                <div className="w-full h-32 bg-[#CBF3F0] rounded-3xl flex relative overflow-hidden mb-10 ring-8 ring-slate-50 shadow-inner">
                    <div className="absolute inset-0 flex">
                        {Array.from({ length: subnetsCreated }).map((_, i) => (
                            <div key={i} className="h-full border-r border-white/40 bg-[#2EC4B6] transition-all duration-300" style={{ flex: 1, opacity: i % 2 === 0 ? 0.9 : 1 }}>
                                {subnetsCreated <= 8 && (<div className="h-full flex items-center justify-center text-white/50 font-bold text-xs md:text-sm -rotate-90 md:rotate-0">S{i + 1}</div>)}
                            </div>
                        ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-white px-6 py-3 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Current Mask</span>
                            <span className="text-3xl font-black text-[#011627]">/{mask}</span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 md:gap-8 w-full mb-10">
                    <div className={`p-6 rounded-3xl border-2 transition-all text-center ${subnetsCreated >= target.subnets ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-100'}`}>
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Subnets</div>
                        <div className={`text-4xl font-black ${subnetsCreated >= target.subnets ? 'text-green-600' : 'text-red-400'}`}>{subnetsCreated}</div>
                        <div className="text-sm font-bold text-slate-400 mt-2">Target: 6+</div>
                    </div>
                    <div className={`p-6 rounded-3xl border-2 transition-all text-center ${hostsPerSubnet >= target.hosts ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-100'}`}>
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Hosts / Sub</div>
                        <div className={`text-4xl font-black ${hostsPerSubnet >= target.hosts ? 'text-green-600' : 'text-orange-400'}`}>{hostsPerSubnet}</div>
                        <div className="text-sm font-bold text-slate-400 mt-2">Target: 25+</div>
                    </div>
                </div>
                <div className="w-full bg-slate-50 p-6 rounded-3xl">
                    <input type="range" min="24" max="30" step="1" value={mask} onChange={(e) => setMask(parseInt(e.target.value))} className="w-full h-4 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#FF9F1C]" />
                    <div className="flex justify-between text-xs font-bold text-slate-400 mt-4 px-1">
                        {[24, 25, 26, 27, 28, 29, 30].map(m => (<span key={m} className={m === mask ? 'text-[#FF9F1C] scale-125 transition-transform' : ''}>/{m}</span>))}
                    </div>
                </div>
            </div>
        </GameShell>
    );
}

// --- PHASE 2: SORTING TRAIN ---
const SortingTrain = ({ onComplete }: { onComplete: () => void }) => {
    const [cars, setCars] = useState([
        { id: 'Acc', label: 'Accounts', hosts: 10, size: 16, cidr: 28, color: 'bg-purple-500' },
        { id: 'Eng', label: 'Engineer', hosts: 50, size: 64, cidr: 26, color: 'bg-blue-500' },
        { id: 'Sal', label: 'Sales', hosts: 20, size: 32, cidr: 27, color: 'bg-teal-500' },
    ]);
    const move = (i: number, dir: number) => {
        if (i + dir < 0 || i + dir >= cars.length) return;
        const n = [...cars];
        [n[i], n[i + dir]] = [n[i + dir], n[i]];
        setCars(n);
    };
    const isCorrect = cars[0].cidr === 26 && cars[1].cidr === 27 && cars[2].cidr === 28;

    return (
        <GameShell
            active={true}
            title="Phase 2: Optimization"
            color="text-teal-500"
            icon={Train}
            subtitle={<span>Order the departments by size (Largest to Smallest) to prevent IP gaps.</span>}
            footer={isCorrect ? (
                <button onClick={onComplete} className="bg-[#2EC4B6] text-white px-10 py-4 rounded-full font-black text-lg shadow-xl shadow-teal-200 hover:scale-105 transition-all flex items-center gap-2 animate-bounce">DISPATCH TRAIN <Train className="ml-1" /></button>
            ) : (<div className="text-slate-400 font-bold bg-slate-100 px-6 py-3 rounded-full flex items-center gap-2"><AlertCircle size={16} /> Align the blocks...</div>)
            }
        >
            <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className="absolute w-full h-4 bg-slate-100 rounded-full"></div>
                <div className="flex items-end justify-center gap-2 md:gap-4 w-full relative z-10 h-48">
                    {cars.map((car, i) => (
                        <div key={car.id} className="group relative flex flex-col items-center justify-end h-full transition-all duration-500">
                            <div className="absolute -top-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <button onClick={() => move(i, -1)} className="p-2 bg-white shadow-md rounded-full text-slate-400 hover:text-black"><ArrowRight className="rotate-180" size={14} /></button>
                                <button onClick={() => move(i, 1)} className="p-2 bg-white shadow-md rounded-full text-slate-400 hover:text-black"><ArrowRight size={14} /></button>
                            </div>
                            <div style={{ height: 80 + car.size }} className={`${car.color} w-[100px] rounded-2xl shadow-xl border-[3px] border-white flex flex-col items-center justify-center text-white relative`}>
                                <span className="text-xs font-bold uppercase opacity-80 mb-1">{car.label}</span>
                                <span className="text-3xl font-black">/{car.cidr}</span>
                                <span className="text-[10px] font-bold mt-1 bg-black/20 px-2 py-0.5 rounded text-white/90">{car.hosts} IPs</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </GameShell>
    )
}

// --- PHASE 3: THE PROTOCOL EXAM (Simplified "Anchor Points") ---
const FullExamTable = ({ onComplete }: { onComplete: () => void }) => {
    // Problem: 4 subnets of /27 (32 size). 
    // Networks: 0, 32, 64, 96.
    // Broadcasts: 31, 63, 95, 127.

    // We treat "last octet" as the token to reduce reading.
    const prefix = "192.248.154.";

    // Rows Def
    const rows = [
        { id: 'S001', net: '0', cast: '31', range: '1 - 30' },
        { id: 'S002', net: '32', cast: '63', range: '33 - 62' },
        { id: 'S003', net: '64', cast: '95', range: '65 - 94' },
        { id: 'S004', net: '96', cast: '127', range: '97 - 126' },
    ];

    // State: What has the user placed? Key: "rowID-type" (type=net|cast), value=octet string
    const [placements, setPlacements] = useState<Record<string, string>>({});
    const [selectedChip, setSelectedChip] = useState<{ val: string, type: 'net' | 'cast' } | null>(null);

    // Available Pools
    // Network IDs (Start of block)
    const netOptions = ['0', '32', '64', '96'];
    // Broadcasts (End of block)
    const castOptions = ['31', '63', '95', '127'];

    const handleSlotClick = (rowId: string, type: 'net' | 'cast') => {
        // If holding a chip matching the slot type, place it
        if (selectedChip && selectedChip.type === type) {
            setPlacements(prev => ({ ...prev, [`${rowId}-${type}`]: selectedChip.val }));
            setSelectedChip(null);
        } else if (!selectedChip && placements[`${rowId}-${type}`]) {
            // Pick up
            const val = placements[`${rowId}-${type}`];
            setPlacements(prev => {
                const n = { ...prev };
                delete n[`${rowId}-${type}`];
                return n;
            });
            setSelectedChip({ val, type });
        }
    };

    // Calculate completion
    const isReady = Object.keys(placements).length === 8; // 4 nets + 4 casts

    return (
        <GameShell
            active={true}
            title="Phase 3: Protocol Exam"
            color="text-purple-600"
            icon={Grid}
            subtitle={
                <span>
                    Identify the <strong>Anchors</strong> (Network ID & Broadcast).
                    <br />The Usable Range will be auto-calculated.
                </span>
            }
            footer={
                isReady ? (
                    <button onClick={onComplete} className="bg-purple-600 text-white px-12 py-4 rounded-full font-black text-lg shadow-xl hover:scale-105 transition-all animate-bounce flex items-center gap-2">
                        CONFIRM PROTOCOL <CheckCircle2 />
                    </button>
                ) : (
                    <div className="text-slate-400 font-bold bg-slate-100 px-6 py-3 rounded-full animate-pulse">
                        Place all 8 Anchor Points
                    </div>
                )
            }
        >
            <div className="flex flex-col gap-8 h-full">
                {/* TABLE */}
                <div className="flex-1 overflow-x-auto rounded-3xl border-2 border-slate-100 shadow-sm relative">
                    <div className="min-w-[600px] bg-slate-50/50">
                        {/* Headers */}
                        <div className="grid grid-cols-[80px_1fr_1.5fr_1fr] border-b border-slate-200 bg-white sticky top-0 z-10">
                            <div className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Subnet</div>
                            <div className="p-4 text-xs font-black text-blue-500 uppercase tracking-widest text-center border-l border-slate-100">Network ID</div>
                            <div className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center border-l border-slate-100">Usable Range</div>
                            <div className="p-4 text-xs font-black text-red-500 uppercase tracking-widest text-center border-l border-slate-100">Broadcast</div>
                        </div>

                        {rows.map((row) => {
                            const netVal = placements[`${row.id}-net`];
                            const castVal = placements[`${row.id}-cast`];
                            const isRowComplete = netVal === row.net && castVal === row.cast;

                            return (
                                <div key={row.id} className="grid grid-cols-[80px_1fr_1.5fr_1fr] border-b border-white hover:bg-white transition-colors group">
                                    <div className="p-4 font-black text-slate-600 flex items-center justify-center bg-slate-50 group-hover:bg-slate-100">{row.id}</div>

                                    {/* Network Slot */}
                                    <div className="p-3 border-l border-slate-100 flex items-center justify-center">
                                        <button
                                            onClick={() => handleSlotClick(row.id, 'net')}
                                            className={`
                                                w-full h-12 rounded-xl flex items-center justify-center font-mono font-bold transition-all relative
                                                ${netVal
                                                    ? (netVal === row.net ? 'bg-blue-100 text-blue-700 border-2 border-blue-200' : 'bg-red-50 text-red-500 border-2 border-red-200 line-through')
                                                    : (selectedChip?.type === 'net' ? 'bg-blue-50 border-2 border-dashed border-blue-300 animate-pulse' : 'bg-white border border-slate-200 text-slate-300')}
                                            `}
                                        >
                                            {netVal ? `${prefix}${netVal}` : ''}
                                        </button>
                                    </div>

                                    {/* Range (Auto-Calc) */}
                                    <div className="p-3 border-l border-slate-100 flex items-center justify-center">
                                        <div className={`
                                            w-full h-12 rounded-xl flex items-center justify-center font-mono text-sm font-bold transition-all
                                            ${isRowComplete
                                                ? 'bg-green-100 text-green-700 border-2 border-green-200 shadow-sm'
                                                : 'bg-slate-50 text-slate-300 border border-transparent'}
                                        `}>
                                            {isRowComplete ? (
                                                <span className="flex items-center gap-2 animate-in zoom-in">
                                                    <Sparkles size={12} /> {prefix}{row.range}
                                                </span>
                                            ) : (
                                                <span className="text-xs">Waiting for anchors...</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Broadcast Slot */}
                                    <div className="p-3 border-l border-slate-100 flex items-center justify-center">
                                        <button
                                            onClick={() => handleSlotClick(row.id, 'cast')}
                                            className={`
                                                w-full h-12 rounded-xl flex items-center justify-center font-mono font-bold transition-all relative
                                                ${castVal
                                                    ? (castVal === row.cast ? 'bg-red-100 text-red-700 border-2 border-red-200' : 'bg-red-50 text-red-500 border-2 border-red-200 line-through')
                                                    : (selectedChip?.type === 'cast' ? 'bg-red-50 border-2 border-dashed border-red-300 animate-pulse' : 'bg-white border border-slate-200 text-slate-300')}
                                            `}
                                        >
                                            {castVal ? `${prefix}${castVal}` : ''}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* INVENTORY */}
                <div className="flex flex-col md:flex-row gap-8 items-start justify-center p-4 bg-slate-50 rounded-3xl border border-slate-100">

                    {/* Blue Pool */}
                    <div className="flex-1 w-full text-center">
                        <div className="text-xs font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                            <Zap size={12} /> Network Anchors (Start)
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            {netOptions.filter(v => !Object.values(placements).includes(v)).map(v => (
                                <button
                                    key={v}
                                    onClick={() => setSelectedChip({ val: v, type: 'net' })}
                                    disabled={selectedChip?.val === v}
                                    className={`
                                        px-4 py-3 rounded-xl font-mono font-bold shadow-sm border-b-4 active:border-b-0 active:translate-y-1 transition-all min-w-[60px]
                                        ${selectedChip?.val === v
                                            ? 'bg-blue-600 text-white border-blue-800 scale-95 ring-2 ring-offset-2 ring-blue-400'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'}
                                    `}
                                >
                                    .{v}
                                </button>
                            ))}
                            {netOptions.every(v => Object.values(placements).includes(v)) && <div className="text-slate-300 italic text-sm py-2">All networks placed</div>}
                        </div>
                    </div>

                    <div className="w-px h-24 bg-slate-200 hidden md:block"></div>

                    {/* Red Pool */}
                    <div className="flex-1 w-full text-center">
                        <div className="text-xs font-black text-red-500 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                            <Zap size={12} /> Broadcast Anchors (End)
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            {castOptions.filter(v => !Object.values(placements).includes(v)).map(v => (
                                <button
                                    key={v}
                                    onClick={() => setSelectedChip({ val: v, type: 'cast' })}
                                    disabled={selectedChip?.val === v}
                                    className={`
                                        px-4 py-3 rounded-xl font-mono font-bold shadow-sm border-b-4 active:border-b-0 active:translate-y-1 transition-all min-w-[60px]
                                        ${selectedChip?.val === v
                                            ? 'bg-red-500 text-white border-red-700 scale-95 ring-2 ring-offset-2 ring-red-400'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:text-red-600'}
                                    `}
                                >
                                    .{v}
                                </button>
                            ))}
                            {castOptions.every(v => Object.values(placements).includes(v)) && <div className="text-slate-300 italic text-sm py-2">All broadcasts placed</div>}
                        </div>
                    </div>
                </div>

                {selectedChip && <div className="text-center text-xs font-bold text-slate-400 animate-pulse">Tap a {selectedChip.type === 'net' ? 'Network' : 'Broadcast'} slot above</div>}
            </div>
        </GameShell>
    )
}

// --- MAIN CONTAINER ---
export const PracticeInteractive = () => {
    const [step, setStep] = useState(0);

    return (
        <section className="w-full py-16 px-4 bg-slate-50/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex justify-center mb-16">
                    <div className="bg-white p-2 rounded-full shadow-sm border border-slate-100 inline-flex gap-2">
                        {[0, 1, 2].map(i => (
                            <button
                                key={i}
                                onClick={() => setStep(i)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${step === i ? 'bg-slate-800 scale-125' : 'bg-slate-200 hover:bg-slate-300'}`}
                            />
                        ))}
                    </div>
                </div>

                {step === 0 && <CakeSlicer onComplete={() => setStep(1)} />}
                {step === 1 && <SortingTrain onComplete={() => setStep(2)} />}
                {step === 2 && <FullExamTable onComplete={() => setStep(3)} />}

                {step === 3 && (
                    <GameShell
                        active={true}
                        title="Certification"
                        color="text-green-600"
                        icon={Trophy}
                        subtitle="You have completed all practical modules."
                    >
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50 shadow-xl animate-bounce">
                                <Trophy size={64} className="text-green-600" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-800 mb-4">Exam Ready</h3>
                            <button onClick={() => setStep(0)} className="text-slate-500 font-bold hover:text-slate-800 underline decoration-dashed underline-offset-4">
                                Restart Evaluation
                            </button>
                        </div>
                    </GameShell>
                )}
            </div>
        </section>
    );
};
