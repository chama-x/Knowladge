"use client";
import React, { useState, useEffect } from 'react';
import { AlignRight, X } from 'lucide-react';

const topics = [
    { id: 'intro', label: 'Intro' },
    { id: 'binary', label: '1. Binary Switches' },
    { id: 'address', label: '2. IP Address' },
    { id: 'mask', label: '3. Subnet Mask' },
    { id: 'ipvsmask', label: '4. Net vs Host' },
    { id: 'tradeoff', label: '5. The Trade-off' },
    { id: 'flsm', label: '6. FLSM Slicing' },
    { id: 'vlsm', label: '7. VLSM Mastery' },
    { id: 'lab', label: '8. Subnet Slicer' },
    { id: 'practice', label: '9. Network Master' },
];

export const TopicNav = () => {
    const [activeId, setActiveId] = useState('intro');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-40% 0px -40% 0px' } // Trigger when middle 20% of viewport
        );

        topics.forEach((topic) => {
            const el = document.getElementById(topic.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setMobileMenuOpen(false);
        }
    };

    return (
        <>
            {/* Desktop Minimal Rail */}
            <nav className="fixed right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 z-40">
                {topics.map((topic) => {
                    const isActive = activeId === topic.id;
                    return (
                        <button
                            key={topic.id}
                            onClick={() => scrollTo(topic.id)}
                            className="group flex items-center justify-end gap-3 outline-none"
                            aria-label={`Scroll to ${topic.label}`}
                        >
                            <span className={`text-sm font-bold transition-all duration-300 ${isActive ? 'text-[var(--color-primary)] opacity-100 translate-x-0' : 'text-[var(--color-slate-400)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>
                                {topic.label}
                            </span>
                            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isActive ? 'bg-[var(--color-primary)] scale-150 ring-4 ring-[var(--color-primary)]/20' : 'bg-[var(--color-slate-300)] group-hover:bg-[var(--color-primary)]/50'}`}></div>
                        </button>
                    )
                })}
            </nav>

            {/* Mobile FAB & Menu */}
            <div className="fixed bottom-6 right-6 xl:hidden z-50">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="w-12 h-12 bg-[var(--color-text)] text-white rounded-full shadow-xl flex items-center justify-center transition-transform active:scale-95"
                >
                    {mobileMenuOpen ? <X size={20} /> : <AlignRight size={20} />}
                </button>
            </div>

            {/* Mobile Drawer */}
            <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 xl:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)}>
                <div
                    className={`absolute bottom-20 right-6 w-64 bg-[var(--color-card)] rounded-2xl shadow-2xl p-4 transition-all duration-300 origin-bottom-right ${mobileMenuOpen ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8 opacity-0'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h3 className="text-xs font-bold text-[var(--color-slate-400)] uppercase tracking-widest mb-4 px-2">Table of Contents</h3>
                    <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto">
                        {topics.map((topic) => {
                            const isActive = activeId === topic.id;
                            return (
                                <button
                                    key={topic.id}
                                    onClick={() => scrollTo(topic.id)}
                                    className={`text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text)] hover:bg-[var(--color-slate-50)]'}`}
                                >
                                    {topic.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};
