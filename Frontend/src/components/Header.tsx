import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const Header: React.FC = () => (
  <div className="bg-gray-800 shadow-lg border-b border-gray-700">
    <div className="container mx-auto max-w-2xl px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          <h1 className="text-2xl font-bold text-white">AI Chat</h1>
        </div>
        <nav className="flex gap-4">
          <Link to="/" className="text-gray-300 hover:text-white">Meals</Link>
          <Link to="/ingredients" className="text-gray-300 hover:text-white">Ingredients</Link>
        </nav>
      </div>
    </div>
  </div>
);
