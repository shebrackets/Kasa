import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata = {
  title: "Page introuvable | Kasa",
};

export default function NotFound() {
  return (
    <article className={styles.container}>
      <header className={styles.heading}>
        <h1 className={styles.code}>404</h1>
        <p className={styles.text}>
          Il semble que la page que vous cherchez ait pris des vacances&hellip; ou n&rsquo;ait
          jamais existé.
        </p>
      </header>
      <nav className={styles.actions} aria-label="Suggestions de navigation">
        <Link href="/" className={styles.ctaButton}>
          Accueil
        </Link>
        <Link href="/#properties-heading" className={styles.ctaButton}>
          Logements
        </Link>
      </nav>
    </article>
  );
}
