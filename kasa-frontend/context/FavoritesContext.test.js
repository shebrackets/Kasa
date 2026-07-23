import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FavoritesProvider, useFavorites } from "./FavoritesContext";

function wrapper({ children }) {
  return <FavoritesProvider>{children}</FavoritesProvider>;
}

describe("FavoritesContext", () => {
  it("starts empty and marks itself as loaded once localStorage has been read", async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));
    expect(result.current.favorites).toEqual([]);
    expect(result.current.isFavorite("prop-1")).toBe(false);
  });

  it("adds a property to favorites when toggled on", async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.toggleFavorite("prop-1");
    });

    expect(result.current.isFavorite("prop-1")).toBe(true);
    expect(result.current.favorites).toEqual(["prop-1"]);
  });

  it("removes a property from favorites when toggled off", async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.toggleFavorite("prop-1");
    });
    expect(result.current.isFavorite("prop-1")).toBe(true);

    act(() => {
      result.current.toggleFavorite("prop-1");
    });
    expect(result.current.isFavorite("prop-1")).toBe(false);
  });

  it("supports addFavorite/removeFavorite independently of toggleFavorite", async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.addFavorite("prop-1");
      result.current.addFavorite("prop-1"); // idempotent
    });
    expect(result.current.favorites).toEqual(["prop-1"]);

    act(() => {
      result.current.removeFavorite("prop-1");
    });
    expect(result.current.favorites).toEqual([]);
  });

  it("persists favorites to localStorage", async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.toggleFavorite("prop-1");
      result.current.toggleFavorite("prop-2");
    });

    await waitFor(() => {
      const stored = JSON.parse(window.localStorage.getItem("kasa:favorites"));
      expect(stored).toEqual(expect.arrayContaining(["prop-1", "prop-2"]));
    });
  });

  it("restores favorites saved during a previous visit", async () => {
    window.localStorage.setItem("kasa:favorites", JSON.stringify(["prop-42"]));

    const { result } = renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));
    expect(result.current.isFavorite("prop-42")).toBe(true);
    expect(result.current.favorites).toEqual(["prop-42"]);
  });
});
