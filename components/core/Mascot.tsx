import React from 'react';

type MascotProps = {
    mood?: 'happy' | 'sad' | 'surprised';
};

export const Mascot: React.FC<MascotProps> = ({ mood = 'happy' }) => (
    <div className="relative w-24 h-24 animate-bounce-slow" aria-label={`Mascot is ${mood}`}>
        <div className="absolute inset-0 bg-[var(--color-secondary)] rounded-full shadow-[0_8px_0_var(--color-secondary-dark)] flex items-center justify-center overflow-hidden">
            <div className="flex gap-4 mb-1">
                <div className={`w-3 h-3 bg-[var(--color-text)] rounded-full transition-all ${mood === 'surprised' ? 'h-4 w-4' : ''}`}></div>
                <div className={`w-3 h-3 bg-[var(--color-text)] rounded-full transition-all ${mood === 'surprised' ? 'h-4 w-4' : ''}`}></div>
            </div>
            <div className={`absolute bottom-6 w-4 h-2 bg-[var(--color-text)] rounded-full transition-all duration-300 
         ${mood === 'surprised' ? 'h-4 w-4 rounded-full' : 'rounded-b-full'}
         ${mood === 'sad' ? 'rotate-180 bottom-4' : ''}
       `}></div>
            <div className="absolute top-4 left-4 w-6 h-3 bg-white opacity-40 rounded-full rotate-[-45deg]"></div>
        </div>
    </div>
);
