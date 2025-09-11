import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [ingredientsInput, setIngredientsInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cookingMood, setCookingMood] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [cookingMethod, setCookingMethod] = useState("");
  const [avoidIngredients, setAvoidIngredients] = useState("");
  const navigate = useNavigate();

  function onChangeIngredients(e) {
    setIngredientsInput(e.target.value);
  }

  
  function findCommonMeals(mealLists) {
    if (mealLists.length === 0) return [];
    let firstList = mealLists[0];
    if (!firstList) return [];
    let commonMeals = [];
    for (let meal of firstList) {
      let mealId = meal.idMeal;
      let foundInAll = true;
      for (let i = 1; i < mealLists.length; i++) {
        let currentList = mealLists[i];
        let found = currentList.some((m) => m.idMeal === mealId);
        if (!found) {
          foundInAll = false;
          break;
        }
      }
      if (foundInAll) {
        commonMeals.push(meal);
      }
    }
    return commonMeals;
  }

  async function fetchMealsByIngredient(ingredient) {
    let url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
      ingredient
    )}`;
    let response = await fetch(url);
    let data = await response.json();
    return data.meals || [];
  }

  async function fetchDetailsForMeals(meals) {
    let maxMeals = 24;
    let limitedMeals = meals.slice(0, maxMeals);
    let promises = limitedMeals.map(async (meal) => {
      let url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`;
      let response = await fetch(url);
      let data = await response.json();
      if (data.meals && data.meals[0]) {
        return data.meals[0];
      } else {
        return meal;
      }
    });
    return Promise.all(promises);
  }

  function getIngredientsList(mealDetail) {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
      let key = `strIngredient${i}`;
      let ingredient = mealDetail[key];
      if (ingredient && ingredient.trim()) {
        ingredients.push(ingredient.trim().toLowerCase());
      }
    }
    return ingredients;
  }

  function passesFilters(mealDetail) {
    let ingredients = getIngredientsList(mealDetail);
    let instructions = (mealDetail.strInstructions || "").toLowerCase();

    function containsKeyword(keyword) {
      return ingredients.some((ingredient) => ingredient.includes(keyword));
    }

    if (avoidIngredients) {
      let avoidList = avoidIngredients
        .split(",")
        .map((item) => item.trim().toLowerCase());
      let hasAvoided = avoidList.some((avoid) =>
        ingredients.some((ing) => ing.includes(avoid))
      );
      if (hasAvoided) return false;
    }

    return true;
  }

  const onClickHandler = async () => {
    let userInput = ingredientsInput.trim();
    if (!userInput) return;
    let ingredientList = userInput
      .split(",")
      .map((ing) => ing.trim())
      .filter(Boolean);
    if (ingredientList.length === 0) return;

    try {
      setIsLoading(true);
      let mealLists = await Promise.all(
        ingredientList.map((ingredient) => fetchMealsByIngredient(ingredient))
      );
      let commonMeals = findCommonMeals(mealLists);
      let detailedMeals = await fetchDetailsForMeals(commonMeals);
      let filteredMeals = detailedMeals.filter(passesFilters);
      navigate("/results", { state: { meals: filteredMeals } });
    } catch (error) {
      console.log("Search failed", error);
      navigate("/results", { state: { meals: [] } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 flex text-center justify-center items-center gap-3">
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Recipe
            </span>
            <span className=" text-blue-400">
              Finder
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto block mt-2 font-semibold">
            Ready to create something delicious?
          </p>
        </header>

        {/* Content */}
        <div className="space-y-8">
          {/* Searchbar */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-xl border border-orange-300 overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition-all duration-300">
              <input
                type="text"
                placeholder="Enter ingredients..."
                className="w-full py-6 pl-4 pr-4 text-lg text-gray-800 placeholder-gray-500 bg-transparent focus:outline-none"
                onChange={onChangeIngredients}
                value={ingredientsInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onClickHandler();
                }}
              />
              <button
                className="absolute right-2 top-4 flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full p-4 transition-all duration-300 hover:scale-105 shadow-lg"
                onClick={onClickHandler}
              >
                <FaSearch className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cooking Mood */}
          <div className="bg-white rounded-2xl shadow-lg border border-orange-300 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">😋</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                What's your cooking mood?
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: "comfort", label: "Comfort Food", icon: "🍲", desc: "Warm & cozy" },
                { value: "healthy", label: "Healthy", icon: "🥗", desc: "Fresh & light" },
                { value: "indulgent", label: "Indulgent", icon: "🍰", desc: "Rich & decadent" },
                { value: "adventurous", label: "Adventurous", icon: "🌶️", desc: "Try something new" },
              ].map(({ value, label, icon, desc }) => (
                <button
                  key={value}
                  onClick={() =>
                    setCookingMood(cookingMood === value ? "" : value)
                  }
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    cookingMood === value
                      ? "border-orange-500 bg-orange-50 shadow-md"
                      : "border-orange-300 hover:border-orange-400 hover:shadow-sm"
                  }`}
                >
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="font-semibold text-sm text-gray-900">{label}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Cooking Time */}
          <div className="bg-white rounded-2xl shadow-lg border border-orange-300 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">⏰</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                How much time do you have?
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: "15min", label: "Quick Fix", icon: "⚡", desc: "15 min or less" },
                { value: "30min", label: "Half Hour", icon: "🕐", desc: "30 minutes" },
                { value: "1hr", label: "Take Time", icon: "🕑", desc: "1 hour" },
                { value: "2hr+", label: "All Day", icon: "🕒", desc: "2+ hours" },
              ].map(({ value, label, icon, desc }) => (
                <button
                  key={value}
                  onClick={() =>
                    setCookingTime(cookingTime === value ? "" : value)
                  }
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    cookingTime === value
                      ? "border-orange-500 bg-orange-50 shadow-md"
                      : "border-orange-300 hover:border-orange-400 hover:shadow-sm"
                  }`}
                >
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="font-semibold text-sm text-gray-900">{label}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Cooking Method */}
          <div className="bg-white rounded-2xl shadow-lg border border-orange-300 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🔥</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                How do you want to cook?
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { value: "baking", label: "Baking", icon: "🍞" },
                { value: "grilling", label: "Grilling", icon: "🔥" },
                { value: "stovetop", label: "Stovetop", icon: "🍳" },
                { value: "slow-cooker", label: "Slow Cook", icon: "⏳" },
                { value: "raw", label: "No Cook", icon: "🥗" },
              ].map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() =>
                    setCookingMethod(cookingMethod === value ? "" : value)
                  }
                  className={`p-3 rounded-xl border-2 transition-all duration-300 text-center ${
                    cookingMethod === value
                      ? "border-orange-500 bg-orange-50 shadow-md"
                      : "border-orange-300 hover:border-orange-400 hover:shadow-sm"
                  }`}
                >
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="font-semibold text-xs text-gray-900">{label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Avoid Ingredients */}
          <div className="bg-white rounded-2xl shadow-lg border border-orange-300 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🚫</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Anything to avoid?
              </h3>
            </div>
            <input
              type="text"
              placeholder="(Trial) e.g., mushrooms, nuts, spicy food..."
              className="w-full p-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300 outline-none"
              value={avoidIngredients}
              onChange={(e) => setAvoidIngredients(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
