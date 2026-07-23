import Logo from "../Logo/Logo";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Logo variant="picto" />
      <p className={styles.copyright}>© 2025 Kasa. All rights reserved</p>
    </footer>
  );
}
