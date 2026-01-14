import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Playground from '../components/Playground';

const HomePage = () => {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <Playground />
            </main>
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="container mx-auto px-6 text-center text-gray-400">
                    <p>&copy; 2026 Pebbles AI. Built with Gemini 2.0 Flash.</p>
                </div>
            </footer>
        </>
    );
};

export default HomePage;
