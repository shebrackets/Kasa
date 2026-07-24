import { resolveImageUrl } from "@/lib/api";
import styles from "./Gallery.module.css";

export default function Gallery({ pictures, title, className }) {
  const images = pictures && pictures.length > 0 ? pictures : [];
  const [main, ...thumbs] = images;

  if (!main) return null;

  return (
    <figure className={className ? `${styles.gallery} ${className}` : styles.gallery}>
      <img src={resolveImageUrl(main)} alt={title} className={styles.mainImage} />
      {thumbs.length > 0 && (
        <ul className={styles.thumbs}>
          {thumbs.slice(0, 4).map((picture, index) => (
            <li key={picture} className={styles.thumb}>
              <img src={resolveImageUrl(picture)} alt={`${title} ${index + 2}`} className={styles.thumbImage} />
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}
