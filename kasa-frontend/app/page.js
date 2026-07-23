import Hero from "@/components/Hero/Hero";
import PropertyCard from "@/components/PropertyCard/PropertyCard";
import HowItWorks from "@/components/HowItWorks/HowItWorks";
import { getProperties } from "@/lib/api";
import styles from "./page.module.css";

export default async function HomePage() {
  const properties = await getProperties();

  return (
    <div className={styles.container}>
      <Hero
        title="Chez vous, partout et ailleurs"
        description="Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux, sélectionnés avec soin par nos hôtes."
        imageSrc="/images/hero.jpg"
      />
      <section className={styles.propertiesSection} aria-labelledby="properties-heading">
        <h2 id="properties-heading" className="sr-only">
          Nos logements
        </h2>
        <ul className={styles.grid}>
          {properties.map((property) => (
            <li key={property.id}>
              <PropertyCard property={property} />
            </li>
          ))}
        </ul>
      </section>
      <HowItWorks />
    </div>
  );
}
