'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaGhost, FaGithub } from 'react-icons/fa';
import { SiApachekafka } from 'react-icons/si';
import { motion } from 'framer-motion';

export function Navbar() {
    const pathname = usePathname();

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none"
        >
            <div className="pointer-events-auto bg-black/40 backdrop-blur-md border border-green-500/20 rounded-full px-6 py-3 flex items-center gap-8 shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)]">
                <a
                    href="https://github.com/HimanM/Seel-Soul"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <FaGithub className="text-2xl" />
                </a>

                <div className="w-px h-4 bg-green-900/50" />

                <Link
                    href="/"
                    className={`flex items-center gap-2 transition-colors ${pathname === '/' ? 'text-green-400' : 'text-gray-400 hover:text-green-300'
                        }`}
                >
                    <FaGhost className="text-xl" />
                    <span className="font-bold tracking-wider text-sm uppercase">Soul Stream</span>
                </Link>

                <div className="w-px h-4 bg-green-900/50" />

                <Link
                    href="/kafka"
                    className={`flex items-center gap-2 transition-colors ${pathname === '/kafka' ? 'text-green-400' : 'text-gray-400 hover:text-green-300'
                        }`}
                >
                    <SiApachekafka className="text-xl" />
                    <span className="font-bold tracking-wider text-sm uppercase">Kafka Docs</span>
                </Link>
            </div>
        </motion.nav>
    );
}
