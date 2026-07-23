import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FavoritesProvider } from "@/context/FavoritesContext";
import FavoriteButton from "./FavoriteButton";

function renderButton() {
  return render(
    <FavoritesProvider>
      <FavoriteButton propertyId="prop-1" title="Appartement cosy" />
    </FavoritesProvider>
  );
}

describe("FavoriteButton", () => {
  it("starts unfavorited", async () => {
    renderButton();

    const button = await screen.findByRole("button", {
      name: "Ajouter Appartement cosy aux favoris",
    });
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("becomes favorited when clicked", async () => {
    const user = userEvent.setup();
    renderButton();

    const button = await screen.findByRole("button", {
      name: "Ajouter Appartement cosy aux favoris",
    });
    await user.click(button);

    const toggledButton = await screen.findByRole("button", {
      name: "Retirer Appartement cosy des favoris",
    });
    expect(toggledButton).toHaveAttribute("aria-pressed", "true");
  });

  it("goes back to unfavorited on a second click", async () => {
    const user = userEvent.setup();
    renderButton();

    const button = await screen.findByRole("button", {
      name: "Ajouter Appartement cosy aux favoris",
    });
    await user.click(button);

    const favoritedButton = await screen.findByRole("button", {
      name: "Retirer Appartement cosy des favoris",
    });
    await user.click(favoritedButton);

    const finalButton = await screen.findByRole("button", {
      name: "Ajouter Appartement cosy aux favoris",
    });
    expect(finalButton).toHaveAttribute("aria-pressed", "false");
  });
});
