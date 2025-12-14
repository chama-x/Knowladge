"use client";
import React, { useState } from 'react';
import { ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import { ipToLong, longToIp } from '@/lib/utils/ip-math';

export const PlaygroundInteractive = () => {
    const [rootOctets, setRootOctets] = useState([192, 168, 56, 32]);
    const [rootCidr, setRootCidr] = useState(26);
    const [borrowedBits, setBorrowedBits] = useState(2);
    const subnetsCount = Math.pow(2, borrowedBits);
    const newCidr = rootCidr + borrowedBits;
    const hostsPerSubnet = Math.pow(2, 32 - newCidr) - 2;
    const blockSize = Math.pow(2, 32 - newCidr);

    const generateSubnets = () => {
        let list = [];
        let startLong = ipToLong(rootOctets);
        for (let i = 0; i < subnetsCount; i++) {
            let currentNetLong = startLong + (i * blockSize);
            let broadcastLong = currentNetLong + blockSize - 1;
            list.push({
                id: i,
                name: String.fromCharCode(65 + i),
                netId: longToIp(currentNetLong),
                first: longToIp(currentNetLong + 1),
                last: longToIp(broadcastLong - 1),
                broadcast: longToIp(broadcastLong)
            });
        }
        return list;
    };

    const subnets = generateSubnets();

    return (
        <section id="lab" className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <span className="inline-block px-3 py-1 bg-[var(--color-accent)] text-white rounded-full text-xs font-bold mb-4 animate-pulse">EXAM MODE</span>
                <h2 className="text-3xl md:text-4xl font-black text-[var(--color-text)] mb-4">The Subnet Slicer</h2>
                <p className="text-[var(--color-slate-500)] text-lg max-w-xl mx-auto">Start with a big block. <span className="text-[var(--color-accent)] font-bold">Steal bits</span> from the host to create more networks.</p>
            </div>

            <div className="bg-[var(--color-card)] rounded-[2.5rem] shadow-2xl overflow-hidden border border-[var(--color-slate-200)]">
                <div className="bg-[#2D334A] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                        <span className="ml-2 text-xs font-bold text-[var(--color-slate-500)] uppercase tracking-widest">ISP BLOCK CONFIGURATION</span>
                    </div>
                    <div className="flex items-center bg-[#1F2437] rounded-xl p-2 border border-white/10">
                        {rootOctets.map((val, i) => (
                            <React.Fragment key={i}>
                                <input type="number" min={0} max={255} value={val} onChange={(e) => { const n = [...rootOctets]; n[i] = parseInt(e.target.value) || 0; setRootOctets(n); }} className="w-12 bg-transparent text-white font-mono font-bold text-center outline-none focus:text-[var(--color-primary)]" />
                                {i < 3 && <span className="text-[var(--color-slate-500)] font-bold">.</span>}
                            </React.Fragment>
                        ))}
                        <span className="text-[var(--color-slate-500)] mx-2">/</span>
                        <input type="number" min={8} max={30} value={rootCidr} onChange={(e) => setRootCidr(parseInt(e.target.value))} className="w-10 bg-transparent text-[var(--color-primary)] font-mono font-bold text-center outline-none" />
                    </div>
                </div>

                <div className="p-8 md:p-12 bg-[var(--color-slate-50)]">
                    <div className="flex flex-col lg:flex-row gap-12 items-center mb-16">
                        <div className="w-full lg:w-1/3 bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-slate-200)] text-center">
                            <h3 className="text-sm font-bold text-[var(--color-slate-400)] uppercase tracking-widest mb-6">How many subnets do you need?</h3>
                            <input type="range" min="0" max="4" step="1" value={borrowedBits} onChange={(e) => setBorrowedBits(parseInt(e.target.value))} className="w-full h-4 bg-[var(--color-slate-100)] rounded-full appearance-none cursor-pointer accent-[var(--color-accent)] mb-8" />
                            <div className="flex justify-between items-center px-4">
                                <div className="flex flex-col items-center">
                                    <span className="text-4xl font-black text-[var(--color-accent)] mb-1">{subnetsCount}</span>
                                    <span className="text-[10px] font-bold text-[var(--color-slate-400)] uppercase">Subnets</span>
                                </div>
                                <ArrowRight className="text-[var(--color-slate-300)]" />
                                <div className="flex flex-col items-center">
                                    <span className="text-4xl font-black text-[var(--color-secondary)] mb-1">{borrowedBits}</span>
                                    <span className="text-[10px] font-bold text-[var(--color-slate-400)] uppercase">Bits Stolen</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-2/3 flex flex-col items-center">
                            <div className="flex gap-2 mb-4">
                                {Array.from({ length: 8 }).map((_, i) => {
                                    const isOriginalNet = (24 + i) < rootCidr;
                                    const isBorrowed = !isOriginalNet && ((24 + i) < newCidr);
                                    let color = isOriginalNet ? 'bg-[var(--color-primary)]' : (isBorrowed ? 'bg-[var(--color-accent)] animate-pulse' : 'bg-[var(--color-secondary)]');
                                    let label = isOriginalNet ? 'NET' : (isBorrowed ? 'SUB' : 'HOST');
                                    return (
                                        <div key={i} className={`w-8 h-12 md:w-12 md:h-16 rounded-lg ${color} flex flex-col items-center justify-center text-[8px] md:text-[10px] font-bold text-white shadow-sm transition-colors duration-500`}>
                                            <span className="opacity-80">{label}</span>
                                        </div>
                                    )
                                })}
                            </div>
                            <p className="text-[var(--color-slate-500)] font-medium">New Mask: <span className="font-mono font-bold text-[var(--color-text)]">/{newCidr}</span> (Stealing {borrowedBits} bits creates {subnetsCount} subnets)</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-[var(--color-slate-200)] overflow-hidden shadow-sm">
                        <div className="bg-[var(--color-slate-light)] px-6 py-4 border-b border-[var(--color-slate-200)] flex justify-between items-center">
                            <h3 className="font-bold text-[var(--color-text)] flex items-center gap-2"><Layers size={18} className="text-[var(--color-accent)]" /> Generated Subnet Table</h3>
                            <span className="text-xs font-bold text-[var(--color-slate-400)] uppercase">{hostsPerSubnet} Hosts per subnet</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="text-[var(--color-slate-400)] border-b border-[var(--color-slate-100)]">
                                        <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider">Name</th>
                                        <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider">Network ID</th>
                                        <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider">First IP</th>
                                        <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider">Last IP</th>
                                        <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider">Broadcast</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {subnets.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-[var(--color-accent)]/5 transition-colors group">
                                            <td className="px-6 py-4 font-bold text-[var(--color-accent)] group-hover:scale-105 transition-transform origin-left">Subnet {sub.name}</td>
                                            <td className="px-6 py-4 font-mono font-bold text-[var(--color-text)]">{sub.netId}</td>
                                            <td className="px-6 py-4 font-mono text-[var(--color-slate-600)]">{sub.first}</td>
                                            <td className="px-6 py-4 font-mono text-[var(--color-slate-600)]">{sub.last}</td>
                                            <td className="px-6 py-4 font-mono font-bold text-[var(--color-secondary)]">{sub.broadcast}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-16 flex justify-center">
                <button className="group bg-[var(--color-foreground)] text-white px-8 py-4 rounded-full font-black text-lg shadow-[0_10px_20px_rgba(45,51,74,0.3)] hover:-translate-y-1 hover:shadow-xl transition-all flex items-center gap-3">
                    <span>Question Solved!</span>
                    <CheckCircle2 className="group-hover:text-[var(--color-primary)] transition-colors" />
                </button>
            </div>
        </section>
    );
};
