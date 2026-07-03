"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Plane, Moon, Sun } from "lucide-react";
import { NAV_LINKS } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import { useUIStore } from "@/store/uiStore";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { isMenuOpen, toggleMenu, closeMenu } = useUIStore();
  const { theme, toggle: toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { closeMenu(); }, [pathname]);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "nav-backdrop border-b border-white/30 dark:border-white/10 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={ROUTES.home} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4F8CFF] to-[#62D4E3] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Plane className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
            Cool<span className="gradient-text">Trips</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(link.href)
                  ? "bg-accent/10 text-accent"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side: Theme toggle + CTA */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-white/10 transition-colors"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <Link href={ROUTES.flights} className="btn-primary text-sm px-5 py-2.5">
            Search Flights
          </Link>
        </div>

        {/* Hamburger */}
        <div className="md:hidden flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            className="p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden nav-backdrop border-t border-white/30 dark:border-white/10 px-6 py-4 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(link.href)
                  ? "bg-accent/10 text-accent"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href={ROUTES.flights} className="btn-primary text-center mt-2 py-3">
            Search Flights
          </Link>
        </div>
      )}
    </header>
  );
}
