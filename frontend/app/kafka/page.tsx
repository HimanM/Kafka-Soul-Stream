'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { SiApachekafka } from 'react-icons/si';
import { FaExternalLinkAlt, FaServer, FaNetworkWired, FaDocker, FaShieldAlt, FaScroll, FaHeart } from 'react-icons/fa';

export default function KafkaDocs() {
    return (
        <main className="min-h-screen bg-black text-green-500 font-mono selection:bg-green-900 selection:text-white relative pt-24 pb-12">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none fixed" />

            <div className="relative z-10 container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <SiApachekafka className="text-5xl md:text-8xl text-white mx-auto mb-6" />
                    <h1 className="text-3xl md:text-6xl font-bold mb-4 tracking-tighter text-white">
                        SOUL <span className="text-green-500">STREAMING</span>
                    </h1>
                    <p className="text-gray-500 text-sm md:text-lg uppercase tracking-widest">
                        Architecture of the Damned
                    </p>
                </motion.div>

                <div className="space-y-12">
                    {/* Introduction */}
                    <Section title="1. The Soul Protocol (Introduction)" icon={<FaNetworkWired />}>
                        <p className="mb-4">
                            Modern soul harvesting relies on distributed systems to ensure no soul is lost in transit.
                            <strong>Apache Kafka</strong> is the backbone of our ethereal pipeline, enabling high-throughput,
                            fault-tolerant soul streaming.
                        </p>
                        <p>
                            This architecture ensures that when a vessel (User) signs a contract, the event is durably stored
                            and processed asynchronously by our legion of microservices.
                        </p>
                    </Section>

                    {/* What is Kafka */}
                    <Section title="2. What is Apache Kafka?" icon={<SiApachekafka />}>
                        <p className="mb-4">
                            Apache Kafka is a <strong>distributed event streaming platform</strong>. Think of it as the
                            River Styx—a continuous, reliable flow of data (souls) that connects different realms (services).
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
                            <li><strong className="text-green-400">Publish & Subscribe:</strong> Services send and receive soul contracts.</li>
                            <li><strong className="text-green-400">Durability:</strong> Events are written to disk (The Ledger).</li>
                            <li><strong className="text-green-400">Scalability:</strong> Handles billions of souls per second.</li>
                        </ul>
                    </Section>

                    {/* Why Kafka vs API */}
                    <Section title="3. Why Kafka for Microservices? (vs REST API)" icon={<FaServer />}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-green-900/50 text-green-400">
                                        <th className="p-4">Feature</th>
                                        <th className="p-4">Kafka (Soul Stream)</th>
                                        <th className="p-4">REST API (Direct Call)</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-400">
                                    <tr className="border-b border-green-900/20">
                                        <td className="p-4 text-white">Coupling</td>
                                        <td className="p-4">Loose (Decoupled)</td>
                                        <td className="p-4">Tight (Dependent)</td>
                                    </tr>
                                    <tr className="border-b border-green-900/20">
                                        <td className="p-4 text-white">Reliability</td>
                                        <td className="p-4">Persistent & Replayable</td>
                                        <td className="p-4">Stateless (Lost if failed)</td>
                                    </tr>
                                    <tr className="border-b border-green-900/20">
                                        <td className="p-4 text-white">Communication</td>
                                        <td className="p-4">Asynchronous</td>
                                        <td className="p-4">Synchronous (Blocking)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-4 text-sm text-gray-500">
                            If the Judgment Service is down, the Contract remains in Kafka until it returns. No soul is left behind.
                        </p>
                    </Section>

                    {/* Core Concepts */}
                    <Section title="4. Core Concepts" icon={<FaDocker />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Concept title="Broker" desc="The Kafka server. The Keeper of the Stream." />
                            <Concept title="Topics" desc="Channels like 'contracts', 'judgments', 'ascensions'." />
                            <Concept title="Producers" desc="Services that emit events (Contract Service)." />
                            <Concept title="Consumers" desc="Services that read events (Judgment, Limbo)." />
                        </div>
                    </Section>

                    {/* Microservices Architecture */}
                    <Section title="5. The Architecture" icon={<FaNetworkWired />}>
                        <p className="mb-4 text-gray-400">
                            Our system consists of <strong>4 Microservices</strong> communicating via <strong>3 Kafka Topics</strong>.
                        </p>
                        <div className="bg-black/50 p-6 rounded-lg border border-green-900/50 font-mono text-xs md:text-sm overflow-x-auto">
                            <pre className="text-green-400">
                                {`Frontend (Next.js)
       |
   [HTTP POST]
       |
Contract Service
       |
   [Produce 'contracts']
       |
     KAFKA ----------------+
       |                   |
[Consume 'contracts']      |
       |                   |
Judgment Service           |
       |                   |
   [Produce 'judgments']   |
       |                   |
     KAFKA ----------------+
       |
[Consume 'judgments']
       |
Limbo Service
       |
   [Produce 'ascensions']
       |
     KAFKA ----------------+
       |                   |
[Consume 'ascensions']     |
       |                   |
Revelation Service         |
       |                   |
   [Produce 'revelations'] |
       |                   |
     KAFKA ----------------+
       |
Frontend (WebSocket)`}
                            </pre>
                        </div>
                    </Section>

                    {/* Project Structure */}
                    <Section title="6. Project Structure" icon={<FaDocker />}>
                        <p className="mb-4 text-gray-400">
                            The project is organized into independent microservices, each with its own Docker container.
                        </p>
                        <div className="bg-black/50 p-4 rounded border border-green-900/30 font-mono text-sm text-gray-300">
                            <ul className="space-y-2">
                                <li><span className="text-blue-400">contract-service/</span> - Receives user input, signs contracts.</li>
                                <li><span className="text-yellow-400">judgment-service/</span> - Decides the fate of the soul (Guilty/Pure).</li>
                                <li><span className="text-purple-400">limbo-service/</span> - Assigns a final destination (Void, Greed, etc.).</li>
                                <li><span className="text-red-400">revelation-service/</span> - Generates the final dramatic verdict.</li>
                                <li><span className="text-green-400">frontend/</span> - Next.js UI for user interaction and visualization.</li>
                            </ul>
                        </div>
                    </Section>

                    {/* User Flow */}
                    <Section title="7. How User Inputs Flow Through Kafka" icon={<FaScroll />}>
                        <p className="mb-4 text-gray-400">Example: A user sells their soul.</p>
                        <ol className="list-decimal list-inside space-y-3 text-gray-300 ml-2">
                            <li><strong className="text-white">User enters name</strong> in frontend (it never talks to Kafka directly).</li>
                            <li><strong className="text-white">Contract Service</strong> receives input via API and validates.</li>
                            <li>Service produces a <code className="text-green-400">ContractSigned</code> event into Kafka.</li>
                            <li><strong className="text-white">Judgment Service</strong> consumes <code className="text-green-400">ContractSigned</code> → processes → emits <code className="text-yellow-400">JudgmentRendered</code>.</li>
                            <li><strong className="text-white">Limbo Service</strong> receives <code className="text-yellow-400">JudgmentRendered</code> → assigns destination → emits <code className="text-purple-400">AscensionStarted</code>.</li>
                            <li><strong className="text-white">Revelation Service</strong> receives <code className="text-purple-400">AscensionStarted</code> → emits <code className="text-red-400">FinalRevelation</code>.</li>
                            <li><strong className="text-white">Frontend</strong> receives the final verdict via WebSocket.</li>
                        </ol>
                        <p className="mt-4 text-sm text-gray-500 italic">
                            Kafka only carries events, never private user data like credit card numbers (though we do take your soul).
                        </p>
                    </Section>

                    {/* Internal Communication */}
                    <Section title="8. Communication Without Exposed Ports" icon={<FaShieldAlt />}>
                        <p className="mb-4 text-gray-400">Inside Docker Compose:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li>Containers share an <strong>internal network</strong>.</li>
                            <li>Kafka is reachable by service name, e.g.: <code className="text-green-400">kafka:9092</code>.</li>
                            <li>Microservices access Kafka using this internal hostname.</li>
                            <li><strong>No need to expose internal ports</strong> to the public.</li>
                        </ul>
                    </Section>

                    {/* Why Engineers Love Kafka */}
                    <Section title="9. Why DevOps & Cloud Engineers Love Kafka" icon={<FaHeart />}>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li>Enables <strong>distributed, scalable architectures</strong>.</li>
                            <li>Handles <strong>massive throughput</strong> with ease.</li>
                            <li>Works perfectly with <strong>Docker, Kubernetes, AWS, GCP, and Azure</strong>.</li>
                            <li>Excellent for <strong>event-driven microservices</strong>, logs, analytics, and data streaming.</li>
                        </ul>
                    </Section>

                    {/* Official Links */}
                    <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
                        <a
                            href="https://kafka.apache.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-white text-black px-6 py-4 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                        >
                            <SiApachekafka /> Official Kafka Site <FaExternalLinkAlt className="text-xs" />
                        </a>
                        <a
                            href="https://kafka.apache.org/documentation/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-green-900/20 text-green-400 border border-green-500/50 px-6 py-4 rounded-lg font-bold hover:bg-green-900/40 transition-colors"
                        >
                            <FaScroll /> Read the Docs <FaExternalLinkAlt className="text-xs" />
                        </a>
                    </div>

                </div>
            </div>
        </main>
    );
}

function Section({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <GlassCard className="p-6 md:p-8 border-green-500/10">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-green-500">{icon}</span>
                    {title}
                </h2>
                <div className="text-sm md:text-base text-gray-300 leading-relaxed">
                    {children}
                </div>
            </GlassCard>
        </motion.div>
    );
}

function Concept({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="bg-green-900/10 p-4 rounded border border-green-500/20">
            <h3 className="text-green-400 font-bold mb-1">{title}</h3>
            <p className="text-sm text-gray-400">{desc}</p>
        </div>
    );
}
