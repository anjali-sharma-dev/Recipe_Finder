import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ recipeData }) => {
  const navigate = useNavigate();
  
  const handleRecipeCardClick = () => {
    navigate(`/recipe/${recipeData.idMeal}`, { state: { meal: recipeData } });
  };
  
  return (
    <div 
      className="group relative bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 w-full max-w-sm mx-auto border border-gray-100 hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer animate-fade-in"
      onClick={handleRecipeCardClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={recipeData.strMealThumb}
          alt={recipeData.strMeal}
          className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
       
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transform translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
        
        {recipeData.strCategory && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-orange-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            {recipeData.strCategory}
          </div>
        )}
      </div>
      
      <div className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
          {recipeData.strMeal}
        </h3>
        
        {recipeData.strArea && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-3">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">{recipeData.strArea}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm text-gray-500 font-medium">View Recipe</span>
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default RecipeCard;
