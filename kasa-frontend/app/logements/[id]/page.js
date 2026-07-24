import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery/Gallery";
import HostCard from "@/components/HostCard/HostCard";
import Tag from "@/components/Tag/Tag";
import DeletePropertyButton from "@/components/DeletePropertyButton/DeletePropertyButton";
import { ArrowLeftIcon, PinIcon } from "@/components/Icons/Icons";
import { getPropertyById } from "@/lib/api";
import styles from "./page.module.css";

export default async function PropertyPage({ params }) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) notFound();

  return (
    <article className={styles.container}>
      <nav className={styles.backRow} aria-label="Retour">
        <Link href="/" className={styles.backLink}>
          <ArrowLeftIcon />
          Retour aux annonces
        </Link>
      </nav>

      <Gallery pictures={property.pictures} title={property.title} className={styles.gallery} />

      <HostCard
        host={property.host}
        rating={property.rating_avg != null ? Math.round(property.rating_avg) : null}
        className={styles.host}
      />

      <section className={styles.description}>
        <header className={styles.heading}>
          <h1 className={styles.title}>{property.title}</h1>
          <p className={styles.location}>
            <PinIcon />
            {property.location}
          </p>
          <p className={styles.text}>{property.description}</p>
          <DeletePropertyButton propertyId={property.id} hostId={property.host?.id} />
        </header>

        {property.equipments?.length > 0 && (
          <section className={styles.equipmentsSection} aria-labelledby="equipments-heading">
            <h2 id="equipments-heading" className={styles.sectionTitle}>
              Équipements
            </h2>
            <ul className={styles.tagGrid}>
              {property.equipments.map((equipment) => (
                <li key={equipment}>
                  <Tag>{equipment}</Tag>
                </li>
              ))}
            </ul>
          </section>
        )}

        {property.tags?.length > 0 && (
          <section className={styles.categorySection} aria-labelledby="category-heading">
            <h2 id="category-heading" className={styles.sectionTitle}>
              Catégorie
            </h2>
            <ul className={styles.tagGrid}>
              {property.tags.map((tag) => (
                <li key={tag}>
                  <Tag>{tag}</Tag>
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>
    </article>
  );
}
