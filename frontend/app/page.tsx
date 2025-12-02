'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGhost, FaSkull, FaBalanceScale, FaDungeon, FaScroll, FaTimes, FaTerminal } from 'react-icons/fa';
import { SoulOrb } from '@/components/SoulOrb';
import { GlassCard } from '@/components/GlassCard';

type EventLog = {
    type: string;
    data: unknown;
    timestamp: string;
};

type Verdict = {
    final_verdict: string;
    destination: string;
    soul_name: string;
};

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [events, setEvents] = useState<EventLog[]>([]);
    const [userName, setUserName] = useState('');
    const [verdict, setVerdict] = useState<Verdict | null>(null);
    const ws = useRef<WebSocket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        // Connect directly to backend port 8000 to avoid Next.js proxy issues
        const wsUrl = `${protocol}//${window.location.hostname}:8000/ws`;

        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log('Connected to Soul Stream');
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setEvents((prev) => [...prev, { ...data, timestamp: new Date().toLocaleTimeString() }]);

            if (data.type === 'revelations') {
                setVerdict(data.data);
                setLoading(false);
            }
        };

        return () => {
            ws.current?.close();
        };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [events]);

    const sellSoul = async () => {
        if (!userName) {
            setMessage('Who is offering their soul?');
            return;
        }

        setLoading(true);
        setMessage('');
        setEvents([]);
        setVerdict(null);
        try {
            const response = await fetch('/api/contracts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    soul_name: userName,
                    sin_level: 666
                }),
            });

            let data;
            try {
                data = await response.json();
            } catch {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            if (response.ok) {
                setMessage('Soul contract signed in blood...');
            } else {
                setMessage(`Error: ${data.detail || 'Unknown error'}`);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to connect to the Void';
            setMessage(errorMessage);
            console.error(error);
        }
    };

    return (
        <main className="min-h-screen bg-black text-green-500 font-mono selection:bg-green-900 selection:text-white overflow-hidden relative">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 container mx-auto px-4 py-24 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter text-white">
                        KAFKA <span className="text-green-500">SOUL</span> STREAM
                    </h1>
                    <p className="text-gray-500 text-lg">Event-Driven Soul Architecture</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Soul Contract Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <GlassCard className="p-8 h-full flex flex-col items-center justify-center text-center border-green-500/20 shadow-[0_0_50px_-12px_rgba(34,197,94,0.2)]">
                            <SoulOrb active={loading} />

                            <h2 className="text-3xl font-bold text-white mb-2">The Offering</h2>
                            <p className="text-gray-400 mb-8 max-w-md">
                                Exchange your soul for eternal knowledge of distributed systems.
                                Transaction is irreversible.
                            </p>

                            <div className="w-full max-w-sm space-y-4">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        placeholder="Enter Name of the Vessel"
                                        className="w-full bg-black/50 border border-green-900/50 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-center"
                                    />
                                    <div className="absolute inset-0 rounded-lg bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={sellSoul}
                                    disabled={loading}
                                    className={`w-full py-4 rounded-lg font-bold text-lg tracking-widest uppercase transition-all ${loading
                                        ? 'bg-gray-900 text-gray-500 cursor-not-allowed border border-gray-800'
                                        : 'bg-green-600 hover:bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]'
                                        }`}
                                >
                                    {loading ? 'Transmitting Soul...' : 'Sell Soul'}
                                </motion.button>

                                <AnimatePresence>
                                    {message && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className={`text-sm p-2 rounded ${message.includes('Error') || message.includes('Who')
                                                ? 'text-red-400 bg-red-900/10'
                                                : 'text-green-400 bg-green-900/10'
                                                }`}
                                        >
                                            {message}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Live Event Stream */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col h-[600px]"
                    >
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <FaTerminal className="text-green-500" />
                                Live Soul Log
                            </h2>
                            <div className="flex gap-2 text-xs">
                                <span className="flex items-center gap-1 text-blue-400"><span className="w-2 h-2 rounded-full bg-blue-500"></span>CONTRACT</span>
                                <span className="flex items-center gap-1 text-yellow-400"><span className="w-2 h-2 rounded-full bg-yellow-500"></span>JUDGMENT</span>
                                <span className="flex items-center gap-1 text-purple-400"><span className="w-2 h-2 rounded-full bg-purple-500"></span>ASCENSION</span>
                                <span className="flex items-center gap-1 text-red-500"><span className="w-2 h-2 rounded-full bg-red-600"></span>REVELATION</span>
                            </div>
                        </div>

                        <GlassCard className="flex-1 overflow-hidden flex flex-col bg-black/40 border-green-500/10">
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-transparent"
                            >
                                <AnimatePresence mode='popLayout'>
                                    {events.length === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="h-full flex flex-col items-center justify-center text-gray-700 space-y-4"
                                        >
                                            <FaGhost className="text-6xl opacity-20" />
                                            <p>Awaiting soul transmission...</p>
                                        </motion.div>
                                    )}

                                    {events.map((event, index) => (
                                        <motion.div
                                            key={`${event.timestamp}-${index}`}
                                            initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                            animate={{ opacity: 1, x: 0, scale: 1 }}
                                            layout
                                            className={`relative p-4 rounded-lg border-l-4 backdrop-blur-sm ${event.type === 'contracts' ? 'bg-blue-900/10 border-blue-500' :
                                                event.type === 'judgments' ? 'bg-yellow-900/10 border-yellow-500' :
                                                    event.type === 'ascensions' ? 'bg-purple-900/10 border-purple-500' :
                                                        'bg-red-900/10 border-red-500'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    {event.type === 'contracts' && <FaScroll className="text-blue-500" />}
                                                    {event.type === 'judgments' && <FaBalanceScale className="text-yellow-500" />}
                                                    {event.type === 'ascensions' && <FaDungeon className="text-purple-500" />}
                                                    {event.type === 'revelations' && <FaSkull className="text-red-500" />}
                                                    <span className="font-bold text-sm uppercase tracking-wider text-white">
                                                        {event.type}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500 font-mono">{event.timestamp}</span>
                                            </div>

                                            <div className="font-mono text-xs text-gray-300 overflow-x-auto">
                                                <pre className="whitespace-pre-wrap break-words">
                                                    {JSON.stringify(event.data, null, 2)}
                                                </pre>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>

            {/* Final Verdict Overlay */}
            <AnimatePresence>
                {verdict && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
                    >
                        <div className="absolute top-8 right-8 z-50">
                            <button
                                onClick={() => setVerdict(null)}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/50 hover:text-white transition-colors"
                            >
                                <FaTimes className="text-2xl" />
                            </button>
                        </div>

                        <div className="text-center p-8 max-w-4xl relative">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
                            >
                                <FaSkull className="text-9xl text-red-600 mx-auto mb-8 animate-pulse" />
                            </motion.div>

                            <motion.h2
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 via-red-600 to-red-900 mb-8 tracking-tighter drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                            >
                                JUDGMENT<br />RENDERED
                            </motion.h2>

                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="space-y-6"
                            >
                                <p className="text-2xl md:text-4xl text-red-500 font-bold uppercase tracking-widest border-y-2 border-red-900/30 py-8">
                                    {verdict.final_verdict}
                                </p>

                                <p className="text-gray-500 font-mono text-sm">
                                    DESTINATION: <span className="text-white">{verdict?.destination}</span>
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
