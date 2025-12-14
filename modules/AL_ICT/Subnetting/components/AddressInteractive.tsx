"use client";
import React, { useState } from 'react';
import { Lock, Globe, Info } from 'lucide-react';
import { isPrivateIp } from '@/lib/utils/ip-math';

const OctetPill = ({ val, isActive, onClick, isNetwork }: { val: number, isActive: boolean, onClick: () => void, isNetwork: boolean }) => (
    <button
        onClick={onClick}
        className={`relative px-2 py-3 md:px-6 md:py-4 rounded-2xl text-2xl md:text-4xl font-black font-mono transition-all duration-200 border-b-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary)] 
      ${isActive ? 'bg-white text-slate-900 border-[var(--color-secondary)] -translate-y-2 shadow-lg scale-110 z-10' : 'bg-[var(--color-slate-100)] text-[var(--color-slate-400)] border-[var(--color-slate-200)] hover:bg-white hover:-translate-y-1'}`}
    >
        {val}
        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full shadow-sm ${isNetwork ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-secondary)]'} ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
    </button>
);

export const AddressInteractive = () => {
    const [octets, setOctets] = useState([192, 168, 1, 10]);
    const [selectedOctet, setSelectedOctet] = useState(0);
    const isPrivate = isPrivateIp(octets);

    const toggleBit = (bitIndex: number) => {
        const currentVal = octets[selectedOctet];
        const bitVal = 1 << (7 - bitIndex);
        const newVal = (currentVal & bitVal) ? currentVal - bitVal : currentVal + bitVal;
        const newOctets = [...octets];
        newOctets[selectedOctet] = newVal;
        setOctets(newOctets);
    };

    return (
        <section id="address" className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-[var(--color-text)] mb-4">2. The Address</h2>
                <p className="text-[var(--color-slate-500)] text-lg max-w-xl mx-auto">An IP Address is just four of those Octets strung together.</p>
            </div>
            <div className="bg-[var(--color-text)] rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden text-white">

                <div className="absolute top-4 right-4 group z-20">
                    <button className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${isPrivate ? 'bg-[var(--color-secondary)] text-[var(--color-text)]' : 'bg-[var(--color-primary)] text-[var(--color-text)]'}`}>
                        {isPrivate ? <Lock size={12} className="inline mr-1" /> : <Globe size={12} className="inline mr-1" />}
                        {isPrivate ? 'Private' : 'Public'}
                        <Info size={12} className="ml-1 opacity-50" />
                    </button>
                    <div className="absolute top-8 right-0 w-48 bg-white text-slate-900 p-3 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none z-30 text-xs font-medium border border-[var(--color-slate-200)]">
                        {isPrivate
                            ? "Private IPs (10.x, 192.168.x) stay in the LAN. They can't traverse the internet."
                            : "Public IPs are unique addresses used to communicate over the global internet."}
                    </div>
                </div>

                <div className="flex flex-wrap justify-center items-end gap-2 md:gap-4 mb-12 mt-8">
                    {octets.map((val, idx) => (
                        <React.Fragment key={idx}>
                            <OctetPill val={val} isActive={selectedOctet === idx} onClick={() => setSelectedOctet(idx)} isNetwork={idx < 3} />
                            {idx < 3 && <div className="text-[var(--color-slate-500)] font-black text-2xl mb-4 self-end">.</div>}
                        </React.Fragment>
                    ))}
                </div>
                <div className="bg-[#1F2437] rounded-3xl p-6 md:p-8 border border-white/10 transition-all">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-bold text-[var(--color-slate-400)] uppercase tracking-widest">Editing Octet {selectedOctet + 1}</span>
                        <span className="text-[var(--color-primary)] font-mono font-bold text-lg">{octets[selectedOctet].toString(2).padStart(8, '0')}</span>
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-4">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                            const bitVal = Math.pow(2, 7 - i);
                            const isOn = (octets[selectedOctet] & bitVal) !== 0;
                            return (
                                <button key={i} onClick={() => toggleBit(i)} className={`aspect-[3/4] rounded-xl flex flex-col items-center justify-center transition-all duration-200 border-b-4 ${isOn ? 'bg-[#5D66F4] border-[#434BD6] translate-y-0 text-white' : 'bg-[#2A3046] border-[#1F2437] translate-y-1 text-[var(--color-slate-500)]'}`}>
                                    <span className="text-xl font-bold mb-1">{isOn ? '1' : '0'}</span>
                                    <span className="text-[9px] font-mono opacity-60">{bitVal}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};
