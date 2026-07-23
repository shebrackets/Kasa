"use client";

import Link from "next/link";
import PropertyCard from "@/components/PropertyCard/PropertyCard";
import { useFavorites } from "@/context/FavoritesContext";
import styles from "./FavoritesList.module.css";

export default function FavoritesList({ properties }) {
  const { favorites, isLoaded } = useFavorites();

  if (!isLoaded) return null;

  const favoriteProperties = properties.filter((property) => favorites.includes(property.id));

  if (favoriteProperties.length === 0) {
    return (
      <section className={styles.empty} aria-live="polite">
        <p className={styles.emptyText}>Vous n&rsquo;avez pas encore de logement favori.</p>
        <Link href="/" className={styles.emptyLink}>
          Découvrir les logements
        </Link>
      </section>
    );
  }

  return (
    <section aria-label="Logements favoris">
      <ul className={styles.grid}>
        {favoriteProperties.map((property) => (
          <li key={property.id}>
            <PropertyCard property={property} />
          </li>
        ))}
      </ul>
    </section>
  );
}
