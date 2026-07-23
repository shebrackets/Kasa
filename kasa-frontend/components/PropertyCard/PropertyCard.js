import Link from "next/link";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import styles from "./PropertyCard.module.css";

export default function PropertyCard({ property }) {
  return (
    <Link href={`/properties/${property.id}`} className={styles.card}>
      <figure className={styles.imageWrapper}>
        <img src={property.cover} alt={property.title} className={styles.image} />
        <FavoriteButton
          propertyId={property.id}
          title={property.title}
          className={styles.favorite}
        />
      </figure>
      <div className={styles.details}>
        <h3 className={styles.title}>{property.title}</h3>
        <p className={styles.location}>{property.location}</p>
        <p className={styles.price}>
          <span className={styles.priceValue}>{property.price_per_night}€</span>{" "}
          <span className={styles.priceLabel}>par nuit</span>
        </p>
      </div>
    </Link>
  );
}
