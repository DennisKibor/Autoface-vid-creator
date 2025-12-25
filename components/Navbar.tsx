
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight">AutoVid</Link>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
            <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
            <Link to="/creator" className="hover:text-indigo-600 transition-colors">Create Video</Link>
            <Link to="/analytics" className="hover:text-indigo-600 transition-colors">Analytics</Link>
            <Link to="/affiliate" className="hover:text-indigo-600 transition-colors">Affiliate</Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm">
              Upgrade
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
