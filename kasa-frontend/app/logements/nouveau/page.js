"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { createProperty, uploadImage, updateUserProfile } from "@/lib/api";
import { ArrowLeftIcon, PlusIcon, CloseIcon } from "@/components/Icons/Icons";
import styles from "./page.module.css";

const EQUIPMENTS = [
  "Micro-Ondes",
  "Douche italienne",
  "Frigo",
  "WIFI",
  "Parking",
  "Sèche Cheveux",
  "Machine à laver",
  "Cuisine équipée",
  "Télévision",
  "Chambre Séparée",
  "Climatisation",
  "Frigo Américain",
  "Clic-clac",
  "Four",
  "Rangements",
  "Lit",
  "Bouilloire",
  "SDB",
  "Toilettes sèches",
  "Cintres",
  "Baie vitrée",
  "Hotte",
  "Baignoire",
  "Vue Parc",
];

const SUGGESTED_CATEGORIES = ["Parc", "Night Life", "Culture", "Nature", "Touristique", "Vue sur mer", "Pour les couples", "Famille", "Forêt"];

function toObjectUrl(file) {
  return file ? URL.createObjectURL(file) : null;
}

export default function AddPropertyPage() {
  const { user, token, isAuthenticated, isLoaded, updateLocalUser } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [location, setLocation] = useState("");
  const [hostName, setHostName] = useState("");

  const [coverFile, setCoverFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [hostPictureFile, setHostPictureFile] = useState(null);

  const [equipments, setEquipments] = useState([]);
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState("");

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoaded && !isAuthenticated) {
      router.replace("/connexion");
    }
  }, [isLoaded, isAuthenticated, router]);

  useEffect(() => {
    if (user?.name) setHostName(user.name);
  }, [user]);

  const coverPreview = useMemo(() => toObjectUrl(coverFile), [coverFile]);
  const hostPicturePreview = useMemo(() => toObjectUrl(hostPictureFile), [hostPictureFile]);
  const galleryPreviews = useMemo(() => galleryFiles.map((file) => toObjectUrl(file)), [galleryFiles]);

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      if (hostPicturePreview) URL.revokeObjectURL(hostPicturePreview);
      galleryPreviews.forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [coverPreview, hostPicturePreview, galleryPreviews]);

  function toggleEquipment(name) {
    setEquipments((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));
  }

  function toggleTag(name) {
    setTags((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));
  }

  function handleAddCustomTag(event) {
    event.preventDefault();
    const value = customTag.trim();
    if (!value) return;
    if (!tags.includes(value)) setTags((current) => [...current, value]);
    setCustomTag("");
  }

  function handleGalleryChange(event) {
    const files = Array.from(event.target.files || []);
    setGalleryFiles((current) => [...current, ...files]);
    event.target.value = "";
  }

  function removeGalleryFile(index) {
    setGalleryFiles((current) => current.filter((_, i) => i !== index));
  }

  const customTags = tags.filter((tag) => !SUGGESTED_CATEGORIES.includes(tag));

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Le titre de la propriété est requis");
      return;
    }

    setIsSubmitting(true);
    try {
      let coverUrl = null;
      if (coverFile) {
        const uploaded = await uploadImage(coverFile, { purpose: "property-cover", token });
        coverUrl = uploaded.url;
      }

      const pictureUrls = [];
      for (const file of galleryFiles) {
        const uploaded = await uploadImage(file, { purpose: "property-picture", token });
        pictureUrls.push(uploaded.url);
      }

      let hostPictureUrl = null;
      if (hostPictureFile) {
        const uploaded = await uploadImage(hostPictureFile, { purpose: "user-picture", token });
        hostPictureUrl = uploaded.url;
      }

      // Le logement doit être rattaché au compte réellement connecté (host_id), pas à un simple
      // nom/photo en texte libre : sinon impossible de retrouver "mes" logements plus tard
      // (par ex. pour les supprimer). Si le nom/photo affichés diffèrent de ceux du compte,
      // on met à jour le profil utilisateur avant de créer le logement.
      const trimmedHostName = hostName.trim();
      const profilePatch = {};
      if (trimmedHostName && trimmedHostName !== user?.name) profilePatch.name = trimmedHostName;
      if (hostPictureUrl) profilePatch.picture = hostPictureUrl;

      if (Object.keys(profilePatch).length > 0 && user?.id) {
        await updateUserProfile(user.id, profilePatch, token);
        updateLocalUser(profilePatch);
      }

      const mergedLocation = [location.trim(), postalCode.trim()].filter(Boolean).join(" ");

      const created = await createProperty(
        {
          title: title.trim(),
          description: description.trim() || null,
          location: mergedLocation || null,
          cover: coverUrl,
          pictures: pictureUrls,
          host_id: user?.id,
          equipments,
          tags,
        },
        token
      );

      router.push(`/logements/${created.id}`);
    } catch (err) {
      setError(err.message || "Une erreur est survenue, veuillez réessayer");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isLoaded || !isAuthenticated) {
    return null;
  }

  return (
    <article className={styles.container}>
      <form id="add-property-form" className={styles.content} onSubmit={handleSubmit} noValidate>
        <Link href="/" className={styles.backLink}>
          <ArrowLeftIcon />
          Retour
        </Link>

        <div className={styles.titleRow}>
          <h1 className={styles.pageTitle}>Ajouter une propriété</h1>
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? "Envoi..." : "Ajouter"}
          </button>
        </div>

        <div className={styles.twoColRow}>
          <section className={styles.panelInfos} aria-labelledby="infos-title">
            <h2 id="infos-title" className="sr-only">
              Informations
            </h2>

            <div className={styles.field}>
              <label htmlFor="title" className={styles.label}>
                Titre de la propriété
              </label>
              <input
                id="title"
                className={styles.input}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ex : Appartement cosy au coeur de paris"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="description" className={styles.label}>
                Description
              </label>
              <textarea
                id="description"
                className={styles.textarea}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Décrivez votre propriété en détail..."
                rows={4}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="postalCode" className={styles.label}>
                Code postal
              </label>
              <input
                id="postalCode"
                className={styles.input}
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="location" className={styles.label}>
                Localisation
              </label>
              <input
                id="location"
                className={styles.input}
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
            </div>
          </section>

          <div className={styles.columnB}>
            <section className={styles.panelPhotos} aria-labelledby="photos-title">
              <h2 id="photos-title" className="sr-only">
                Photos
              </h2>

              <div className={styles.field}>
                <span className={styles.label}>Image de couverture</span>
                <div className={styles.uploadRow}>
                  <span className={styles.uploadPlaceholder}>{coverFile ? coverFile.name : ""}</span>
                  <label className={styles.addButton} aria-label="Ajouter une image de couverture">
                    <PlusIcon color="var(--color-white)" />
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => setCoverFile(event.target.files?.[0] || null)}
                    />
                  </label>
                </div>
                {coverPreview && (
                  <figure className={styles.previewFigure}>
                    <img src={coverPreview} alt="Aperçu de l'image de couverture" className={styles.previewImage} />
                  </figure>
                )}
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Image du logement</span>
                <div className={styles.uploadRow}>
                  <span className={styles.uploadPlaceholder}>
                    {galleryFiles.length > 0 ? `${galleryFiles.length} image(s) sélectionnée(s)` : ""}
                  </span>
                  <label className={styles.addButton} aria-label="Ajouter une image du logement">
                    <PlusIcon color="var(--color-white)" />
                    <input
                      id="galleryFileInput"
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={handleGalleryChange}
                    />
                  </label>
                </div>
                <label htmlFor="galleryFileInput" className={styles.inlineAddLink}>
                  +Ajouter une image
                </label>
                {galleryFiles.length > 0 && (
                  <ul className={styles.galleryList}>
                    {galleryFiles.map((file, index) => (
                      <li key={`${file.name}-${index}`} className={styles.galleryItem}>
                        <figure className={styles.previewFigure}>
                          <img src={galleryPreviews[index]} alt={`Aperçu ${index + 1}`} className={styles.previewImage} />
                        </figure>
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => removeGalleryFile(index)}
                          aria-label={`Retirer l'image ${index + 1}`}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <section className={styles.panelHost} aria-labelledby="host-title">
              <h2 id="host-title" className="sr-only">
                Hôte
              </h2>

              <div className={styles.field}>
                <label htmlFor="hostName" className={styles.label}>
                  Nom de l’hôte
                </label>
                <input
                  id="hostName"
                  className={styles.input}
                  value={hostName}
                  onChange={(event) => setHostName(event.target.value)}
                />
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Photo de profil</span>
                <div className={styles.uploadRow}>
                  <span className={styles.uploadPlaceholder}>{hostPictureFile ? hostPictureFile.name : ""}</span>
                  <label className={styles.addButton} aria-label="Ajouter une photo de profil">
                    <PlusIcon color="var(--color-white)" />
                    <input
                      id="hostPictureFileInput"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => setHostPictureFile(event.target.files?.[0] || null)}
                    />
                  </label>
                </div>
                <label htmlFor="hostPictureFileInput" className={styles.inlineAddLink}>
                  +Ajouter une image
                </label>
                {hostPicturePreview && (
                  <figure className={styles.previewFigure}>
                    <img src={hostPicturePreview} alt="Aperçu de la photo de profil" className={styles.previewImage} />
                  </figure>
                )}
              </div>
            </section>
          </div>
        </div>

        <div className={`${styles.twoColRow} ${styles.twoColRowTop}`}>
        <section className={styles.panelEquipments} aria-labelledby="equipments-title">
          <h2 id="equipments-title" className={styles.panelTitle}>
            Équipements
          </h2>
          <ul className={styles.equipmentGrid}>
            {EQUIPMENTS.map((name) => (
              <li key={name}>
                <label className={styles.equipmentItem}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={equipments.includes(name)}
                    onChange={() => toggleEquipment(name)}
                  />
                  <span>{name}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.panelCategories} aria-labelledby="categories-title">
          <h2 id="categories-title" className={styles.panelTitle}>
            Catégories
          </h2>
          <ul className={styles.tagCloud}>
            {SUGGESTED_CATEGORIES.map((name) => (
              <li key={name}>
                <label className={styles.tagPill}>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={tags.includes(name)}
                    onChange={() => toggleTag(name)}
                  />
                  {name}
                </label>
              </li>
            ))}
          </ul>

          <div className={styles.customTagRow}>
            <label htmlFor="customTag" className={styles.label}>
              Ajouter une catégorie personnalisée
            </label>
            <div className={styles.customTagInputRow}>
              <input
                id="customTag"
                className={styles.input}
                value={customTag}
                onChange={(event) => setCustomTag(event.target.value)}
                placeholder="Nouveau tag"
              />
              <button type="button" className={styles.addButton} onClick={handleAddCustomTag} aria-label="Ajouter un tag">
                <PlusIcon color="var(--color-white)" />
              </button>
            </div>

            <button type="button" className={styles.inlineAddLink} onClick={handleAddCustomTag}>
              +Ajouter un tag
            </button>

            {customTags.length > 0 && (
              <div className={styles.field}>
                <span className={styles.label}>Catégories personnalisées</span>
                <ul className={styles.customTagList}>
                  {customTags.map((tag) => (
                    <li key={tag} className={styles.customTagInputRow}>
                      <input
                        className={styles.input}
                        value={tag}
                        readOnly
                        aria-label={`Catégorie personnalisée : ${tag}`}
                      />
                      <button
                        type="button"
                        className={styles.addButton}
                        onClick={() => toggleTag(tag)}
                        aria-label={`Retirer le tag ${tag}`}
                      >
                        <CloseIcon color="var(--color-white)" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </form>
    </article>
  );
}
