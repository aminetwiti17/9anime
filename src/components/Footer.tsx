import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Github, Twitter, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-900 border-t border-primary-900/20 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-primary-400">
              <Play className="h-8 w-8" />
              <span className="text-xl font-bold">AniStream</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Your premium destination for anime streaming. Watch your favorite series and discover new ones.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/search" className="hover:text-primary-400 transition-colors">Browse</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary-400 transition-colors">My List</Link></li>
              <li><Link to="/profile" className="hover:text-primary-400 transition-colors">Profile</Link></li>
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular Genres</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/search?genre=Action" className="hover:text-primary-400 transition-colors">Action</Link></li>
              <li><Link to="/search?genre=Adventure" className="hover:text-primary-400 transition-colors">Adventure</Link></li>
              <li><Link to="/search?genre=Drama" className="hover:text-primary-400 transition-colors">Drama</Link></li>
              <li><Link to="/search?genre=Fantasy" className="hover:text-primary-400 transition-colors">Fantasy</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-900/20 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 AniStream. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};