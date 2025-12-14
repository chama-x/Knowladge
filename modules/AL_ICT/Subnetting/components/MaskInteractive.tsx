"use client";
import React, { useState } from 'react';
import { Shield, Calculator, Users, Grid } from 'lucide-react';
import { cidrToMask } from '@/lib/utils/ip-math';

export const MaskInteractive = () => {
    const [cidr, setCidr] = useState(24);
    const totalHosts = Math.pow(2, 32 - cidr) - 2;
    const decimalMask = cidrToMask(cidr);

    const getCalcData = () => {
        const octetIndex = Math.floor((cidr - 1) / 8);
        const remainder = cidr % 8 === 0 ? 8 : cidr % 8;

        const breakdown = Array(4).fill(0).map((_, i) => {
            if (i < octetIndex) return 8;
            if (i === octetIndex) return remainder;
            return 0;
        }).filter(n => n > 0).join(' + ');

        let sumString = "";
        let sumValue = 0;
        let binaryString = "";

        if (remainder === 8) {
            sumString = "All 8 bits ON";
            sumValue = 255;
            binaryString = "11111111";
        } else {
            const bits = [];
            const sums = [];
            for (let i = 0; i < 8; i++) {
                if (i < remainder) {
                    bits.push(1);
                    const val = Math.pow(2, 7 - i);
                    sums.push(val);
                    sumValue += val;
                } else {
                    bits.push(0);
                }
            }
            binaryString = bits.join('');
            sumString = sums.join(' + ');
        }

        return { breakdown, octetIndex, binaryString, sumString, sumValue };
    };

    const calc = getCalcData();

    return (
        <section id="mask" className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-[var(--color-text)] mb-4">3. The Divider</h2>
                <p className="text-[var(--color-slate-500)] text-lg max-w-xl mx-auto">The <strong className="text-[var(--color-secondary)]">Subnet Mask</strong> draws the line between Network (Street) and Host (House).</p>
            </div>

            <div className="bg-[var(--color-card)] rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-[var(--color-card)]/50">
                <div className="relative h-24 bg-[var(--color-slate-100)] rounded-3xl overflow-hidden mb-12 border-4 border-[var(--color-slate-100)] shadow-inner flex">
                    <div className="h-full bg-[var(--color-primary)] transition-all duration-300 relative overflow-hidden" style={{ width: `${(cidr / 32) * 100}%`, minWidth: '40px' }}><div className="absolute inset-0 flex items-center justify-center"><span className="bg-[var(--color-primary-dark)] text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest shadow-sm truncate">NET</span></div></div>
                    <div className="flex-1 h-full bg-[var(--color-secondary)] relative overflow-hidden" style={{ minWidth: '40px' }}><div className="absolute inset-0 flex items-center justify-center"><span className="bg-[var(--color-secondary-dark)] text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest shadow-sm truncate">HOST</span></div></div>
                    <div className="absolute top-0 bottom-0 w-1.5 bg-white z-10 shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-all duration-300 pointer-events-none" style={{ left: `${(cidr / 32) * 100}%` }}><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg border-4 border-[var(--color-slate-100)] flex items-center justify-center text-[var(--color-slate-400)]"><Shield size={16} fill="currentColor" /></div></div>
                </div>

                <div className="flex flex-col items-center relative mb-12">
                    <input
                        type="range" min="8" max="30" value={cidr}
                        onChange={(e) => setCidr(parseInt(e.target.value))}
                        className="w-full max-w-lg h-3 bg-[var(--color-slate-200)] rounded-lg appearance-none cursor-pointer accent-[var(--color-text)] hover:accent-[var(--color-primary)] transition-colors relative z-10"
                    />
                    <div className="mt-4 text-center">
                        <span className="text-6xl font-black text-[var(--color-text)]">/{cidr}</span>
                        <div className="text-[var(--color-slate-400)] font-bold text-sm uppercase tracking-widest mt-1">CIDR Notation</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[var(--color-slate-light)] p-6 rounded-3xl border-2 border-[var(--color-slate-100)] flex flex-col justify-between group hover:border-[var(--color-accent)] transition-all">
                        <div className="flex items-center gap-2 mb-4 text-[var(--color-accent)] font-bold text-xs uppercase tracking-widest">
                            <Calculator size={14} /> Calculating Mask
                        </div>
                        <div className="space-y-3">
                            <div>
                                <div className="text-[10px] text-[var(--color-slate-400)] font-bold uppercase">Bit Breakdown</div>
                                <div className="font-mono font-bold text-[var(--color-slate-600)]">{calc.breakdown}</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-[var(--color-slate-400)] font-bold uppercase">Octet {calc.octetIndex + 1} Binary</div>
                                <div className="font-mono font-bold text-[var(--color-text)] bg-white border border-[var(--color-slate-200)] rounded px-2 py-1 inline-block">
                                    {calc.binaryString}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] text-[var(--color-slate-400)] font-bold uppercase">Value Math</div>
                                <div className="font-mono text-xs text-[var(--color-slate-500)] whitespace-nowrap overflow-hidden text-ellipsis">
                                    {calc.sumString} = <span className="font-bold text-[var(--color-accent)] text-sm">{calc.sumValue}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-[var(--color-slate-200)]">
                            <div className="text-center font-mono font-bold text-[var(--color-text)] text-sm md:text-xs lg:text-sm">
                                {decimalMask}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--color-secondary-light)]/20 p-6 rounded-3xl border-2 border-[var(--color-secondary-light)] flex flex-col justify-between group hover:border-[var(--color-secondary)] transition-all">
                        <div className="flex items-center gap-2 mb-4 text-[var(--color-secondary)] font-bold text-xs uppercase tracking-widest">
                            <Users size={14} /> Usable Hosts
                        </div>
                        <div className="text-center my-2">
                            <div className="text-4xl font-black text-[var(--color-text)]">{totalHosts > 0 ? totalHosts.toLocaleString() : 0}</div>
                        </div>
                        <div className="bg-white/60 rounded-xl p-3 text-center border border-[var(--color-secondary-light)]/50">
                            <div className="text-[10px] text-orange-400 font-bold uppercase mb-1">The Formula</div>
                            <div className="font-mono text-sm text-[var(--color-text)]">
                                2<sup className="text-[var(--color-secondary)]">{32 - cidr}</sup> - 2
                            </div>
                            <div className="text-[10px] text-[var(--color-slate-400)] mt-1 italic">(-2 for Network & Broadcast)</div>
                        </div>
                    </div>

                    <div className="bg-[var(--color-primary-light)]/20 p-6 rounded-3xl border-2 border-[var(--color-primary-light)] flex flex-col justify-between group hover:border-[var(--color-primary)] transition-all">
                        <div className="flex items-center gap-2 mb-4 text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest">
                            <Grid size={14} /> Total IPs
                        </div>
                        <div className="text-center my-2">
                            <div className="text-4xl font-black text-[var(--color-text)]">{Math.pow(2, 32 - cidr).toLocaleString()}</div>
                        </div>
                        <div className="bg-white/60 rounded-xl p-3 text-center border border-[var(--color-primary-light)]/50">
                            <div className="text-[10px] text-teal-500 font-bold uppercase mb-1">The Formula</div>
                            <div className="font-mono text-sm text-[var(--color-text)]">
                                2<sup className="text-[var(--color-primary)]">{32 - cidr}</sup>
                            </div>
                            <div className="text-[10px] text-[var(--color-slate-400)] mt-1 italic">(Includes reserved addrs)</div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
