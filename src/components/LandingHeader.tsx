"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#overview", label: "Overview", icon: "fa-home" },
  { href: "#features", label: "Features", icon: "fa-star" },
  { href: "#goals", label: "Goals", icon: "fa-bullseye" },
  { href: "#usecase", label: "Use Case", icon: "fa-lightbulb" },
  { href: "#contact", label: "Contact", icon: "fa-envelope" },
];

export default function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#overview");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.querySelector(l.href)).filter(
      (el): el is Element => !!el
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`bg-white/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-lg py-0" : "shadow-sm py-1"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "py-3" : "py-4"
        }`}
      >
        <a href="#overview" className="flex items-center space-x-3 group">
          <div className="energy-orb animate-pulse-glow transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
            <i className="fas fa-bolt" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text tracking-tight">PADYAKWATTS</h1>
            <p className="text-xs text-gray-500">Clean Energy Initiative</p>
          </div>
        </a>

        <nav className="hidden md:flex space-x-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              className={`nav-link px-5 py-2 font-medium transition-all duration-300 rounded-full ${
                active === link.href
                  ? "text-green-700 bg-green-50 active"
                  : "text-gray-700 hover:text-green-600 hover:bg-green-50"
              }`}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/login" className="btn-energy py-2 px-6 text-sm">
            <i className="fas fa-sign-in-alt mr-2" />
            Login
          </Link>
          <button
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="md:hidden relative w-8 h-8 text-gray-700 hover:text-green-600 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span
              className={`absolute left-1/2 top-1/2 block h-0.5 w-6 -translate-x-1/2 bg-current transition-all duration-300 ${
                menuOpen ? "rotate-45 -translate-y-1/2" : "-translate-y-2"
              }`}
            />
            <span
              className={`absolute left-1/2 top-1/2 block h-0.5 w-6 -translate-x-1/2 -translate-y-1/2 bg-current transition-opacity duration-200 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-1/2 top-1/2 block h-0.5 w-6 -translate-x-1/2 bg-current transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-1/2" : "translate-y-1"
              }`}
            />
          </button>
        </div>
      </div>

      <nav
        className={`md:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden transition-all duration-300 ease-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 space-y-2">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                active === link.href
                  ? "text-green-700 bg-green-50"
                  : "text-gray-700 hover:text-green-600 hover:bg-green-50"
              }`}
              style={{
                transitionDelay: menuOpen ? `${i * 40}ms` : "0ms",
                transform: menuOpen ? "translateX(0)" : "translateX(-8px)",
                opacity: menuOpen ? 1 : 0,
              }}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              <i className={`fas ${link.icon} mr-3`} />
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
