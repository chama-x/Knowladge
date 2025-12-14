import { Mascot } from "@/components/core/Mascot";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-8 bg-[var(--color-bg)] text-[var(--color-text)] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-primary-light)] rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-secondary-light)] rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <Mascot mood="happy" />
        <h1 className="text-5xl md:text-7xl font-black mt-8 text-[var(--color-text)]">
          Sri Lanka <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
            Open Education
          </span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl font-medium">
          Domain-Driven, Scalable, Interactive Learning Modules.
        </p>

        <Link href="/AL_ICT/Subnetting" className="mt-8 px-8 py-4 bg-[var(--color-primary)] text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
          Start Learning <ChevronDown className="-rotate-90" />
        </Link>
      </div>
    </main>
  );
}
