import React from 'react';
import { Link } from 'react-router-dom';
import { Mic } from 'lucide-react';

const Header = () => {
    return (
        <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-brand-100">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                        <Mic size={20} />
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">Pebbles</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/features" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Features</Link>
                    <a href="/#how-it-works" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">How it Works</a>
                    <a href="/#demo" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Live Demo</a>
                </nav>

                <button className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                    Join Waitlist
                </button>
            </div>
        </header>
    );
};

export default Header;
