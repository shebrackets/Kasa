import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";
import * as api from "../lib/api";

function wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("AuthContext", () => {
  it("starts unauthenticated and marks itself as loaded once localStorage has been read", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it("logs in a user and persists the session to localStorage", async () => {
    const fakeUser = { id: 1, name: "Alice Martin", email: "alice@example.com", role: "client" };
    vi.spyOn(api, "loginUser").mockResolvedValue({ token: "fake-token", user: fakeUser });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    await act(async () => {
      await result.current.login("alice@example.com", "secret123");
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(fakeUser);

    await waitFor(() => {
      const stored = JSON.parse(window.localStorage.getItem("kasa:auth"));
      expect(stored).toEqual({ token: "fake-token", user: fakeUser });
    });
  });

  it("registers a user and stores the returned session", async () => {
    const fakeUser = { id: 2, name: "Bob Dupont", email: "bob@example.com", role: "client" };
    vi.spyOn(api, "registerUser").mockResolvedValue({ token: "another-token", user: fakeUser });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    await act(async () => {
      await result.current.register({ name: "Bob Dupont", email: "bob@example.com", password: "secret123" });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(fakeUser);
  });

  it("logs out and clears localStorage", async () => {
    const fakeUser = { id: 1, name: "Alice Martin", email: "alice@example.com", role: "client" };
    vi.spyOn(api, "loginUser").mockResolvedValue({ token: "fake-token", user: fakeUser });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    await act(async () => {
      await result.current.login("alice@example.com", "secret123");
    });
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    await waitFor(() => expect(window.localStorage.getItem("kasa:auth")).toBe(null));
  });

  it("restores a session saved during a previous visit", async () => {
    const fakeUser = { id: 3, name: "Chloé Petit", email: "chloe@example.com", role: "owner" };
    window.localStorage.setItem("kasa:auth", JSON.stringify({ token: "stored-token", user: fakeUser }));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(fakeUser);
  });

  it("propagates login errors without changing the session", async () => {
    vi.spyOn(api, "loginUser").mockRejectedValue(new Error("Adresse email ou mot de passe incorrect"));

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    await expect(
      act(async () => {
        await result.current.login("wrong@example.com", "badpass");
      })
    ).rejects.toThrow("Adresse email ou mot de passe incorrect");

    expect(result.current.isAuthenticated).toBe(false);
  });
});
