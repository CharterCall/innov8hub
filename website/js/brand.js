/**
 * Innov8Hub — Central Brand Configuration
 *
 * Source of truth for brand constants and approved asset references.
 * Update this file when brand values change; then propagate to HTML/CSS.
 *
 * This is a static-HTML site so constants are not auto-imported by pages —
 * this file serves as documentation and authoritative reference for developers.
 */
const BRAND = {

  // ── Identity ──────────────────────────────────────────────────────────────
  name:       "Innov8Hub",
  primaryCta: "Book Free Automation Plan",
  copyright:  "© 2026 Innov8Hub. All rights reserved.",
  url:        "https://innov8hub.io",
  email:      "hello@innov8hub.io",

  // ── Accessibility labels ──────────────────────────────────────────────────
  logoAlt: "Innov8Hub logo",
  iconAlt: "Innov8Hub icon",

  // ── Approved logo assets ─────────────────────────────────────────────────
  // Source: D:\AI\Innov8hub\Business artifacts\Branding\Logo and wordmark files\
  assets: {
    // Primary horizontal logo — light backgrounds (header, footer light bg)
    logo:        "img/logo.png",
    // Inverted horizontal logo — dark backgrounds (footer on dark)
    logoInverted:"img/logo-inverted.png",
    // Primary icon — favicon, small icon contexts, light backgrounds
    icon:        "img/icon.png",           // 256×256 web-optimised export
    // Inverted icon — dark background icon contexts
    iconInverted:"img/icon-inverted.png",  // 256×256 web-optimised export
    // Favicon — browser tab (48×48, 3 KB)
    favicon:     "img/favicon.png",
    // Apple / iOS home screen icon (180×180)
    appleTouchIcon: "img/apple-touch-icon.png",
    // Large app icon export (512×512)
    icon512:     "img/icon-512.png",
  },

  // ── Logo sizing (CSS reference) ───────────────────────────────────────────
  sizing: {
    logoDesktop: "max-height: 44px; width: auto; object-fit: contain",
    logoMobile:  "max-height: 40px; width: auto; object-fit: contain",
    logoFooter:  "max-height: 42px; width: auto; object-fit: contain",
    iconSmall:   "32px",
    iconMedium:  "40px",
    iconLarge:   "48px",
  },

};
