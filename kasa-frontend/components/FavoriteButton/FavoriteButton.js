"use client";

import { HeartIcon } from "../Icons/Icons";
import { useFavorites } from "@/context/FavoritesContext";
import styles from "./FavoriteButton.module.css";

export default function FavoriteButton({ propertyId, title, className }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(propertyId);

  function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(propertyId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className ? `${styles.button} ${className}` : styles.button}
      aria-pressed={favorite}
      aria-label={
        favorite ? `Retirer ${title} des favoris` : `Ajouter ${title} aux favoris`
      }
    >
      <HeartIcon filled={favorite} color={favorite ? "var(--color-main-red)" : "var(--color-noir)"} />
    </button>
  );
}
