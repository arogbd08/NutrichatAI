import React from 'react';
import { Utensils } from 'lucide-react';
import { DataTable } from './DataTable';

export const IngredientsPage: React.FC = () => (
  <div className="flex-1 p-6">
    <div className="mb-6 flex items-center gap-2">
      <Utensils className="w-6 h-6 text-indigo-400" />
      <h2 className="text-xl font-semibold text-white">Ingredients</h2>
    </div>
    <DataTable />
  </div>
);