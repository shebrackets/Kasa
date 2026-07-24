import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "Messagerie | Kasa",
  description: "La messagerie Kasa arrive bientôt.",
};

export default function MessageriePage() {
  return (
    <article className={styles.container}>
      <h1 className={styles.title}>Messagerie</h1>
      <p className={styles.text}>
        La messagerie Kasa arrive bientôt. Vous pourrez bientôt échanger directement avec vos hôtes et voyageurs
        depuis cet espace.
      </p>
      <Link href="/" className={styles.ctaButton}>
        Retour à l&rsquo;accueil
      </Link>
    </article>
  );
}
