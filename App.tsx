
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import VideoCreator from './components/VideoCreator';
import AffiliateProgram from './components/AffiliateProgram';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/creator" element={<VideoCreator />} />
            <Route path="/affiliate" element={<AffiliateProgram />} />
            <Route path="/analytics" element={<div className="p-10 text-center text-gray-500">Analytics integration coming soon. Use Dashboard for overview.</div>} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t border-gray-200 py-10">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-xs font-bold">A</div>
                <span className="text-lg font-bold">AutoVid</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">The world's first fully autonomous video creation platform for creators who value time.</p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Product</h4>
              <ul className="text-sm text-gray-500 space-y-2">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">AI Engine</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Compliance</h4>
              <ul className="text-sm text-gray-500 space-y-2">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">YouTube Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Support</h4>
              <ul className="text-sm text-gray-500 space-y-2">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">API Status</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-10 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-gray-400">
            <p>&copy; 2024 AutoVid AI. All rights reserved.</p>
            <p>Earnings not typical. Results depend on niche, strategy, and content quality.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
