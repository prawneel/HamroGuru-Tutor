import React from "react";

export function Logo({ className }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg
                width="40"
                height="40"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-sm"
            >
                {/* Abstract "Guru" figure / Lightbulb shape */}
                <circle cx="50" cy="40" r="15" fill="#f59e0b" /> {/* Head / Lightbulb */}
                <path d="M50 25L50 15" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" /> {/* Light ray */}
                <path d="M42 28L38 20" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                <path d="M58 28L62 20" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />

                {/* Body/Book shape */}
                <path
                    d="M30 65C30 55 40 50 50 50C60 50 70 55 70 65V85H30V65Z"
                    fill="#1e3a8a"
                />
                <rect x="35" y="70" width="30" height="2" fill="white" fillOpacity="0.3" />
                <rect x="35" y="75" width="30" height="2" fill="white" fillOpacity="0.3" />

                {/* Arched connection (Mentor-Student bond) */}
                <path
                    d="M20 75C20 45 40 30 50 30C60 30 80 45 80 75"
                    stroke="#3b82f6"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="0.1 12"
                />

                {/* Glow effect */}
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
            </svg>
            <div className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tighter text-[#1e3a8a]">
                    Hamro<span className="text-[#f59e0b]">Guru</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#64748b]">
                    Find Your Mentor
                </span>
            </div>
        </div>
    );
}
