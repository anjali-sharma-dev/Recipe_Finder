import React from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../assets/bgImg.png'; 

const Home = () => {
  const navigate = useNavigate();
  
  const handleGetStartedClick = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImage})`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
      
      <div className="absolute top-20 left-10 w-20 h-20 bg-orange-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-emerald-500/20 rounded-full blur-lg animate-pulse delay-500" />
      
      <div className="relative z-10 px-6 sm:px-8 animate-fade-in">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-4">
              <span className="inline-block transform hover:scale-110 transition-transform duration-300">🍴</span>
              <span className="gradient-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                Recipe
              </span>
              <span className="text-white"> </span>
              <span className="gradient-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                Finder
              </span>
              <span className="inline-block transform hover:scale-110 transition-transform duration-300 ml-2">🔍</span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 font-light leading-relaxed max-w-3xl mx-auto">
              Discover delicious recipes for every mood, ingredient, and occasion. 
              <span className="block mt-2 text-orange-300 font-medium">
                Start your culinary adventure now!
              </span>
            </p>
          </div>
          
          <div className="mt-12 space-y-6">
            <button
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-10 rounded-full shadow-2xl shadow-orange-500/30 transform hover:scale-105 transition-all duration-300 hover:shadow-orange-500/40"
              onClick={handleGetStartedClick}
            >
              <span className="relative z-10">Get Started</span>
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/80">
              <div className="flex items-center gap-2 text-sm md:text-base">
                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                <span>Smart ingredient matching</span>
              </div>
              <div className="flex items-center gap-2 text-sm md:text-base">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span>Dietary preferences</span>
              </div>
              <div className="flex items-center gap-2 text-sm md:text-base">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                <span>Step-by-step instructions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;