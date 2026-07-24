import { StarIcon } from "../Icons/Icons";
import { resolveImageUrl } from "@/lib/api";
import styles from "./HostCard.module.css";

export default function HostCard({ host, rating, className }) {
  return (
    <aside className={className ? `${styles.card} ${className}` : styles.card}>
      <h2 className={styles.title}>Votre hôte</h2>
      <div className={styles.host}>
        {host?.picture && (
          <img src={resolveImageUrl(host.picture)} alt={host.name} className={styles.avatar} />
        )}
        <span className={styles.name}>{host?.name}</span>
        {rating != null && (
          <span className={styles.rating}>
            <StarIcon className={styles.star} />
            {rating}
          </span>
        )}
      </div>
      <button type="button" className={styles.ctaButton}>
        Contacter l&rsquo;hôte
      </button>
      <button type="button" className={styles.ctaButton}>
        Envoyer un message
      </button>
    </aside>
  );
}
