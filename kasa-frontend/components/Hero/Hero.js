import styles from "./Hero.module.css";

export default function Hero({ title, description, imageSrc, imageAlt = "" }) {
  const paragraphs = Array.isArray(description) ? description : [description];

  return (
    <section className={styles.hero}>
      <header className={styles.textGroup}>
        <h1 className={styles.title}>{title}</h1>
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className={styles.subtitle}>
            {paragraph}
          </p>
        ))}
      </header>
      {imageSrc && (
        <figure className={styles.banner}>
          <img src={imageSrc} alt={imageAlt} className={styles.bannerImage} />
        </figure>
      )}
    </section>
  );
}
