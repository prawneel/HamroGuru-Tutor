"use client";

import * as React from "react";

interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function ShinyButton({
  children,
  className,
  variant = "primary",
  size = "md",
  onClick,
  ...props
}: ShinyButtonProps) {
  return (
    <>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

        .shiny-cta {
          --shiny-cta-bg: #0f172a;
          --shiny-cta-bg-subtle: #1e293b;
          --shiny-cta-fg: #f8fafc;
          --shiny-cta-highlight: #38bdf8;
          --shiny-cta-highlight-subtle: #0ea5e9;
          --gradient-angle: 0deg;
          --gradient-percent: 50%;
          --animation-duration: 3s;
          --shadow-size: 2px;
          --transition: 500ms cubic-bezier(0.25, 1, 0.5, 1);
          
          position: relative;
          overflow: hidden;
          cursor: pointer;
          outline: none;
          padding: 0.75rem 2.5rem;
          font-family: "Inter", sans-serif;
          font-size: 1.125rem;
          font-weight: 600;
          line-height: 1.2;
          border-radius: 999px;
          color: var(--shiny-cta-fg);
          background: linear-gradient(var(--gradient-angle), var(--shiny-cta-bg), var(--shiny-cta-bg));
          box-shadow: inset 0 0 0 1px var(--shadow-size) rgba(255, 255, 255, 0.1);
          transition: all var(--transition) ease-out;
          isolation: isolate;
        }

        .shiny-cta::before {
          content: "";
          position: absolute;
          inset-inline-start: 50%;
          inset-block-start: 50%;
          translate: -50% -50%;
          z-index: -1;
        }

        .shiny-cta::after {
          content: "";
          position: absolute;
          inset-inline-start: 50%;
          inset-block-start: 50%;
          translate: -50% -50%;
          z-index: -1;
        }

        /* Gradient shine effect */
        .shiny-cta::before {
          --shine-angle: var(--gradient-angle);
          --shine-gradient: conic-gradient(
            from var(--shine-angle) at 50% 50%,
            transparent 0%,
            var(--shiny-cta-highlight) var(--gradient-percent),
            var(--shiny-cta-highlight) calc(var(--gradient-percent) * 2),
            var(--shiny-cta-bg-subtle) 100%,
            var(--shiny-cta-bg-subtle) 100%
          );
          background: var(--shine-gradient);
          animation: shine-rotate var(--animation-duration) linear infinite;
          animation-play-state: paused;
          width: 200%;
          height: 200%;
        }

        /* Inner shimmer */
        .shiny-cta::after {
          --shimmer-gradient: linear-gradient(
            -50deg,
            transparent,
            var(--shiny-cta-highlight-subtle),
            transparent 50%,
            var(--shiny-cta-highlight-subtle)
          );
          background: var(--shimmer-gradient);
          mask-image: radial-gradient(circle at bottom, transparent 40%, black);
          width: 100%;
          aspect-ratio: 1;
          opacity: 0.6;
          transition: opacity var(--transition) ease-out;
          animation: shimmer 1s ease-in-out infinite alternate;
        }

        /* Hover states */
        .shiny-cta:hover {
          --gradient-percent: 70%;
          --shiny-cta-bg: #1e40af;
          --shiny-cta-fg: #ffffff;
          transform: translateY(-2px);
          box-shadow: 
            inset 0 0 0 1px var(--shadow-size) rgba(255, 255, 255, 0.2),
            0 8px 32px rgba(56, 189, 248, 0.3);
        }

        .shiny-cta:is(:hover, :focus-visible)::before {
          animation-play-state: running;
        }

        .shiny-cta:is(:hover, :focus-visible)::after {
          opacity: 1;
        }

        /* Active/Pressed state */
        .shiny-cta:active {
          transform: translateY(0px) scale(0.98);
          --gradient-percent: 90%;
        }

        /* Variants */
        .shiny-cta.secondary {
          --shiny-cta-bg: #f1f5f9;
          --shiny-cta-bg-subtle: #e5e7eb;
          --shiny-cta-fg: #1f2937;
          --shiny-cta-highlight: #34d399;
          --shiny-cta-highlight-subtle: #2563eb;
        }

        .shiny-cta.secondary:hover {
          --shiny-cta-bg: #d946ef;
          --shiny-cta-fg: #ffffff;
        }

        .shiny-cta.outline {
          --shiny-cta-bg: transparent;
          --shiny-cta-bg-subtle: transparent;
          --shiny-cta-fg: #0f172a;
          --shiny-cta-highlight: #38bdf8;
          --shiny-cta-highlight-subtle: #0ea5e9;
          background: transparent;
          box-shadow: 
            inset 0 0 0 1px 2px var(--shadow-size) var(--shiny-cta-bg),
            0 4px 16px rgba(15, 23, 42, 0.3);
        }

        .shiny-cta.outline:hover {
          --shiny-cta-bg: rgba(15, 23, 42, 0.1);
          box-shadow: 
            inset 0 0 0 1px 2px var(--shadow-size) var(--shiny-cta-bg),
            0 4px 20px rgba(15, 23, 42, 0.4);
        }

        /* Size variants */
        .shiny-cta.size-sm {
          padding: 0.5rem 2rem;
          font-size: 0.875rem;
          --shadow-size: 1px;
        }

        .shiny-cta.size-lg {
          padding: 1rem 3rem;
          font-size: 1.375rem;
          --shadow-size: 3px;
        }

        /* Animations */
        @keyframes shine-rotate {
          0% {
            --gradient-angle: 0deg;
          }
          100% {
            --gradient-angle: 360deg;
          }
        }

        @keyframes shimmer {
          0%, 100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
        }
      `}</style>
      <button
        className={`shiny-cta ${variant} ${size} ${className || ""}`}
        onClick={onClick}
        {...props}
      >
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    </>
  );
}
