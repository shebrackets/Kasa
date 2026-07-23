import Hero from "@/components/Hero/Hero";
import styles from "./page.module.css";

export const metadata = {
  title: "À propos | Kasa",
  description:
    "Chez Kasa, nous croyons que chaque voyage mérite un lieu unique où se sentir bien.",
};

const MISSIONS = [
  "Offrir une plateforme fiable et simple d'utilisation",
  "Proposer des hébergements variés et de qualité",
  "Favoriser des échanges humains et chaleureux entre hôtes et voyageurs",
];

export default function AProposPage() {
  return (
    <article className={styles.container}>
      <Hero
        title="À propos"
        description={[
          "Chez Kasa, nous croyons que chaque voyage mérite un lieu unique où se sentir bien.",
          "Depuis notre création, nous mettons en relation des voyageurs en quête d’authenticité avec des hôtes passionnés qui aiment partager leur région et leurs bonnes adresses.",
        ]}
        imageSrc="/images/a-propos-1.jpg"
      />

      <section className={styles.mission} aria-labelledby="mission-heading">
        <h2 id="mission-heading" className={styles.missionTitle}>
          Notre mission est simple :
        </h2>
        <ol className={styles.missionList}>
          {MISSIONS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
        <figure className={styles.missionFigure}>
          <img src="/images/a-propos-2.jpg" alt="" className={styles.missionImage} />
        </figure>
        <p className={styles.missionClosing}>
          Que vous cherchiez un appartement cosy en centre-ville, une maison en bord de mer ou un
          chalet à la montagne, Kasa vous accompagne pour que chaque séjour devienne un souvenir
          inoubliable.
        </p>
      </section>
    </article>
  );
}
