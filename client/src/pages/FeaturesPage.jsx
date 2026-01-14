import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Chrome, ShoppingCart, Sparkles, ArrowRight, ArrowLeft, Mic } from 'lucide-react';

const upcomingFeatures = [
    {
        id: 1,
        icon: Globe,
        title: "Multi-Lingual Support",
        description: "Speak in your native language and let Pebbles fill forms in any language. Supporting 50+ languages including Hindi, Spanish, French, Mandarin, Arabic, and many more regional languages.",
        gradient: "from-blue-500 to-cyan-400",
        bgGlow: "bg-blue-500/20",
        status: "Coming Q2 2026",
        highlights: ["50+ Languages", "Auto-Translation", "Regional Accents", "Real-time Processing"],
        details: [
            "Seamless language switching mid-conversation",
            "Support for mixed-language input",
            "Accent-aware speech recognition",
            "Automatic form language detection"
        ]
    },
    {
        id: 2,
        icon: Chrome,
        title: "Browser Extension",
        description: "One-click form filling on any website. Our Chrome & Firefox extension brings Pebbles' voice AI directly to your browser for seamless autofill on any form across the web.",
        gradient: "from-purple-500 to-pink-500",
        bgGlow: "bg-purple-500/20",
        status: "Coming Q3 2026",
        highlights: ["Chrome & Firefox", "One-Click Fill", "Smart Detection", "Privacy First"],
        details: [
            "Automatic form field detection",
            "Works on any website",
            "Secure local processing option",
            "Keyboard shortcuts for power users"
        ]
    },
    {
        id: 3,
        icon: ShoppingCart,
        title: "E-commerce Integration",
        description: "Voice checkout for online shopping. Say your shipping details, payment preferences, and complete purchases hands-free on major e-commerce platforms.",
        gradient: "from-orange-500 to-red-500",
        bgGlow: "bg-orange-500/20",
        status: "Coming Q4 2026",
        highlights: ["Voice Checkout", "Secure Payments", "Major Platforms", "Order Tracking"],
        details: [
            "Integration with Amazon, Shopify, WooCommerce",
            "Voice-activated payment confirmation",
            "Address book with voice selection",
            "Real-time order status updates"
        ]
    }
];

const FeatureCard = ({ feature, index }) => {
    const Icon = feature.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="relative group"
        >
            <div className={`absolute -inset-2 ${feature.bgGlow} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

            <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-2xl overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-40 h-40 opacity-5">
                    <Icon size={160} />
                </div>

                <div className="absolute top-6 right-6">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${feature.gradient} text-white shadow-lg`}>
                        <Sparkles size={12} />
                        {feature.status}
                    </span>
                </div>

                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon size={40} className="text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">{feature.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {feature.highlights.map((highlight, i) => (
                        <span key={i} className={`px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r ${feature.gradient} bg-opacity-10 text-gray-800`}>
                            {highlight}
                        </span>
                    ))}
                </div>

                <div className="border-t border-gray-100 pt-6 mt-6">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">What to expect</h4>
                    <ul className="space-y-2">
                        {feature.details.map((detail, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-600">
                                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.gradient}`}></div>
                                {detail}
                            </li>
                        ))}
                    </ul>
                </div>

                <button className="mt-6 flex items-center gap-2 text-sm font-bold text-gray-900 group/btn hover:gap-3 transition-all">
                    <span>Get Notified</span>
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
};

const FeaturesPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                            <Mic size={20} />
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">Pebbles</span>
                    </Link>

                    <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={18} />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="pt-32 pb-16 relative overflow-hidden">
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-100 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute top-40 right-1/4 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-40"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <span className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-brand-500 to-purple-500 text-white rounded-full text-sm font-bold mb-6 shadow-lg">
                            <Sparkles size={16} />
                            Roadmap 2026
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Upcoming <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">Features</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            We're constantly improving Pebbles to make form-filling even more magical.
                            Here's a sneak peek at what's coming next in our exciting roadmap.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {upcomingFeatures.map((feature, index) => (
                            <FeatureCard key={feature.id} feature={feature} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-12 md:p-16 text-center"
                    >
                        <div className="absolute top-0 left-0 w-full h-full opacity-30">
                            <div className="absolute top-10 left-10 w-40 h-40 bg-brand-500 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-10 right-10 w-60 h-60 bg-purple-500 rounded-full blur-3xl"></div>
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Want Early Access?
                            </h2>
                            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                                Join 2,000+ users on our waitlist and be the first to try these features when they launch.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full sm:w-80 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                                <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-xl">
                                    Join Waitlist
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-8">
                <div className="container mx-auto px-6 text-center text-gray-400">
                    <p>&copy; 2026 Pebbles AI. Built with Gemini 2.0 Flash.</p>
                </div>
            </footer>
        </div>
    );
};

export default FeaturesPage;
