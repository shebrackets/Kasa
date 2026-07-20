import Link from "next/link";
import { HeartIcon } from "../icons/Icons";
import styles from "./PropertyCard.module.css";

export default function PropertyCard({ property }) {
  return (
    <Link href={`/properties/${property.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={property.cover} alt={property.title} className={styles.image} />
        <span className={styles.favorite} aria-hidden="true">
          <HeartIcon color="var(--color-noir)" />
        </span>
      </div>
      <div className={styles.details}>
        <div className={styles.textGroup}>
          <h3 className={styles.title}>{property.title}</h3>
          <p className={styles.location}>{property.location}</p>
        </div>
        <p className={styles.price}>
          <span className={styles.priceValue}>{property.price_per_night}€</span>{" "}
          <span className={styles.priceLabel}>par nuit</span>
        </p>
      </div>
    </Link>
  );
}
