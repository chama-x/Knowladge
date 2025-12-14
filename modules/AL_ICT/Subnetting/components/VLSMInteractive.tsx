"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Scissors, Scale } from 'lucide-react';

type NodeData = {
    cidr: number;
    size: number;
    offset: number;
    children: NodeData[];
};

export const VLSMInteractive = () => {
    const [baseCidr, setBaseCidr] = useState(24);
    const [root, setRoot] = useState<NodeData>({ cidr: 24, size: 256, offset: 0, children: [] });
    const [viewMode, setViewMode] = useState<'block' | 'tree' | 'flsm'>('block');
    const [flsmRoot, setFlsmRoot] = useState<NodeData | null>(null);
    const [maxDepthCidr, setMaxDepthCidr] = useState(24);

    const resetTree = useCallback((base: number) => {
        const size = Math.pow(2, 32 - base);
        setRoot({ cidr: base, size: size, offset: 0, children: [] });
    }, []);

    useEffect(() => {
        resetTree(baseCidr);
    }, [baseCidr, resetTree]);

    useEffect(() => {
        const getMaxCidr = (node: NodeData): number => {
            if (!node.children || node.children.length === 0) return node.cidr;
            return Math.max(getMaxCidr(node.children[0]), getMaxCidr(node.children[1]));
        };
        const max = getMaxCidr(root);
        setMaxDepthCidr(max);

        const generateFlsm = (cidr: number, size: number, offset: number): NodeData => {
            if (cidr === max) { return { cidr, size, offset, children: [] }; }
            const newSize = size / 2;
            return { cidr, size, offset, children: [generateFlsm(cidr + 1, newSize, offset), generateFlsm(cidr + 1, newSize, offset + newSize)] };
        };
        if (viewMode === 'flsm') {
            const baseSize = Math.pow(2, 32 - baseCidr);
            setFlsmRoot(generateFlsm(baseCidr, baseSize, 0));
        }
    }, [root, viewMode, baseCidr]);

    const Block = ({ data, depth }: { data: NodeData, depth: number }) => {
        const isLeaf = !data.children || data.children.length === 0;
        const getBgColor = (c: number) => {
            const relativeDepth = c - baseCidr;
            if (relativeDepth === 0) return 'bg-[var(--color-primary)]';
            if (relativeDepth === 1) return 'bg-[var(--color-secondary)]';
            if (relativeDepth === 2) return 'bg-[var(--color-accent)]';
            return 'bg-[#3B82F6]';
        };

        const handleSplit = (e: React.MouseEvent) => {
            e.stopPropagation();
            const newCidr = data.cidr + 1;
            const newSize = data.size / 2;
            data.children = [
                { cidr: newCidr, size: newSize, offset: data.offset, children: [] },
                { cidr: newCidr, size: newSize, offset: data.offset + newSize, children: [] }
            ];
            setRoot({ ...root });
        };

        const maxSplit = baseCidr + 4;

        return (
            <div className={`relative transition-all duration-300 flex items-stretch border-2 border-white/20 hover:border-white/50 rounded-xl overflow-hidden ${getBgColor(data.cidr)}`} style={{ flex: 1, minHeight: '120px', margin: '2px' }}>
                {isLeaf ? (
                    <div className="w-full flex flex-col items-center justify-center p-2 text-white group cursor-pointer relative" onClick={data.cidr < maxSplit ? handleSplit : undefined}>
                        <span className="font-mono font-black text-xl md:text-2xl drop-shadow-md">/{data.cidr}</span>
                        <span className="text-[10px] uppercase font-bold opacity-80 mt-1">{data.size.toLocaleString()} IPs</span>
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            {data.cidr < maxSplit ? (
                                <span className="bg-white text-slate-800 px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"><Scissors size={12} /> Split</span>
                            ) : <span className="text-[10px] font-bold">Max Depth</span>}
                        </div>
                        <div className="absolute bottom-1 right-2 text-[9px] font-mono opacity-60">.{data.offset}</div>
                    </div>
                ) : (
                    <div className="w-full flex"><Block data={data.children[0]} depth={depth + 1} /><Block data={data.children[1]} depth={depth + 1} /></div>
                )}
            </div>
        );
    };

    const TreeNode = ({ data, isFirst, isLast, isRoot, readOnly = false }: { data: NodeData, isFirst?: boolean, isLast?: boolean, isRoot?: boolean, readOnly?: boolean }) => {
        const isLeaf = !data.children || data.children.length === 0;
        const maxSplit = baseCidr + 4;

        const handleSplit = () => {
            if (readOnly) return;
            const newCidr = data.cidr + 1;
            const newSize = data.size / 2;
            data.children = [
                { cidr: newCidr, size: newSize, offset: data.offset, children: [] },
                { cidr: newCidr, size: newSize, offset: data.offset + newSize, children: [] }
            ];
            setRoot({ ...root });
        };

        const relativeDepth = data.cidr - baseCidr;
        const nodeColor = relativeDepth === 0 ? 'text-[var(--color-primary)] border-[var(--color-primary)]' : relativeDepth === 1 ? 'text-[var(--color-secondary)] border-[var(--color-secondary)]' : relativeDepth === 2 ? 'text-[var(--color-accent)] border-[var(--color-accent)]' : 'text-[#3B82F6] border-[#3B82F6]';
        const bgColor = relativeDepth === 0 ? 'bg-[var(--color-primary-light)]/20' : relativeDepth === 1 ? 'bg-[var(--color-secondary-light)]/20' : relativeDepth === 2 ? 'bg-[var(--color-accent)]/10' : 'bg-[#3B82F6]/10';

        return (
            <div className="flex flex-col items-center">
                {!isRoot && (
                    <div className="h-8 w-full flex relative">
                        <div className={`h-[2px] w-[50%] bg-[var(--color-slate-300)] absolute top-0 right-[50%] ${isFirst ? 'hidden' : 'block'} rounded-bl-full`}></div>
                        <div className={`h-[2px] w-[50%] bg-[var(--color-slate-300)] absolute top-0 left-[50%] ${isLast ? 'hidden' : 'block'} rounded-br-full`}></div>
                        <div className="w-[2px] h-full bg-[var(--color-slate-300)] absolute left-[calc(50%-1px)]"></div>
                    </div>
                )}
                <div onClick={isLeaf && data.cidr < maxSplit && !readOnly ? handleSplit : undefined} className={`relative z-10 w-28 py-3 rounded-2xl border-2 shadow-sm flex flex-col items-center justify-center transition-all duration-200 bg-white ${nodeColor} ${bgColor} ${isLeaf && data.cidr < maxSplit && !readOnly ? 'cursor-pointer hover:scale-105 hover:shadow-md' : ''}`}>
                    <div className="text-lg font-black tracking-tight">/{data.cidr}</div>
                    <div className="text-[10px] font-mono opacity-70">.{data.offset}</div>
                    {isLeaf && data.cidr < maxSplit && !readOnly && (
                        <div className="absolute -bottom-3 bg-white text-[var(--color-slate-400)] border border-[var(--color-slate-200)] rounded-full p-1 shadow-sm transform scale-75 group-hover:text-[var(--color-secondary)] group-hover:border-[var(--color-secondary)]"><Scissors size={12} /></div>
                    )}
                </div>
                {!isLeaf && (
                    <><div className="w-[2px] h-8 bg-[var(--color-slate-300)]"></div><div className="flex">{data.children.map((child, i) => (<div key={i} className="flex flex-col items-center px-2"><TreeNode data={child} isFirst={i === 0} isLast={i === data.children.length - 1} isRoot={false} readOnly={readOnly} /></div>))}</div></>
                )}
            </div>
        );
    };

    return (
        <section id="vlsm" className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <div className="inline-block px-3 py-1 bg-[var(--color-secondary)] text-white rounded-full text-xs font-bold mb-4 uppercase tracking-widest">Variable Length</div>
                <h2 className="text-3xl md:text-4xl font-black text-[var(--color-text)] mb-4">7. The VLSM Master</h2>
                <p className="text-[var(--color-slate-500)] text-lg max-w-xl mx-auto">Life isn't always fair. Sometimes a big department needs a big slice, and a small team needs a small slice.</p>
            </div>

            <div className="bg-[var(--color-card)] rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-[var(--color-slate-200)] relative overflow-hidden">

                {/* VIEW MODE CONTROLS */}
                <div className="flex justify-between items-center mb-6 px-2">
                    <div className="flex gap-2 bg-[var(--color-slate-100)] p-1 rounded-lg">
                        <button onClick={() => setViewMode('block')} className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${viewMode === 'block' ? 'bg-white text-[var(--color-text)] shadow-sm' : 'text-[var(--color-slate-400)]'}`}>Block Map</button>
                        <button onClick={() => setViewMode('tree')} className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${viewMode === 'tree' ? 'bg-white text-[var(--color-text)] shadow-sm' : 'text-[var(--color-slate-400)]'}`}>Hierarchy Tree</button>
                        <button onClick={() => setViewMode('flsm')} className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${viewMode === 'flsm' ? 'bg-white text-[var(--color-accent)] shadow-sm' : 'text-[var(--color-slate-400)]'}`}>FLSM Equivalent</button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 bg-[var(--color-slate-100)] p-1 rounded-lg">
                            <button
                                onClick={() => setBaseCidr(24)}
                                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${baseCidr === 24 ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-[var(--color-slate-400)]'}`}
                            >
                                /24
                            </button>
                            <button
                                onClick={() => setBaseCidr(16)}
                                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${baseCidr === 16 ? 'bg-[var(--color-accent)] text-white shadow-sm' : 'text-[var(--color-slate-400)]'}`}
                            >
                                /16
                            </button>
                        </div>
                        <button onClick={() => resetTree(baseCidr)} className="text-xs font-bold text-[var(--color-secondary)] hover:text-[#E08E00] flex items-center gap-1">Reset <Activity size={12} /></button>
                    </div>
                </div>

                {viewMode === 'flsm' && (
                    <div className="mb-6 bg-[var(--color-accent)]/10 p-4 rounded-xl flex items-start gap-3 border border-[var(--color-accent)]/20">
                        <div className="p-2 bg-[var(--color-accent)] rounded-lg text-white"><Scale size={16} /></div>
                        <div>
                            <h4 className="text-sm font-bold text-[var(--color-text)]">FLSM Forced Equality</h4>
                            <p className="text-xs text-[var(--color-slate-600)] mt-1">Your smallest VLSM subnet was <strong>/{maxDepthCidr}</strong>. In Fixed Length Subnet Masking (FLSM), if you need one /{maxDepthCidr}, <strong>ALL</strong> subnets must be split to match it. Notice the symmetry?</p>
                        </div>
                    </div>
                )}

                <div className="w-full min-h-[300px] bg-[var(--color-slate-50)] rounded-2xl p-4 shadow-inner overflow-x-auto flex justify-center items-start">
                    {viewMode === 'block' ? (
                        <div className="w-full flex h-48 md:h-64 rounded-xl overflow-hidden self-center"><Block data={root} depth={0} /></div>
                    ) : viewMode === 'tree' ? (
                        <div className="pt-4 min-w-max pb-8"><TreeNode data={root} isRoot={true} /></div>
                    ) : (
                        <div className="pt-4 min-w-max pb-8 opacity-90">{flsmRoot && <TreeNode data={flsmRoot} isRoot={true} readOnly={true} />}</div>
                    )}
                </div>

                <div className="mt-8 flex justify-center gap-6 text-sm font-bold text-[var(--color-slate-500)]">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--color-primary)]"></div> /{baseCidr}</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--color-secondary)]"></div> /{baseCidr + 1}</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--color-accent)]"></div> /{baseCidr + 2}</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div> /{baseCidr + 3}+</div>
                </div>
            </div>
        </section>
    );
};
