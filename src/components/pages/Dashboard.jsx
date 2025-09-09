import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [ingredientsInput, setIngredientsInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cookingMood, setCookingMood] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [cookingMethod, setCookingMethod] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [avoidIngredients, setAvoidIngredients] = useState("");
  const navigate = useNavigate();

  function onChangeIngredients(e) {
    setIngredientsInput(e.target.value);
  }

  function findCommonMeals(mealLists) {
    if (mealLists.length === 0) return [];
    
    const firstList = mealLists[0];
    if (!firstList) return [];
    
    const commonMeals = [];
    
    for (const meal of firstList) {
      const mealId = meal.idMeal;
      let isInAllLists = true;
      
      for (let i = 1; i < mealLists.length; i++) {
        const currentList = mealLists[i];
        const foundInCurrentList = currentList.some(m => m.idMeal === mealId);
        
        if (!foundInCurrentList) {
          isInAllLists = false;
          break;
        }
      }
      
      if (isInAllLists) {
        commonMeals.push(meal);
      }
    }
    
    return commonMeals;
  }

  async function fetchMealsByIngredient(ingredient) {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.meals || [];
  }

  async function fetchDetailsForMeals(meals) {
    const maxMeals = 24;
    const limitedMeals = meals.slice(0, maxMeals);
    
    const detailPromises = limitedMeals.map(async (meal) => {
      const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.meals && data.meals[0]) {
        return data.meals[0];
      } else {
        return meal;
      }
    });
    
    return Promise.all(detailPromises);
  }

  function getIngredientsList(mealDetail) {
    const ingredients = [];
    
    for (let i = 1; i <= 20; i++) {
      const ingredientKey = `strIngredient${i}`;
      const ingredient = mealDetail[ingredientKey];
      
      if (ingredient && ingredient.trim()) {
        const cleanIngredient = ingredient.trim().toLowerCase();
        ingredients.push(cleanIngredient);
      }
    }
    
    return ingredients;
  }

  function passesFilters(mealDetail) {
    const ingredients = getIngredientsList(mealDetail);
    const instructions = (mealDetail.strInstructions || '').toLowerCase();
    
    function containsKeyword(keyword) {
      return ingredients.some(ingredient => ingredient.includes(keyword));
    }
    
    if (avoidIngredients) {
      const avoidList = avoidIngredients.split(',').map(item => item.trim().toLowerCase());
      const hasAvoidedIngredient = avoidList.some(avoidedItem => 
        ingredients.some(ingredient => ingredient.includes(avoidedItem))
      );
      if (hasAvoidedIngredient) return false;
    }
    
    if (cookingMethod) {
      const methodKeywords = {
        'baking': ['bake', 'baked', 'oven', 'roast', 'roasted'],
        'grilling': ['grill', 'grilled', 'bbq', 'barbecue'],
        'stovetop': ['fry', 'fried', 'sauté', 'sautéed', 'pan', 'stir-fry'],
        'slow-cooker': ['slow', 'crock', 'simmer', 'braise'],
        'raw': ['raw', 'fresh', 'salad', 'no-cook']
      };
      
      const keywords = methodKeywords[cookingMethod] || [];
      if (keywords.length > 0) {
        const hasMatchingKeyword = keywords.some(keyword => 
          instructions.includes(keyword) || containsKeyword(keyword)
        );
        if (!hasMatchingKeyword) return false;
      }
    }
    
    if (cookingTime) {
      const timeKeywords = {
        '15min': ['quick', 'fast', 'instant', '5 min', '10 min', '15 min'],
        '30min': ['30 min', 'half hour', 'quick', 'easy'],
        '1hr': ['1 hour', '60 min', 'hour', 'simmer', 'bake'],
        '2hr+': ['2 hour', 'slow', 'marinate', 'overnight', 'braise']
      };
      
      const keywords = timeKeywords[cookingTime] || [];
      if (keywords.length > 0) {
        const hasMatchingTimeKeyword = keywords.some(keyword => 
          instructions.includes(keyword)
        );
        if (!hasMatchingTimeKeyword) return false;
      }
    }
    
    return true;
  }

  const onClickHandler = async () => {
    const userInput = ingredientsInput.trim();
    if (!userInput) return;
    
    const ingredientList = userInput.split(',').map(ingredient => ingredient.trim()).filter(Boolean);
    if (ingredientList.length === 0) return;

    try {
      setIsLoading(true);
      
      const mealLists = await Promise.all(
        ingredientList.map(ingredient => fetchMealsByIngredient(ingredient))
      );
      
      const commonMeals = findCommonMeals(mealLists);
      const detailedMeals = await fetchDetailsForMeals(commonMeals);
      const filteredMeals = detailedMeals.filter(passesFilters);
      
      navigate('/results', { state: { meals: filteredMeals } });
    } catch (error) {
      console.log("Search failed", error);
      navigate('/results', { state: { meals: [] } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mb-6 shadow-lg">
            <span className="text-3xl">🍴</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Recipe
            </span>
            <span className="text-gray-900"> </span>
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              Finder
            </span>
            <span className="ml-3 text-4xl">🔍</span>
        </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Hey Taylor! Let's figure out what to cook based on your mood, time, and what you have in the kitchen. 
            <span className="block mt-2 text-orange-600 font-semibold">
              Ready to create something delicious?
            </span>
          </p>
      </header>

        <div className="space-y-8 animate-fade-in">
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition-all duration-300">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <CiSearch className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter ingredients (comma-separated), e.g., chicken, rice, onion, garlic..."
                className="w-full py-6 pl-14 pr-4 text-lg text-gray-800 placeholder-gray-500 bg-transparent focus:outline-none"
                onChange={onChangeIngredients}
                value={ingredientsInput}
                onKeyDown={(e) => { if (e.key === 'Enter') onClickHandler(); }}
              />
              <button
                className="absolute right-2 top-2 bottom-2 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                onClick={onClickHandler}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <span>Search</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">😋</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">What's your cooking mood?</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: 'comfort', label: 'Comfort Food', icon: '🍲', desc: 'Warm & cozy' },
                  { value: 'healthy', label: 'Healthy', icon: '🥗', desc: 'Fresh & light' },
                  { value: 'indulgent', label: 'Indulgent', icon: '🍰', desc: 'Rich & decadent' },
                  { value: 'adventurous', label: 'Adventurous', icon: '🌶️', desc: 'Try something new' }
                ].map(({ value, label, icon, desc }) => (
                  <button
                    key={value}
                    onClick={() => setCookingMood(cookingMood === value ? '' : value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      cookingMood === value
                        ? 'border-pink-500 bg-pink-50 shadow-md'
                        : 'border-gray-200 hover:border-pink-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="text-2xl mb-2">{icon}</div>
                    <div className="font-semibold text-sm text-gray-900">{label}</div>
                    <div className="text-xs text-gray-500">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">⏰</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">How much time do you have?</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: '15min', label: 'Quick Fix', icon: '⚡', desc: '15 min or less' },
                  { value: '30min', label: 'Half Hour', icon: '🕐', desc: '30 minutes' },
                  { value: '1hr', label: 'Take Time', icon: '🕑', desc: '1 hour' },
                  { value: '2hr+', label: 'All Day', icon: '🕒', desc: '2+ hours' }
                ].map(({ value, label, icon, desc }) => (
                  <button
                    key={value}
                    onClick={() => setCookingTime(cookingTime === value ? '' : value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      cookingTime === value
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="text-2xl mb-2">{icon}</div>
                    <div className="font-semibold text-sm text-gray-900">{label}</div>
                    <div className="text-xs text-gray-500">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🔥</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">How do you want to cook?</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { value: 'baking', label: 'Baking', icon: '🍞' },
                  { value: 'grilling', label: 'Grilling', icon: '🔥' },
                  { value: 'stovetop', label: 'Stovetop', icon: '🍳' },
                  { value: 'slow-cooker', label: 'Slow Cook', icon: '⏳' },
                  { value: 'raw', label: 'No Cook', icon: '🥗' }
                ].map(({ value, label, icon }) => (
                  <button
                    key={value}
                    onClick={() => setCookingMethod(cookingMethod === value ? '' : value)}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 text-center ${
                      cookingMethod === value
                        ? 'border-orange-500 bg-orange-50 shadow-md'
                        : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="text-2xl mb-1">{icon}</div>
                    <div className="font-semibold text-xs text-gray-900">{label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🚫</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Anything to avoid?</h3>
              </div>
              <input
                type="text"
                placeholder="e.g., mushrooms, nuts, spicy food..."
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300"
                value={avoidIngredients}
                onChange={(e) => setAvoidIngredients(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-lg">💡</span>
              </div>
              <div>
                <h4 className="font-semibold text-green-900 mb-2">Chef's Tips for Taylor</h4>
                <div className="space-y-2 text-green-800 text-sm leading-relaxed">
                  <p>• <strong>Start simple:</strong> Enter 2-3 main ingredients you have on hand</p>
                  <p>• <strong>Mood matters:</strong> Select your cooking mood to get recipes that match your energy</p>
                  <p>• <strong>Time is key:</strong> Choose your available time to avoid overwhelming recipes</p>
                  <p>• <strong>Mix & match:</strong> Try different cooking methods to discover new techniques</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
