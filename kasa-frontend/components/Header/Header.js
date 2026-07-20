"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "../Logo/Logo";
import { HeartIcon, MessageIcon, MenuIcon, CloseIcon } from "../icons/Icons";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
];

const MOBILE_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  { href: "/messagerie", label: "Messagerie" },
  { href: "/favoris", label: "Favoris" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.headerWrapper}>
      <div className={styles.bar}>
        <nav className={styles.navLeft} aria-label="Navigation principale">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className={styles.logoLink}>
          <span className={styles.logoFull}>
            <Logo />
          </span>
          <span className={styles.logoPicto}>
            <Logo variant="picto" />
          </span>
        </Link>

        <div className={styles.navRight}>
          <Link href="/properties/new" className={styles.addLink}>
            +Ajouter un logement
          </Link>
          <div className={styles.iconGroup}>
            <Link href="/favoris" aria-label="Favoris" className={styles.iconButton}>
              <HeartIcon />
            </Link>
            <span className={styles.iconDivider} />
            <Link href="/messagerie" aria-label="Messagerie" className={styles.iconButton}>
              <MessageIcon />
            </Link>
          </div>
        </div>

        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className={styles.mobileMenu} aria-label="Navigation mobile">
          <ul className={styles.mobileLinkList}>
            {MOBILE_LINKS.map((link) => (
              <li key={link.href} className={styles.mobileLinkItem}>
                <Link
                  href={link.href}
                  className={styles.mobileNavLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/properties/new"
            className={styles.mobileAddButton}
            onClick={() => setIsMenuOpen(false)}
          >
            Ajouter un logement
          </Link>
        </nav>
      )}
    </header>
  );
}
