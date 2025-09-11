import React from 'react'
import MealCards from '../MealCards'
import { useLocation, useNavigate } from "react-router-dom";

const Result = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const meals = location.state?.meals || [];
   
   const handleBackClick = () => {
     navigate(-1);
   };
   
   const handleNewSearchClick = () => {
     navigate('/dashboard');
   };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12 animate-fade-in">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Recipe Results
              </span>
              {meals.length > 0 && (
                <span className="ml-4 text-2xl md:text-3xl text-gray-600 font-normal">
                  ({meals.length} found)
                </span>
              )}
            </h2>
            <p className="text-gray-600 text-lg">
              {meals.length > 0 
                ? "Here are the delicious recipes we found for you!" 
                : "Let's find some amazing recipes together!"
              }
            </p>
          </div>
        <button
  className="group inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-semibold py-3 px-6 rounded-xl border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
  onClick={handleBackClick}
>
  <svg
    className="w-5 h-3 transform group-hover:-translate-x-1 transition-transform duration-300"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
</button>

        </div>

        {meals.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No recipes found</h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              We couldn't find any recipes matching your ingredients. Try different combinations like "chicken, rice" or "pasta, tomato".
            </p>
            <button
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={handleNewSearchClick}
            >
              Try Again
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {meals.map((item, index) => (
              <div 
                key={item.idMeal} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MealCards data={item} />
              </div>
            ))}
          </div>
        )}

        {meals.length > 0 && (
          <div className="mt-16 text-center animate-fade-in">
            <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-2xl p-8 border border-orange-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
              Found {meals.length} amazing recipe{meals.length !== 1 ? 's' : ''}!
              </h3>
              <p className="text-gray-600 mb-6">
                Click on any recipe card to view detailed instructions, ingredients, and cooking steps.
              </p>
              <button
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-semibold py-3 px-6 rounded-xl border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleNewSearchClick}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Search for More Recipes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Result