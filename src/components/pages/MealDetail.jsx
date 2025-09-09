import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const extractIngredients = (meal) => {
  const ingredients = [];
  
  for (let i = 1; i <= 20; i++) {
    const ingredientKey = `strIngredient${i}`;
    const measureKey = `strMeasure${i}`;
    
    const ingredient = meal[ingredientKey];
    const measure = meal[measureKey];
    
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: (measure || '').trim()
      });
    }
  }
  
  return ingredients;
};

const MealDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: routeId } = useParams();

  const mealFromState = location.state?.meal;
  const mealId = routeId || mealFromState?.idMeal;

  const [meal, setMeal] = useState(mealFromState || null);
  const [isLoading, setIsLoading] = useState(!mealFromState);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    
    async function fetchMealById(mealId) {
      if (!mealId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(mealId)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        const mealData = data?.meals && data.meals[0] ? data.meals[0] : null;
        
        if (!isCancelled) {
          if (mealData) {
            setMeal(mealData);
          } else {
            setError('Meal not found');
          }
        }
      } catch (error) {
        if (!isCancelled) {
          setError('Failed to load meal');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }
    
    fetchMealById(mealId);
    
    return () => {
      isCancelled = true;
    };
  }, [mealId]);

  const ingredients = useMemo(() => (meal ? extractIngredients(meal) : []), [meal]);

  if (!mealId) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <button
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <p className="text-gray-700">No meal selected.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <button
          className="group mb-8 inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-semibold py-3 px-6 rounded-xl border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          onClick={() => navigate(-1)}
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Results
        </button>

        {isLoading && !meal ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading delicious recipe...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300"
              onClick={() => navigate('/dashboard')}
            >
              Try Again
            </button>
          </div>
        ) : meal ? (
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
            <div className="relative">
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-full h-96 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {meal.strYoutube && (
                <a
                  className="absolute top-6 right-6 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  href={meal.strYoutube}
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Watch Tutorial
                </a>
              )}
            </div>

            <div className="p-8 md:p-12">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                  {meal.strMeal}
                </h1>
                
                <div className="flex flex-wrap gap-3">
                  {meal.strCategory && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm shadow-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {meal.strCategory}
                    </span>
                  )}
                  {meal.strArea && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm shadow-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {meal.strArea}
                    </span>
                  )}
                  {meal.strTags && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-sm shadow-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {String(meal.strTags)}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Ingredients</h2>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <ul className="space-y-3">
                      {ingredients.map((row, idx) => (
                        <li key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                          <span className="font-medium text-gray-800">{row.ingredient}</span>
                          <span className="text-orange-600 font-semibold bg-orange-50 px-3 py-1 rounded-full text-sm">
                            {row.measure}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Instructions</h2>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                        {meal.strInstructions}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MealDetail; 