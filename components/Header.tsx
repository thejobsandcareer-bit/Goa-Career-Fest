import React from 'react';

const Header = () => (
  <header className="bg-white py-5 sticky top-0 z-50 shadow-md border-b border-gray-100">
    <div className="container mx-auto px-4 flex justify-between items-center">
      <a 
        href="https://www.thejobsandcareer.com/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="font-poppins font-bold text-xl md:text-2xl tracking-tight hover:opacity-80 transition-opacity"
      >
        <span className="text-[#040084]">The</span> <span className="text-[#ff6100]">Jobs</span> <span className="text-[#040084]">&</span> <span className="text-[#ff6100]">Career</span>
      </a>
      <div className="text-white text-[10px] md:text-xs font-bold font-poppins bg-gradient-to-r from-[#ff6100] to-red-500 px-3 py-1.5 rounded-full shadow-lg tracking-wide uppercase transform hover:scale-105 transition-transform">
        Goa Career Fest 2026
      </div>
    </div>
  </header>
);

export default Header;