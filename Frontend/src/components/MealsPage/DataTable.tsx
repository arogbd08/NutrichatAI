import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, Loader2 } from "lucide-react";

type MealType = {
  meal_id: string; // Ensure ID is a string for frontend matching
  meal_name: string;
  total_calories: number,
  total_protein: number,
  total_fat: number,
  total_carbs: number,
  ingredients: any[],
}

export const MealTable: React.FC = () => {
  const [meals, setMeals] = useState<MealType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3002/api/meals_with_ingredients");
      setMeals(response.data);
    } catch (err) {
      setError("Failed to load meals");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-semibold text-indigo-400 mb-4">Meal Data Table</h2>
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300">Meal</th>
            <th className="px-6 py-3 text-xs font-medium text-gray-300">Calories</th>
            <th className="px-6 py-3 text-xs font-medium text-gray-300">Protein</th>
            <th className="px-6 py-3 text-xs font-medium text-gray-300">Carbs</th>
            <th className="px-6 py-3 text-xs font-medium text-gray-300">Fat</th>
            <th className="px-6 py-3 text-xs font-medium text-gray-300">Ingredients</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {meals.map((meal) => (
            <React.Fragment key={meal.meal_name}>
              <tr className="hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-indigo-400">{meal.meal_name}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{meal.total_calories}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{meal.total_protein}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{meal.total_carbs}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{meal.total_fat}</td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  <button
                    className="flex items-center gap-1 text-indigo-400 hover:text-white"
                    onClick={() => setExpandedMeal(expandedMeal === meal.meal_name ? null : meal.meal_name)}
                  >
                    View <ChevronDown className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              {expandedMeal === meal.meal_name && (
                <tr className="bg-gray-900">
                  <td colSpan={6} className="p-4">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300">Ingredient</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-300">Quantity (g)</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-300">Calories</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-300">Protein</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-300">Carbs</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-300">Fat</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {meal.ingredients.map((ingredient) => (
                          <tr key={ingredient.name}>
                            <td className="px-6 py-3 text-sm text-gray-300">{ingredient.name}</td>
                            <td className="px-6 py-3 text-sm text-gray-300">{ingredient.quantity}</td>
                            <td className="px-6 py-3 text-sm text-gray-300">{ingredient.calories}</td>
                            <td className="px-6 py-3 text-sm text-gray-300">{ingredient.protein}</td>
                            <td className="px-6 py-3 text-sm text-gray-300">{ingredient.carbs}</td>
                            <td className="px-6 py-3 text-sm text-gray-300">{ingredient.fat}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
