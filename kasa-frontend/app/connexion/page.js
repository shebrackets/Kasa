"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

export default function ConnexionPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err.message || "Une erreur est survenue, veuillez réessayer");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <article className={styles.container}>
      <section className={styles.card} aria-labelledby="connexion-title">
        <header className={styles.heading}>
          <h1 id="connexion-title" className={styles.title}>
            Heureux de vous revoir
          </h1>
          <p className={styles.description}>
            Connectez-vous pour retrouver vos réservations, vos annonces et tout ce qui rend vos séjours uniques.
          </p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.fields}>
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
                autoComplete="current-password"
                minLength={6}
                required
              />
            </div>
          </div>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <div className={styles.actions}>
            <button type="submit" className={styles.submit} disabled={isSubmitting}>
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </button>
            <p className={styles.forgot}>
              <button type="button" className={styles.linkButton}>
                Mot de passe oublié
              </button>
            </p>
            <p className={styles.switchText}>
              {"Pas encore de compte ? "}
              <Link href="/inscription" className={styles.linkStrong}>
                Inscrivez-vous
              </Link>
            </p>
          </div>
        </form>
      </section>
    </article>
  );
}
