/* ==========================================================================
   CENTRALIZED REACTIVE STORE (CMS ENGINE)
   Persists all site content, branding, color accents, and modules in localStorage
   ========================================================================== */

export const DEFAULT_SITE_CONFIG = {
  branding: {
    name: "Apex Fitness",
    tagline: "Online fitness coaching with certified coaches",
    logoLetter: "A",
    primaryColor: "#FF3B30", // Hex color
    primaryHue: 5,           // HSL hue
    accentPalette: "crimson",
    defaultTheme: "dark",
    copyrightText: "© 2026 Apex Fitness Technologies Inc. All rights reserved."
  },
  hero: {
    pillText: "Online fitness coaching with certified coaches",
    titleLine1: "Real coaches.",
    titleLine2: "Clear plans.",
    titleLine3: "Honest progress.",
    description: "Connecting you with certified human coaches, personalized workout programs, precision nutrition tracking, and native 1-on-1 in-app video sessions — delivering true accountability where generic fitness apps fail.",
    primaryCtaText: "Start Training Free",
    secondaryCtaText: "I'm a Coach",
    proofItems: [
      "Coach-reviewed plans",
      "Certified human coaches",
      "Apple Health & Macro logs"
    ]
  },
  pillars: [
    {
      id: "workouts",
      title: "Personalized Workouts",
      badge: "Bespoke",
      description: "Every rep, set, and exercise is programmed to your exact biomechanics, injuries, equipment, and schedule.",
      features: [
        "Fatigue-regulated progressive overload",
        "Instant equipment toggles (Gym / Home / Hotel)",
        "HD 4K exercise demonstrations"
      ],
      ctaText: "Explore Workouts →"
    },
    {
      id: "coaching",
      title: "Real Human Coach",
      badge: "1-on-1 Focus",
      isFeatured: true,
      description: "No automated bot scripts. Partner with certified trainers who evaluate your lifting videos, guide your nutrition, and hold you accountable.",
      features: [
        "Direct 1-on-1 video call check-ins inside the app",
        "Biomechanical form critique on heavy compound sets",
        "Precision weekly macro & calorie adjustments"
      ],
      ctaText: "Meet Certified Coaches →"
    },
    {
      id: "telemetry",
      title: "Deep Progress Tracking",
      badge: "Telemetry",
      description: "Never guess if you are improving. Monitor weekly tonnage volume, 1RM milestones, and side-by-side photographic audits.",
      features: [
        "Automated 1RM & cumulative volume telemetry",
        "Private transformation photo comparison audits",
        "Syncs Apple Health & Health Connect sleep/HRV"
      ],
      ctaText: "View Telemetry Tools →"
    }
  ],
  comparison: [
    {
      id: "comp-1",
      feature: "Programming Origin",
      typical: "Generic bot algorithms or static PDF templates",
      hybrid: "Certified human coach customizes every set, rep, & progression"
    },
    {
      id: "comp-2",
      feature: "Form Critique & Safety",
      typical: "None — you risk injury on heavy compounds",
      hybrid: "Direct video reviews with biomechanical movement feedback"
    },
    {
      id: "comp-3",
      feature: "1-on-1 Video Consultations",
      typical: "Unavailable or requires external third-party tools",
      hybrid: "Native HD in-app video & audio check-ins with your trainer"
    },
    {
      id: "comp-4",
      feature: "Precision Nutrition & Macros",
      typical: "Rigid formulas with no metabolic updates",
      hybrid: "Weekly coach updates based on scale, photos, and fatigue"
    },
    {
      id: "comp-5",
      feature: "360° Health Sync",
      typical: "Isolated workout log with zero recovery context",
      hybrid: "Syncs Apple Health, HRV, resting heart rate, and sleep duration"
    },
    {
      id: "comp-6",
      feature: "Real-Time Communication",
      typical: "Unresponsive support tickets or automated FAQs",
      hybrid: "Daily direct coach messaging with guaranteed reply times"
    }
  ],
  coaches: [
    {
      id: "marcus-vance",
      name: "Marcus Vance",
      title: "Elite Hypertrophy & Strength Coach",
      rating: 5.0,
      reviewsCount: 142,
      badge: "Top Rated Coach",
      image: "/assets/images/coach-marcus.jpg",
      experience: "12 yrs Exp",
      athletesCount: "120+ Athletes",
      priceMonthly: 149,
      categories: ["strength", "hypertrophy"],
      bio: "Former collegiate strength coach specializing in progressive overload, biomechanics, and sustainable body recomposition. Over 1,000 successful athlete transformations.",
      tags: ["Hypertrophy", "Biomechanics", "Fat Loss", "Form Critique"]
    },
    {
      id: "elena-rostova",
      name: "Elena Rostova",
      title: "Metabolic Conditioning & Female Recomp",
      rating: 4.9,
      reviewsCount: 98,
      badge: "Featured Coach",
      image: "/assets/images/coach-elena.jpg",
      experience: "9 yrs Exp",
      athletesCount: "85+ Athletes",
      priceMonthly: 129,
      categories: ["fatloss", "hypertrophy"],
      bio: "Certified Sports Nutritionist (CISSN) and strength coach. Expert in hormonal health, macro precision, and sculpting athletic physiques without burnout.",
      tags: ["Fat Loss", "Macro Precision", "Hormonal Balance", "Glute Specialization"]
    },
    {
      id: "tariq-al-mansoor",
      name: "Tariq Al-Mansoor",
      title: "Powerlifting & Sports Rehab Specialist",
      rating: 5.0,
      reviewsCount: 116,
      badge: "Master Coach",
      image: "/assets/images/coach-tariq.jpg",
      experience: "14 yrs Exp",
      athletesCount: "150+ Athletes",
      priceMonthly: 169,
      categories: ["strength", "rehab"],
      bio: "DPT background with CSCS certification. Bridges the gap between injury recovery and elite barbell strength. Helps lifters eliminate joint pain and smash PRs.",
      tags: ["Powerlifting", "Joint Rehab", "1RM Peaking", "Mobility"]
    }
  ],
  services: [
    {
      id: "meal-prep",
      title: "Munley Performance Gourmet Meals",
      category: "nutrition",
      categoryLabel: "Macro-Optimized Nutrition",
      rating: 4.9,
      reviews: 240,
      price: "From $11.50 / meal",
      image: "/assets/images/service-mealprep.jpg",
      description: "Chef-prepared, fresh flash-chilled macro meals customized to your coach's exact protein and calorie prescription.",
      perks: ["Zero seed oils", "Grass-fed proteins", "Delivered fresh weekly"]
    },
    {
      id: "sports-therapy",
      title: "Apex Sports Deep Tissue & Active Release",
      category: "recovery",
      categoryLabel: "Clinical Recovery",
      rating: 5.0,
      reviews: 184,
      price: "$95 / 60-min session",
      image: "/assets/images/service-therapy.jpg",
      description: "Targeted myofascial release, instrument-assisted soft tissue therapy, and rapid muscle recovery for high-intensity athletes.",
      perks: ["Licensed physical therapists", "Direct coach sync", "At-home or clinic options"]
    },
    {
      id: "biohacking-supplements",
      title: "NeuroPeak & Mad Honey Biohacking Lab",
      category: "supplements",
      categoryLabel: "Performance Lab",
      rating: 4.8,
      reviews: 95,
      price: "$48.00 / formula",
      image: "/assets/images/hero-athlete.jpg",
      description: "Third-party tested adaptogens, Himalayan Mad Honey, and targeted mitochondrial support for rapid CNS recovery and deep sleep.",
      perks: ["Informed-Sport tested", "Pure Himalayan origin", "Clinical dosages"]
    }
  ],
  pricing: [
    {
      id: "tier-ai",
      name: "Autonomous AI",
      badge: "Autonomous",
      isFeatured: false,
      priceMonthly: 39,
      priceQuarterly: 32,
      priceAnnual: 24,
      description: "Smart algorithm-based programming and macro logging.",
      features: [
        "Dynamic workout generator",
        "Automated macro & calorie calculator",
        "Set & Rest timer telemetry",
        "Apple Health & Health Connect sync"
      ]
    },
    {
      id: "tier-coach",
      name: "AI + Dedicated Coach",
      badge: "Hybrid Pro",
      isFeatured: true,
      priceMonthly: 149,
      priceQuarterly: 125,
      priceAnnual: 99,
      description: "The complete package: real human coach with full telemetry app.",
      features: [
        "Everything in Autonomous AI",
        "Certified 1-on-1 Dedicated Human Coach",
        "Bi-weekly in-app 1-on-1 video consultations",
        "Weekly personalized workout & macro adjustments",
        "Video form check & biomechanical critiques",
        "Daily coach direct chat access"
      ]
    },
    {
      id: "tier-vip",
      name: "VIP 1-on-1 Elite",
      badge: "VIP Elite",
      isFeatured: false,
      priceMonthly: 279,
      priceQuarterly: 235,
      priceAnnual: 195,
      description: "For competitive athletes, executives, and rapid recomp transformations.",
      features: [
        "Everything in Hybrid Pro",
        "Weekly 1-on-1 HD video strategy calls",
        "Priority 1-hour coach response guarantee",
        "Bloodwork & biomarker interpretation",
        "Direct coach phone & WhatsApp VIP access",
        "Complimentary partner meal prep discounts"
      ]
    }
  ],
  faqs: [
    {
      id: "faq-1",
      q: "What makes this different from typical workout & diet apps?",
      a: "Most fitness apps give you a generic automated PDF or algorithmic checklist with zero human care. Our platform connects you with a real certified human coach who builds your custom training, reviews your lifting videos, sets your nutrition, and holds live 1-on-1 video calls inside the app."
    },
    {
      id: "faq-2",
      q: "How does 1-on-1 coaching work inside the app?",
      a: "After completing your assessment, you select a coach specialized in your goals (Hypertrophy, Fat Loss, Powerlifting, or Injury Rehab). Your coach constructs your personalized workout routine and nutrition blueprint. You log your lifts and meals, and your coach reviews your telemetry, adjustments, and check-in video calls directly inside the app."
    },
    {
      id: "faq-3",
      q: "Can I train at home with limited equipment or only bodyweight?",
      a: "Absolutely. During onboarding, you specify your equipment availability (Full Commercial Gym, Home Dumbbells & Barbells, or Bodyweight & Bands). Your coach customizes every movement to match your exact setup."
    },
    {
      id: "faq-4",
      q: "Does the app integrate with Apple Health and Google Health Connect?",
      a: "Yes! The platform automatically synchronizes daily step counts, resting heart rate, sleep duration, and Heart Rate Variability (HRV). Your coach evaluates your recovery scores alongside your training volume to avoid overtraining."
    },
    {
      id: "faq-5",
      q: "Can fitness coaches use this platform to run their coaching businesses?",
      a: "Yes. Our coach portal enables trainers to manage unlimited clients, program workouts and nutrition, host integrated video calls, track client adherence, and receive automated Stripe payouts from one centralized hub."
    },
    {
      id: "faq-6",
      q: "Can I switch coaches or cancel anytime?",
      a: "Yes. You have total freedom. You can browse the coach marketplace and switch trainers with one click, or pause/cancel your subscription directly from your account settings with zero cancellation fees."
    }
  ],
  b2b: {
    heading: "Run your coaching business from one unified place.",
    subheading: "Manage clients, program custom workout and nutrition splits, conduct HD video check-ins, and receive automated Stripe payouts without juggling four disconnected apps."
  },
  finalCta: {
    heading: "Stop settling for generic fitness bots.",
    subheading: "Partner with dedicated certified human trainers who engineer your training, critique your lifting videos, and hold you accountable.",
    buttonText: "Start Training Free Today →"
  },
  sectionHeaders: {
    pillarsPill: "Why Apex Fitness ?",
    pillarsTitle: "Coaching, plans and tracking in one app",
    pillarsDesc: "Many fitness apps hand you a generic template and abandon you. We combine bespoke human programming, daily coach accountability, and intelligent telemetry into one seamless experience.",
    comparisonTitle: "How We Compare",
    comparisonDesc: "See why human-guided hybrid coaching delivers 3x higher adherence and safer PRs than automated generic algorithms.",
    coachesTitle: "Meet Your Certified Personal Coach",
    coachesDesc: "Every coach on our roster holds accredited CSCS or CISSN credentials and has mentored over 100+ athletes to tangible results.",
    servicesTitle: "Nutrition, Recovery & Biohacking Partners",
    servicesDesc: "Seamlessly connect your training program with verified meal prep delivery, soft-tissue clinics, and NSF-certified supplements.",
    pricingTitle: "Invest in your highest potential",
    pricingDesc: "Choose autonomous AI programming or partner with a dedicated certified coach for maximum accountability.",
    faqsTitle: "Frequently Asked Questions",
    faqsDesc: "Everything you need to know about personalized coaching, scheduling, and our money-back guarantee."
  },
  security: {
    adminEmail: "admin@apexfitness.com",
    adminPassword: "admin123"
  }
};

