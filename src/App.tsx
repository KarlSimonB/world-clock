import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CityDetail from './components/CityDetail';
import { AddCityModal } from './components/AddCityModal';
import { Header } from './components/Header';
import { CityGrid } from './components/CityGrid';
import { useCityManager } from './components/hooks/useCityManager';
import { useDisplayModes } from './components/hooks/useDisplayModes';
import './styles/index.css';

const WorldClockApp: React.FC = () => {
  const { cities, searchQuery, setSearchQuery, handleAddCity, handleQuickAddCity, handleRemoveCity } = useCityManager();
  const { cityDisplayModes, handleToggleMode } = useDisplayModes();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const existingCityTimezones = cities.map(city => city.timezone.name);

  return (
    <Routes>
      <Route path="/" element={
        <div className="app">
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onCityAdd={handleQuickAddCity}
            existingCities={existingCityTimezones}
          />

          <CityGrid
            cities={cities}
            cityDisplayModes={cityDisplayModes}
            onToggleMode={handleToggleMode}
            onRemoveCity={handleRemoveCity}
            onAddClick={() => setIsModalOpen(true)}
          />

          <AddCityModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddCity={(city) => {
              handleAddCity(city);
              setIsModalOpen(false);
            }}
          />
          
          <footer className="app-footer">
            <p className="footer-text">
              <span className="footer-highlight">Simon Bergstrand</span> FE24 TS-Project World Clock
            </p>
          </footer>
        </div>
      } />
      
      <Route path="/city/:cityId" element={
        <CityDetail cities={cities} />
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <WorldClockApp />
    </Router>
  );
};

export default App;