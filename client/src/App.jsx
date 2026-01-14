import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import UpcomingFeatures from './components/UpcomingFeatures';
import Playground from './components/Playground';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-brand-200">
      <Header />
      <main>
        <Hero />
        <UpcomingFeatures />
        <Playground />
      </main>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>&copy; 2026 Pebbles AI. Built with Gemini 1.5 Flash.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