const STORAGE_KEY = "apex_fitness_cms_config";

// Cross-tab broadcast channel for instant multi-tab sync
let broadcastChannel = null;
try {
  if (typeof BroadcastChannel !== "undefined") {
    broadcastChannel = new BroadcastChannel("apex_fitness_cms_channel");
  }
} catch (e) {
  console.warn("BroadcastChannel not available:", e);
}

export function getSiteConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveSiteConfig(DEFAULT_SITE_CONFIG);
      return DEFAULT_SITE_CONFIG;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SITE_CONFIG,
      ...parsed,
      branding: { ...DEFAULT_SITE_CONFIG.branding, ...(parsed.branding || {}) },
      hero: { ...DEFAULT_SITE_CONFIG.hero, ...(parsed.hero || {}) },
      finalCta: { ...DEFAULT_SITE_CONFIG.finalCta, ...(parsed.finalCta || {}) },
      sectionHeaders: { ...DEFAULT_SITE_CONFIG.sectionHeaders, ...(parsed.sectionHeaders || {}) },
      b2b: { ...DEFAULT_SITE_CONFIG.b2b, ...(parsed.b2b || {}) },
      security: { ...DEFAULT_SITE_CONFIG.security, ...(parsed.security || {}) }
    };
  } catch (err) {
    console.error("Error reading site config:", err);
    return DEFAULT_SITE_CONFIG;
  }
}

