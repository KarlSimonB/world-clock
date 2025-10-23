import React from 'react';
import { Plus } from 'lucide-react';

interface AddCityCardProps {
  onClick: () => void;
}

export const AddCityCard: React.FC<AddCityCardProps> = ({ onClick }) => (
  <div className="add-city-card" onClick={onClick}>
    <Plus size={48} />
  </div>
);