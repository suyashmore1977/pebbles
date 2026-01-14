import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Chrome, ShoppingCart, Sparkles, ArrowRight } from 'lucide-react';

const upcomingFeatures = [
    {
        id: 1,
        icon: Globe,
        title: "Multi-Lingual Support",
        description: "Speak in your native language and let Pebbles fill forms in any language. Supporting 50+ languages including Hindi, Spanish, French, Mandarin, and more.",
        gradient: "from-blue-500 to-cyan-400",
        bgGlow: "bg-blue-500/20",
        status: "Coming Q2 2026",
        highlights: ["50+ Languages", "Auto-Translation", "Regional Accents"]
    },
    {
        id: 2,
        icon: Chrome,
        title: "Browser Extension",
        description: "One-click form filling on any website. Our Chrome & Firefox extension brings Pebbles' voice AI directly to your browser for seamless autofill.",
        gradient: "from-purple-500 to-pink-500",
        bgGlow: "bg-purple-500/20",
        status: "Coming Q3 2026",
        highlights: ["Chrome & Firefox", "One-Click Fill", "Smart Detection"]
    },
    {
        id: 3,
        icon: ShoppingCart,
        title: "E-commerce Integration",
        description: "Voice checkout for online shopping. Say your shipping details, payment preferences, and complete purchases hands-free on major platforms.",
        gradient: "from-orange-500 to-red-500",
        bgGlow: "bg-orange-500/20",
        status: "Coming Q4 2026",
        highlights: ["Voice Checkout", "Secure Payments", "Major Platforms"]
    }
];

const FeatureCard = ({ feature, index }) => {
    const Icon = feature.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="relative group"
        >
            {/* Glow Effect */}
            <div className={`absolute -inset-1 ${feature.bgGlow} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

            {/* Card */}
            <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-2xl overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                    <Icon size={128} />
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${feature.gradient} text-white shadow-lg`}>
                        <Sparkles size={12} />
                        {feature.status}
                    </span>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={32} className="text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {feature.highlights.map((highlight, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 font-medium">
                            {highlight}
                        </span>
                    ))}
                </div>

                {/* CTA */}
                <button className="flex items-center gap-2 text-sm font-semibold text-gray-900 group/btn">
                    <span>Get Notified</span>
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
};

const UpcomingFeatures = () => {
    return (
        <section id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-100 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30"></div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full text-sm font-semibold mb-4">
                        <Sparkles size={16} />
                        Coming Soon
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Upcoming Features
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        We're constantly improving Pebbles to make form-filling even more magical.
                        Here's a sneak peek at what's coming next.
                    </p>
                </motion.div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcomingFeatures.map((feature, index) => (
                        <FeatureCard key={feature.id} feature={feature} index={index} />
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-gray-900 rounded-2xl shadow-2xl">
                        <div className="text-left">
                            <h4 className="text-white font-bold text-lg">Want early access?</h4>
                            <p className="text-gray-400 text-sm">Join 2,000+ users on our waitlist</p>
                        </div>
                        <button className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
                            Join Waitlist
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default UpcomingFeatures;
