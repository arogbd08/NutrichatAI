import React, { useEffect, useState } from "react";
import axios from "axios";
import { TableHeader } from './TableHeader'; // Adjust import according to your project
import { Loader2 } from 'lucide-react';

const columns = ['Ingredient', 'Calories (per gram)', 'Protein (g)', 'Carbs (g)', 'Fat (g)']; // Updated column names

// Reusable fetch function
export const useFetchProteinData = () => {
  const [proteinData, setProteinData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true); // Start loading indicator
    setError(null); // Reset error state
    try {
      const response = await axios.get("http://localhost:3002/api/ingredient");
      setProteinData(response.data); // Store fetched data
    } catch (err) {
      setError(err.message); // Handle errors
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  return { proteinData, loading, error, fetchData };
};

export const DataTable: React.FC = () => {
  // Use the custom hook for fetching protein data
  const { proteinData, loading, error, fetchData } = useFetchProteinData();

  useEffect(() => {
    fetchData(); // Fetch data on component mount
  }, []); // Empty dependency array for one-time fetch

  // Calculate totals for calories, protein, carbs, and fat
  const totalCalories = proteinData.reduce((total, item) => total + item["cal/g"], 0);
  const totalProtein = proteinData.reduce((total, item) => total + item["protein(g)"], 0);
  const totalCarbs = proteinData.reduce((total, item) => total + item["carb(g)"], 0);
  const totalFat = proteinData.reduce((total, item) => total + item["fat(g)"], 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-center p-4">
        Error loading data: {error}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-indigo-400">Ingredients Table</h2>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
        >
          Refresh Table
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            {columns.map((column) => (
              <TableHeader key={column} column={column} />
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {proteinData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center text-gray-400 p-4">
                No data available
              </td>
            </tr>
          ) : (
            proteinData.map((item) => (
              <tr key={item._id} className="hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-400">
                  {item.ingr}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">{item["cal/g"]}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{item["protein(g)"]}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{item["carb(g)"]}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{item["fat(g)"]}</td>
              </tr>
            ))
          )}
        </tbody>
        {proteinData.length > 0 && (
          <tfoot className="bg-gray-800">
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-indigo-400">Total</td>
              <td className="px-6 py-4 text-sm text-gray-300">{totalCalories.toFixed(2)}</td>
              <td className="px-6 py-4 text-sm text-gray-300">{totalProtein.toFixed(2)}</td>
              <td className="px-6 py-4 text-sm text-gray-300">{totalCarbs.toFixed(2)}</td>
              <td className="px-6 py-4 text-sm text-gray-300">{totalFat.toFixed(2)}</td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};
