"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext(undefined);

const STORAGE_KEY = "kasa:favorites";

function readStoredFavorites() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Impossible de lire les favoris enregistrés", error);
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setFavorites(readStoredFavorites());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Impossible d'enregistrer les favoris", error);
    }
  }, [favorites, isLoaded]);

  useEffect(() => {
    function handleStorage(event) {
      if (event.key !== STORAGE_KEY) return;
      setFavorites(readStoredFavorites());
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

  const addFavorite = useCallback((id) => {
    setFavorites((current) => (current.includes(id) ? current : [...current, id]));
  }, []);

  const removeFavorite = useCallback((id) => {
    setFavorites((current) => current.filter((favoriteId) => favoriteId !== id));
  }, []);

  const toggleFavorite = useCallback((id) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((favoriteId) => favoriteId !== id) : [...current, id]
    );
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ favorites, isLoaded, isFavorite, addFavorite, removeFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites doit être utilisé à l'intérieur d'un FavoritesProvider");
  }
  return context;
}
