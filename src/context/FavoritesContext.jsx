import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('medlist_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('medlist_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (id, category) => {
    return favorites.some(item => item.id === id && item.category === category);
  };

  const toggleFavorite = (item, category) => {
    if (isFavorite(item.id, category)) {
      setFavorites(prev => prev.filter(i => !(i.id === item.id && i.category === category)));
    } else {
      setFavorites(prev => [...prev, { ...item, category }]);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};