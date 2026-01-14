import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
    const scrollToDemo = () => {
        document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="pt-32 pb-20 px-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-100 rounded-full blur-3xl opacity-30 -z-10" />

            <div className="container mx-auto text-center max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 bg-white border border-brand-100 rounded-full px-4 py-1.5 mb-8 shadow-sm"
                >
                    <Sparkles size={14} className="text-brand-600" />
                    <span className="text-xs font-semibold text-brand-700 uppercase tracking-wide">Powered by Gemini 1.5 Flash</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6"
                >
                    Stop Typing. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-600">
                        Start Speaking.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
                >
                    The AI assistant that fills boring forms for you. Just tell it what to do, and watch the fields populate instantly.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <button
                        onClick={scrollToDemo}
                        className="group bg-brand-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-700 transition-all shadow-lg hover:shadow-brand-500/25 flex items-center gap-2"
                    >
                        Try Live Demo
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="px-8 py-4 rounded-full font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                        Watch Video
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
