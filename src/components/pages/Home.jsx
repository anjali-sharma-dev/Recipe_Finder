import { ChevronDown } from "lucide-react";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../assets/bgImg.png';

function Home() {
  const navigate = useNavigate();

  function goToDashboard() {
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden py-8">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />

      <div className="absolute top-20 left-10 w-20 h-20 bg-orange-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-emerald-500/20 rounded-full blur-lg animate-pulse delay-500" />

      <div className="relative z-10 px-6 sm:px-8 animate-fade-in">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 text-md">
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-4">
              <span className="inline-block transform hover:scale-110 transition-transform duration-300">🍴</span>

              <span className="gradient-text bg-gradient-to-r text-md from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">Recipe Finder</span>
    
              <span className="inline-block transform hover:scale-110 transition-transform duration-300 ml-2 text-md">🍴</span>

            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 font-light leading-relaxed max-w-3xl mx-auto">
              Discover delicious recipes for every mood, ingredient, and occasion.
              <span className="block mt-2 text-orange-300 font-medium">Start your culinary adventure now!</span>
            </p>
          </div>

<div className="mt-16 flex flex-col items-center space-y-6 relative">
  <ChevronDown className="w-8 h-8 text-orange-400 animate-bounce" />

 <button
  onClick={goToDashboard}
  className="relative group overflow-hidden px-12 py-4 rounded-full font-semibold text-lg text-white shadow-lg shadow-orange-500/30 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 transition-all duration-500 hover:scale-110 hover:shadow-orange-500/50 focus:outline-none focus:ring-0"
>
  <span className="relative z-10">Get Started</span>
  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
</button>

</div>

        </div>
      </div>
    </div>
  );
}
export default Home;