export function saveSiteConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    applyBrandingToDOM(config.branding);
    window.dispatchEvent(new CustomEvent("apex_config_updated", { detail: config }));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: "CONFIG_UPDATED", config });
    }
    return true;
  } catch (err) {
    console.error("Error saving site config:", err);
    return false;
  }
}

export function resetSiteConfig() {
  localStorage.removeItem(STORAGE_KEY);
  saveSiteConfig(DEFAULT_SITE_CONFIG);
  return DEFAULT_SITE_CONFIG;
}

export function subscribeToConfigUpdates(callback) {
  // 1. Same-window CustomEvent
  window.addEventListener("apex_config_updated", (e) => {
    callback(e.detail || getSiteConfig());
  });

  // 2. Cross-tab BroadcastChannel (Zero-latency instant cross-tab sync)
  if (broadcastChannel) {
    broadcastChannel.onmessage = (event) => {
      if (event.data && event.data.type === "CONFIG_UPDATED") {
        callback(event.data.config || getSiteConfig());
      }
    };
  }

  // 3. Cross-tab localStorage storage event
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY || !e.key) {
      callback(getSiteConfig());
    }
  });

  // 4. Tab visibility change (fires when user switches back to this tab)
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      callback(getSiteConfig());
    }
  });

  // 5. Window focus
  window.addEventListener("focus", () => {
    callback(getSiteConfig());
  });
}

