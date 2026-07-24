"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../lib/api";

const AuthContext = createContext(undefined);

const STORAGE_KEY = "kasa:auth";

function readStoredAuth() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, user: null };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { token: null, user: null };
    return { token: parsed.token || null, user: parsed.user || null };
  } catch (error) {
    console.error("Impossible de lire la session enregistrée", error);
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = readStoredAuth();
    setToken(stored.token);
    setUser(stored.user);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (token && user) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error("Impossible d'enregistrer la session", error);
    }
  }, [token, user, isLoaded]);

  useEffect(() => {
    function handleStorage(event) {
      if (event.key !== STORAGE_KEY) return;
      const stored = readStoredAuth();
      setToken(stored.token);
      setUser(stored.user);
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginUser({ email, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async ({ name, email, password, role }) => {
    const data = await registerUser({ name, email, password, role });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  // Met à jour localement les infos utilisateur (ex: après un PATCH /api/users/:id),
  // sans nouvel appel réseau : évite que le nom/photo affichés restent périmés.
  const updateLocalUser = useCallback((patch) => {
    setUser((current) => (current ? { ...current, ...patch } : current));
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, user, isLoaded, isAuthenticated: Boolean(token), login, register, logout, updateLocalUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
}
