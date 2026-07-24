"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

export default function InscriptionPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptsTerms, setAcceptsTerms] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!acceptsTerms) {
      setError("Vous devez accepter les conditions générales d’utilisation");
      return;
    }

    setIsSubmitting(true);
    try {
      const name = `${prenom} ${nom}`.trim();
      // Sur Kasa, tout compte peut publier un logement (pas de sélecteur de rôle dans la maquette)
      await register({ name, email, password, role: "owner" });
      router.push("/");
    } catch (err) {
      setError(err.message || "Une erreur est survenue, veuillez réessayer");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <article className={styles.container}>
      <section className={styles.card} aria-labelledby="inscription-title">
        <header className={styles.heading}>
          <h1 id="inscription-title" className={styles.title}>
            Rejoignez la communauté Kasa
          </h1>
          <p className={styles.description}>
            Créez votre compte et commencez à voyager autrement&nbsp;: réservez des logements uniques, découvrez de
            nouvelles destinations et partagez vos propres lieux avec d’autres voyageurs.
          </p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label htmlFor="nom" className={styles.label}>
                Nom
              </label>
              <input
                id="nom"
                name="nom"
                type="text"
                className={styles.input}
                value={nom}
                onChange={(event) => setNom(event.target.value)}
                autoComplete="family-name"
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="prenom" className={styles.label}>
                Prénom
              </label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                className={styles.input}
                value={prenom}
                onChange={(event) => setPrenom(event.target.value)}
                autoComplete="given-name"
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={styles.input}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={styles.input}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>
            <div className={styles.checkboxRow}>
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className={styles.checkbox}
                checked={acceptsTerms}
                onChange={(event) => setAcceptsTerms(event.target.checked)}
                required
              />
              <label htmlFor="terms" className={styles.checkboxLabel}>
                J’accepte les <span className={styles.underline}>conditions générales d’utilisation</span>
              </label>
            </div>
          </div>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <div className={styles.actions}>
            <button type="submit" className={styles.submit} disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "S’inscrire"}
            </button>
            <p className={styles.switchText}>
              {"Déjà membre ? "}
              <Link href="/connexion" className={styles.linkStrong}>
                Se connecter
              </Link>
            </p>
          </div>
        </form>
      </section>
    </article>
  );
}
