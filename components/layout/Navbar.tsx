"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Plane } from "lucide-react";
import { NAV_LINKS } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import { useUIStore } from "@/store/uiStore";

export default function Navbar() {
  const pathname = usePathname();
  const { isMenuOpen, toggleMenu, closeMenu } = useUIStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { closeMenu(); }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "nav-backdrop border-b border-white/30 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={ROUTES.home} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4F8CFF] to-[#62D4E3] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Plane className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">
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
                pathname === link.href
                  ? "bg-accent/10 text-accent"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href={ROUTES.flights} className="btn-primary text-sm px-5 py-2.5">
            Search Flights
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden nav-backdrop border-t border-white/30 px-6 py-4 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === link.href
                  ? "bg-accent/10 text-accent"
                  : "text-gray-700 hover:bg-gray-100"
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
