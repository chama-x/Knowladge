import { BinaryInteractive } from "@/modules/AL_ICT/Subnetting/components/BinaryInteractive";
import { AddressInteractive } from "@/modules/AL_ICT/Subnetting/components/AddressInteractive";
import { MaskInteractive } from "@/modules/AL_ICT/Subnetting/components/MaskInteractive";
import { MaskVsIPInteractive } from "@/modules/AL_ICT/Subnetting/components/MaskVsIPInteractive";
import { TradeOffInteractive } from "@/modules/AL_ICT/Subnetting/components/TradeOffInteractive";
import { FLSMInteractive } from "@/modules/AL_ICT/Subnetting/components/FLSMInteractive";
import { VLSMInteractive } from "@/modules/AL_ICT/Subnetting/components/VLSMInteractive";
import { PlaygroundInteractive } from "@/modules/AL_ICT/Subnetting/components/PlaygroundInteractive";
import { PracticeInteractive } from "@/modules/AL_ICT/Subnetting/components/PracticeInteractive";
import { Mascot } from "@/components/core/Mascot";
import { TopicNav } from "@/components/core/TopicNav";

export default function SubnettingPage() {
    return (
        <main className="min-h-screen font-sans selection:bg-[var(--color-secondary-light)] selection:text-[var(--color-secondary-dark)] bg-[var(--color-bg)] pb-40">
            <TopicNav />
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-primary-light)] rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob will-change-transform"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-secondary-light)] rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob animation-delay-2000 will-change-transform"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-[var(--color-slate-200)] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-4000 will-change-transform"></div>
            </div>

            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[95%] max-w-5xl flex justify-between items-center px-6">
                <span className="font-black text-[var(--color-text)]">OpenEdu</span>
            </nav>

            <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-32 pt-48">
                <section id="intro" className="text-center flex flex-col items-center">
                    <Mascot mood="happy" />
                    <div className="mt-8 inline-block px-4 py-2 bg-[var(--color-card)] rounded-full text-[var(--color-secondary)] font-black text-xs uppercase tracking-widest shadow-sm border border-[var(--color-secondary)]/20 mb-6">Interactive Study Note v2.0</div>
                    <h1 className="text-5xl md:text-7xl font-black text-[var(--color-text)] mb-6 leading-tight">How to Speak <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-text)]">Computer</span></h1>
                    <p className="text-xl md:text-2xl text-[var(--color-slate-500)] max-w-2xl leading-relaxed font-medium">Let's learn the secret language of the internet. <br />No textbooks. Just toys.</p>
                </section>

                <BinaryInteractive />
                <AddressInteractive />
                <MaskInteractive />
                <MaskVsIPInteractive />
                <TradeOffInteractive />
                <FLSMInteractive />
                <VLSMInteractive />
                <PlaygroundInteractive />
                <PracticeInteractive />

                <div className="text-center pb-24">
                    <h3 className="text-2xl font-black text-[var(--color-text)] mb-4">You did it! 🎓</h3>
                    <p className="text-[var(--color-slate-500)]">You now know more about Subnetting than 90% of IT students.</p>
                </div>
            </div>
        </main>
    );
}
