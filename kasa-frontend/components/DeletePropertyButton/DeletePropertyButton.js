"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { deleteProperty } from "@/lib/api";
import styles from "./DeletePropertyButton.module.css";

export default function DeletePropertyButton({ propertyId, hostId, className }) {
  const { user, token, isLoaded } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const canDelete = isLoaded && user && (user.role === "admin" || (hostId != null && String(user.id) === String(hostId)));

  if (!canDelete) return null;

  async function handleDelete() {
    const confirmed = window.confirm("Supprimer définitivement cette annonce ?");
    if (!confirmed) return;

    setError(null);
    setIsDeleting(true);
    try {
      await deleteProperty(propertyId, token);
      router.push("/");
    } catch (err) {
      setError(err.message || "Impossible de supprimer cette annonce");
      setIsDeleting(false);
    }
  }

  return (
    <div className={className ? `${styles.wrapper} ${className}` : styles.wrapper}>
      <button type="button" className={styles.deleteButton} onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? "Suppression..." : "Supprimer cette annonce"}
      </button>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
