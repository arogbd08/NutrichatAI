import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface TableHeaderProps {
  column: string;
  onClick?: () => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ column, onClick }) => (
  <th 
    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-indigo-400 transition-colors"
    onClick={onClick}
  >
    <div className="flex items-center gap-2">
      {column}
      <ArrowUpDown className="w-4 h-4" />
    </div>
  </th>
);