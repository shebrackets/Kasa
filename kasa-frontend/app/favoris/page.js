import FavoritesList from "@/components/FavoritesList/FavoritesList";
import { getProperties } from "@/lib/api";
import styles from "./page.module.css";

export const metadata = {
  title: "Favoris | Kasa",
  description: "Retrouvez les logements que vous avez ajoutés à vos favoris.",
};

export default async function FavorisPage() {
  const properties = await getProperties();

  return (
    <article className={styles.container}>
      <h1 className="sr-only">Vos favoris</h1>
      <FavoritesList properties={properties} />
    </article>
  );
}
