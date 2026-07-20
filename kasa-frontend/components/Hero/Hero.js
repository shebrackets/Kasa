import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.textGroup}>
        <h1 className={styles.title}>Chez vous, partout et ailleurs</h1>
        <p className={styles.subtitle}>
          Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux, sélectionnés avec
          soin par nos hôtes.
        </p>
      </div>
      <div className={styles.banner}>
        <img src="/images/hero.jpg" alt="" className={styles.bannerImage} />
      </div>
    </section>
  );
}
