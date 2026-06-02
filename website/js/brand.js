/**
 * Innov8Hub — Central Brand Configuration
 * Source of truth for brand constants across the website.
 * Update this file when brand values change; then propagate to HTML/CSS.
 */
const BRAND = {
  name:       "Innov8Hub",
  primaryCta: "Book Free Automation Plan",
  logoAlt:    "Innov8Hub logo",
  iconAlt:    "Innov8Hub icon",
  copyright:  "© 2026 Innov8Hub. All rights reserved.",
  url:        "https://innov8hub.io",
  email:      "hello@innov8hub.io",

  assets: {
    logo:        "img/logov2.png",      // Primary horizontal logo — header (light bg)
    icon:        "img/icon.png",        // Standalone mark — small contexts, light bg
    iconInverted:"img/icon-inverted.png",// Standalone mark — dark backgrounds
    favicon:     "img/favicon.png",     // Browser tab + apple-touch-icon
    businessName:"img/business-name.png",// Wordmark only — not currently used in header
  },

  sizing: {
    logoDesktop: { maxWidth: "170px", maxHeight: "44px", objectFit: "contain" },
    logoMobile:  { maxWidth: "140px", maxHeight: "40px", objectFit: "contain" },
    logoFooter:  { maxWidth: "150px", maxHeight: "42px", objectFit: "contain" },
    iconSmall:   "32px",   // compact brand mark
    iconMedium:  "40px",   // footer icon
    iconLarge:   "48px",   // CTA section brand mark
  },
};

// Note: this is a static site — BRAND is provided as documentation and
// reference for manual HTML authoring. It is not auto-imported by pages.
