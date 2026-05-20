import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cafe } from '../models/Cafe';

interface CafesContextData {
  cafes: Cafe[];
  favorites: Cafe[];
  loading: boolean;
  error: string | null;
  fetchCafes: () => Promise<void>;
  searchCafes: (keyword: string) => Promise<void>;
  toggleFavorite: (cafe: Cafe) => Promise<void>;
  isFavorite: (id: string | number) => boolean;
}

const CafesContext = createContext<CafesContextData | undefined>(undefined);

const BASE_URL = 'https://mock-api.ahmadfaisal.space';
const FAVORITES_KEY = '@favorite_cafes';

export const CafesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [favorites, setFavorites] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch {
      console.error('Failed to load favorites');
    }
  };

  const saveFavorites = async (updatedFavorites: Cafe[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch {
      console.error('Failed to save favorites');
    }
  };

  const fetchCafes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/cafes?page=1&limit=10`);
      const responseData = response.data?.data || response.data;
      if (Array.isArray(responseData)) {
        setCafes(responseData);
      }
    } catch {
      setError('Failed to fetch cafes. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCafes = async (keyword: string) => {
    if (!keyword.trim()) {
      return fetchCafes();
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/cafes?search=${keyword}&page=1&limit=10`);
      const responseData = response.data?.data || response.data;
      if (Array.isArray(responseData)) {
        setCafes(responseData);
      }
    } catch {
      setError('Failed to search cafes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (cafe: Cafe) => {
    const isExist = favorites.some((fav) => fav.id === cafe.id);
    let newFavorites;
    if (isExist) {
      newFavorites = favorites.filter((fav) => fav.id !== cafe.id);
    } else {
      newFavorites = [...favorites, cafe];
    }
    await saveFavorites(newFavorites);
  };

  const isFavorite = (id: string | number) => {
    return favorites.some((fav) => fav.id === id);
  };

  return (
    <CafesContext.Provider
      value={{
        cafes,
        favorites,
        loading,
        error,
        fetchCafes,
        searchCafes,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </CafesContext.Provider>
  );
};

export const useCafes = (): CafesContextData => {
  const context = useContext(CafesContext);
  if (!context) {
    throw new Error('useCafes must be used within a CafesProvider');
  }
  return context;
};
