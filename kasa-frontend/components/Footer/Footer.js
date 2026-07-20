import Logo from "../Logo/Logo";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Logo variant="picto" />
        <p className={styles.copyright}>© 2025 Kasa. All rights reserved</p>
      </div>
    </footer>
  );
}
