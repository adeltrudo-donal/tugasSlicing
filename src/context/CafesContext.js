import React, { createContext, useState } from 'react';
import { CAFES_DATA as INITIAL_CAFES } from '../utils/mockData';

export const CafesContext = createContext();

export const CafesProvider = ({ children }) => {
  const [cafes, setCafes] = useState(INITIAL_CAFES);

  const toggleFavorite = (id) => {
    setCafes(prevCafes => 
      prevCafes.map(cafe => 
        cafe.id === id ? { ...cafe, isFavorite: !cafe.isFavorite } : cafe
      )
    );
  };

  return (
    <CafesContext.Provider value={{ cafes, toggleFavorite }}>
      {children}
    </CafesContext.Provider>
  );
};
