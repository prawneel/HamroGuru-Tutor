"use client";

import * as React from "react";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PinContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  href?: string;
  className?: string;
  delay?: number;
}

interface PinPerspectiveProps {
  title: string;
  href?: string;
  delay?: number;
}

export function PinContainer({
  children,
  title,
  description,
  href,
  className,
  delay = 0,
}: PinContainerProps) {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  React.useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={controls}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn("relative group", className)}
    >
      {/* Card hover effect */}
      <motion.div
        initial={{ boxShadow: "0 0 0 rgba(0,0,0,0)" }}
        whileHover={{ boxShadow: "0 25px 50px rgba(14, 165, 233, 0.15)" }}
        transition={{ duration: 0.3 }}
        className="relative z-10"
      >
        {/* 3D depth layers */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-black rounded-2xl shadow-2xl" />
          <div className="absolute inset-2 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 rounded-xl shadow-xl" />
          <div className="absolute inset-4 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-600 dark:via-gray-700 dark:to-gray-800 rounded-lg shadow-md" />
          
          {/* Content */}
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 overflow-hidden">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {title && (
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              )}
              {children}
            </motion.div>
          </div>

          {/* Glow effect */}
          <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 dark:from-blue-500/20 dark:via-purple-500/10 dark:to-pink-500/20 blur-xl rounded-2xl -z-10" />
        </div>

        {/* 3D Pin effect */}
        <motion.div
          className="absolute right-4 top-1/2 w-6 h-6 cursor-pointer z-20"
          initial={{ scale: 0, rotate: -45 }}
          whileInView={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
          whileHover={{ scale: 1.1, rotate: 10 }}
        >
          <div className="relative w-full h-full">
            {/* Pin head */}
            <div className="absolute bottom-1/2 left-1/2 w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 dark:from-red-400 dark:to-red-500 rounded-full shadow-lg" />
            <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-gradient-to-br from-red-400 to-red-500 dark:from-red-300 dark:to-red-400 rounded-full" />
            
            {/* Pin shadow */}
            <div className="absolute bottom-1/2 left-1/2 w-4 h-4 bg-black/20 rounded-full" />
          </div>
        </motion.div>

        {/* Link preview (optional) */}
        {href && (
          <motion.a
            href={href}
            target="_blank"
            className={cn(
              "absolute inset-0 rounded-2xl",
              "cursor-pointer"
            )}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

export function PinPerspective({ title, href, delay = 0 }: PinPerspectiveProps) {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  React.useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, rotateX: 15, rotateY: -10 }}
      animate={controls}
      transition={{
        duration: 1,
        delay,
        ease: [0.34, 1, 0.34, 1],
      }}
      className="relative z-50"
    >
      {/* Perspective container */}
      <div className="relative" style={{ perspective: "1000px" }}>
        {/* Card tilt effect */}
        <motion.div
          className="relative w-96 h-80"
          initial={{ rotateX: -15, rotateY: 10 }}
          whileInView={{ rotateX: 0, rotateY: 0 }}
          transition={{ duration: 1.5 }}
          whileHover={{ rotateX: 5, rotateY: -5, scale: 1.05 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Card layers for 3D effect */}
          <div className="relative w-full h-full">
            {/* Back layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 rounded-2xl shadow-2xl" />
            
            {/* Middle layer */}
            <div className="absolute inset-2 bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-800 dark:to-blue-900 rounded-2xl shadow-xl" />
            
            {/* Front layer with content */}
            <div className="absolute inset-4 bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-700 dark:to-blue-800 rounded-xl shadow-2xl overflow-hidden">
              <div className="h-full flex flex-col items-center justify-center p-6 text-white">
                <div className="text-2xl font-bold text-center mb-2">
                  {title}
                </div>
                <p className="text-sm text-blue-100 text-center">
                  Click to explore
                </p>
              </div>

              {/* Animated wave overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-16">
                <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
                  <path
                    d="M0 25 Q 25 25 25 0 T 50 25 Q 75 25 75 0"
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="2"
                    className="animate-[wave_2s_ease-in-out_infinite]"
                  />
                  <style jsx>{`
                    @keyframes wave {
                      0%, 100% { d: "M0 25 Q 25 25 25 0 T 50 25 Q 75 25 75 0"; }
                      25% { d: "M0 25 Q 25 5 25 0 T 50 25 Q 75 45 75 0"; }
                      50% { d: "M0 25 Q 25 25 25 0 T 50 25 Q 75 25 75 0"; }
                      75% { d: "M0 25 Q 25 25 25 0 T 50 25 Q 75 5 75 0"; }
                    }
                  `}</style>
                </svg>
              </div>
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/40 dark:from-blue-100/20 dark:to-blue-100/40 rounded-xl" />
          </div>
        </motion.div>

        {/* Link */}
        {href && (
          <motion.a
            href={href}
            target="_blank"
            className="absolute inset-0 rounded-2xl cursor-pointer"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
    </motion.div>
  );
}