export function hexToRgb(hex) {
  if (!hex || typeof hex !== "string") return { r: 255, g: 59, b: 48 };
  let c = hex.replace("#", "").trim();
  if (c.length === 3) c = c.split("").map(x => x + x).join("");
  if (c.length !== 6) return { r: 255, g: 59, b: 48 };
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function darkenHex(hex, percent = 12) {
  const { r, g, b } = hexToRgb(hex);
  const factor = (100 - percent) / 100;
  const dr = Math.max(0, Math.min(255, Math.round(r * factor)));
  const dg = Math.max(0, Math.min(255, Math.round(g * factor)));
  const db = Math.max(0, Math.min(255, Math.round(b * factor)));
  return `#${((1 << 24) + (dr << 16) + (dg << 8) + db).toString(16).slice(1)}`;
}

export function hexToHue(hex) {
  const { r, g, b } = hexToRgb(hex);
  const nr = r / 255, ng = g / 255, nb = b / 255;
  const max = Math.max(nr, ng, nb), min = Math.min(nr, ng, nb);
  let h = 0;
  if (max === min) h = 0;
  else if (max === nr) h = (60 * ((ng - nb) / (max - min)) + 360) % 360;
  else if (max === ng) h = (60 * ((nb - nr) / (max - min)) + 120) % 360;
  else if (max === nb) h = (60 * ((nr - ng) / (max - min)) + 240) % 360;
  return Math.round(h);
}

export function applyBrandingToDOM(branding) {
  if (!branding) return;

  const hex = branding.primaryColor || "#FF3B30";
  const rgb = hexToRgb(hex);
  const hue = branding.primaryHue !== undefined ? branding.primaryHue : hexToHue(hex);
  const hoverHex = darkenHex(hex, 12);

  // Directly set solid CSS variables on documentElement so entire app adapts
  const root = document.documentElement;
  root.style.setProperty("--primary", hex);
  root.style.setProperty("--primary-custom", hex);
  root.style.setProperty("--primary-hover", hoverHex);
  root.style.setProperty("--primary-light", `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`);
  root.style.setProperty("--primary-border", `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
  root.style.setProperty("--primary-gradient", hex);
  root.style.setProperty("--primary-glow", "transparent");
  root.style.setProperty("--primary-hue", hue);

  // Update theme meta color
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute("content", hex);

  // Update dynamic brand name across all .dynamic-brand-name elements
  if (branding.name) {
    document.querySelectorAll(".dynamic-brand-name").forEach(el => {
      el.textContent = branding.name;
    });
    document.title = `${branding.name}: Online Fitness Coaching With Real Coaches`;
  }

  // Update brand icon box letter
  const iconBoxes = document.querySelectorAll(".brand-icon-box");
  const letter = branding.logoLetter || (branding.name ? branding.name.charAt(0).toUpperCase() : "A");
  iconBoxes.forEach(box => {
    box.textContent = letter;
  });

  // Update copyright text
  if (branding.copyrightText) {
    const copyEl = document.querySelector(".footer-bottom div:first-child");
    if (copyEl) copyEl.textContent = branding.copyrightText;
  }
}
