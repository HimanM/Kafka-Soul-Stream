'use client';

import { motion } from 'framer-motion';

export const SoulOrb = ({ active }: { active: boolean }) => {
    return (
        <div className="relative flex items-center justify-center w-32 h-32 mx-auto mb-8">
            {/* Core */}
            <motion.div
                animate={{
                    scale: active ? [1, 1.2, 1] : 1,
                    boxShadow: active
                        ? [
                            '0 0 20px #22c55e',
                            '0 0 60px #22c55e',
                            '0 0 20px #22c55e',
                        ]
                        : '0 0 0px #22c55e',
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className={`w-16 h-16 rounded-full bg-green-500 blur-sm z-10 ${active ? 'opacity-100' : 'opacity-20 grayscale'
                    }`}
            />

            {/* Outer Glow */}
            {active && (
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute w-full h-full rounded-full border-2 border-green-500/30 border-dashed"
                />
            )}
        </div>
    );
};
