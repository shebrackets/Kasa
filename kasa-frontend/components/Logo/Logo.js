import styles from "./Logo.module.css";

export default function Logo({ variant = "full" }) {
  if (variant === "picto") {
    return (
      <img src="/images/logo-picto.png" alt="Kasa" className={styles.pictoImage} />
    );
  }

  return (
    <img src="/images/logo.png" alt="Kasa" className={styles.wordmarkImage} />
  );
}
