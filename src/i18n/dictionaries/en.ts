/**
 * English copy. This file is the shape the Slovak dictionary must satisfy,
 * so a missing translation is a type error rather than a silent fallback.
 */
const en = {
  meta: {
    title: "Ktenor — Premium websites, designed and built end to end",
    description:
      "Ktenor designs and builds premium websites from scratch: landing pages, business sites and online stores. One person from the first sketch to launch.",
    ogAlt: "Ktenor — web studio",
  },

  nav: {
    work: "Work",
    services: "Services",
    process: "Process",
    about: "About",
    reviews: "Reviews",
    faq: "FAQ",
    contact: "Contact",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skipToContent: "Skip to content",
  },

  actions: {
    startProject: "Start a project",
    seeWork: "See the work",
    order: "Order",
    tellMeMore: "Tell me about your project",
    backHome: "Back home",
  },

  theme: {
    toggle: "Switch theme",
    toDark: "Switch to dark theme",
    toLight: "Switch to light theme",
  },

  language: {
    label: "Language",
    switchTo: "Switch to Slovak",
  },

  hero: {
    eyebrow: "Web studio",
    headline: "Premium websites, designed and built end to end.",
    sub: "One person behind every project — from the first sketch to the live site. No templates, no handovers, no compromise on the details.",
  },

  work: {
    eyebrow: "Work",
    title: "Client projects.",
    intro:
      "No client work yet, so here are demo builds instead — fictional businesses, designed and coded end to end the same way a real client project would be.",
    projects: {
      cafe: {
        name: "Ember & Oak",
        description:
          "A one-page site for a fictional Bratislava coffee house: menu, interior gallery, reviews and contact, built as a demo of the finished product.",
        cta: "View the live demo",
      },
      barbershop: {
        name: "Forge & Blade",
        description:
          "A one-page site for a fictional Bratislava barbershop: services, gallery, team, reviews and a full demo booking flow.",
        cta: "View the live demo",
      },
    },
    comingSoon: "More demo projects on the way.",
  },

  services: {
    eyebrow: "Services",
    title: "What I build.",
    intro:
      "Every project is designed and coded from scratch. Below is where each one starts — the final figure follows the scope.",
    from: "from",
    onRequest: "On request",
    timeline: "Timeline",
    includedTitle: "Included in every project",
    included: [
      "Design from scratch — no templates",
      "Responsive across every device",
      "Baseline SEO from day one",
      "Performance tuned before launch",
      "Considered animation and micro-interactions",
      "Two rounds of revisions",
    ],
    addonsTitle: "Add-ons",
    addonsIntro: "Priced separately so the figures above stay honest.",
    addons: {
      multilingual: { name: "Extra language", note: "per language" },
      support: { name: "Ongoing support", note: "per month" },
      copywriting: { name: "Copywriting", note: "quoted per project" },
      content: { name: "Content population", note: "quoted per project" },
      hosting: { name: "Domain & hosting", note: "at cost, set up for you" },
      integrations: { name: "Features & integrations", note: "quoted per project" },
    },
    payment: "50% up front, 50% on completion — before the site goes live.",
    disclaimer:
      "Starting prices are indicative. The final price depends on the project scope, functionality and requirements.",
    items: {
      mini: {
        name: "Mini Website / Digital Menu",
        description:
          "A single, sharp page for a cafe, barbershop or local business. Everything a customer needs, nothing they don't.",
        timeline: "2–5 working days",
      },
      landing: {
        name: "Landing Page",
        description:
          "One page built to convert: a clear argument, one goal, and no route out but the one you want.",
        timeline: "5–7 working days",
      },
      portfolio: {
        name: "Portfolio Website",
        description:
          "For people whose work should speak first. Quiet interface, generous space, fast galleries.",
        timeline: "1–2 weeks",
      },
      business: {
        name: "Business / Multi-page Website",
        description:
          "From a compact company site to a large multi-page structure — services, cases, team, contact, all of it.",
        timeline: "2–4 weeks",
      },
      store: {
        name: "Online Store",
        description:
          "Catalogue, product pages, cart and checkout. Built so browsing feels effortless and buying feels safe.",
        timeline: "3–5 weeks",
      },
      custom: {
        name: "Custom Website",
        description:
          "Something that doesn't fit a category. Tell me what it needs to do and I'll tell you what it takes.",
        timeline: "Scoped together",
      },
    },
    enquiry: {
      title: "Not sure which one fits?",
      description:
        "Most projects don't arrive pre-labelled. Describe what you need in your own words and I'll come back with a scope and a figure.",
    },
  },

  process: {
    eyebrow: "Process",
    title: "How a project runs.",
    intro:
      "Six stages, no surprises. You know what is happening, what comes next, and where the project stands.",
    hint: "Hover a stage to read more",
    steps: {
      analysis: {
        name: "Analysis",
        description:
          "Who the site is for, what it has to achieve, and what your competitors already get right. Decisions get cheaper the earlier they're made.",
      },
      planning: {
        name: "Planning",
        description:
          "Structure, page inventory, the path a visitor takes. You approve the skeleton before anything gets drawn.",
      },
      design: {
        name: "Design",
        description:
          "Layout, typography, colour and motion — designed for your content, not dropped into a template.",
      },
      development: {
        name: "Development",
        description:
          "Clean, modern code. Responsive from the first commit, not retrofitted at the end.",
      },
      testing: {
        name: "Testing",
        description:
          "Every breakpoint, real devices, keyboard navigation, contrast and load speed. Found by me, not by your customers.",
      },
      launch: {
        name: "Launch",
        description:
          "Domain, hosting, indexing and a final pass together. Then the site is yours.",
      },
    },
  },

  principles: {
    eyebrow: "Principles",
    title: "How I work.",
    intro: "Direct, without intermediaries — and accountable for the result.",
    items: {
      honesty: {
        name: "Honesty over comfort",
        description:
          "If an idea will not work, you hear it before it costs you money — not after.",
      },
      deadlines: {
        name: "Dates that hold",
        description:
          "A deadline is a commitment. If something threatens it, you know early, not on the day.",
      },
      details: {
        name: "Detail as standard",
        description:
          "Hover states, focus rings, empty states, the wrong screen size. The parts nobody demos.",
      },
      quality: {
        name: "Quality over quantity",
        description:
          "Fewer projects at a time. Yours is not an item in a queue.",
      },
      result: {
        name: "Result over process",
        description:
          "Nobody buys wireframes. What matters is what the finished site does for you.",
      },
      transparency: {
        name: "Nothing hidden",
        description:
          "Clear pricing, clear scope, clear status. You always know what you're paying for.",
      },
    },
  },

  advantages: {
    eyebrow: "Why Ktenor",
    title: "One person. Start to finish.",
    intro:
      "You talk to the person who designs it, writes the code and ships it. Nothing gets lost between a manager, a designer and a developer — because they are the same person.",
    items: {
      direct: {
        name: "Direct contact",
        description:
          "No account managers, no handovers, no “let me check with the team”.",
      },
      stack: {
        name: "Modern stack",
        description:
          "Current tooling, not a page builder. The site stays maintainable long after launch.",
      },
      performance: {
        name: "Built to be fast",
        description:
          "Performance is a design constraint here, not an optimisation pass at the end.",
      },
      responsive: {
        name: "Every screen",
        description:
          "Phone, tablet, laptop, desktop — designed for each, not squeezed into one.",
      },
      seo: {
        name: "SEO from day one",
        description:
          "Structure, metadata and indexing handled while building, not bolted on later.",
      },
      bespoke: {
        name: "Nothing off the shelf",
        description:
          "Your site is drawn for your content. No theme, no recycled layout.",
      },
    },
  },

  testimonials: {
    eyebrow: "Testimonials",
    title: "What clients say.",
    intro: "Real ratings from real projects — moderated, never edited.",
    emptyTitle: "Be the first to leave a review.",
    emptyBody: "No reviews yet — this section fills up as the first projects wrap up.",
    leaveReview: "Leave a review",
    seeAll: "See all reviews",
  },

  reviews: {
    title: "What clients say.",
    intro:
      "Every review here comes from someone who actually worked with Ktenor. Submitted reviews are checked before they go live, so what you read is real.",
    formTitle: "Leave a review",
    formIntro: "A rating is enough — a line about the project is welcome but optional.",
    fields: {
      name: "Name",
      namePlaceholder: "How should this appear?",
      rating: "Rating",
      quote: "A word about the project",
      quotePlaceholder: "Optional — what stood out to you?",
      optional: "optional",
      required: "required",
    },
    submit: "Submit review",
    sending: "Sending…",
    success: {
      title: "Thank you — your review is in.",
      body: "It goes live once it's been checked, usually within a day.",
    },
    failure: {
      title: "That did not go through.",
      body: "Something failed on the way. Try again, or reach me directly.",
    },
    errors: {
      name: "Please enter your name.",
      rating: "Please choose a rating.",
    },
    consent: {
      label: "I agree to the processing of my personal data",
      link: "Privacy Policy",
    },
  },

  faq: {
    eyebrow: "FAQ",
    title: "Before you ask.",
    items: {
      timeline: {
        question: "How long will my site take?",
        answer:
          "Between two days and five weeks depending on the service — each one lists its own range. The figure holds once the scope is agreed; if something threatens it, you hear about it early.",
      },
      price: {
        question: "Why is the price only a starting figure?",
        answer:
          "Because the work is not identical across projects. The listed figure is the honest floor for that type of site; the final number depends on the number of pages, the features and how much of the content you already have.",
      },
      content: {
        question: "Do I need to provide text and images?",
        answer:
          "You can, and it keeps the price down. If you would rather not, copywriting and content population are add-ons and I will handle them.",
      },
      revisions: {
        question: "What if I want changes?",
        answer:
          "Two rounds of revisions are included in every project. Further rounds are billable. Bug fixes after launch are not revisions and are never charged as such.",
      },
      payment: {
        question: "How does payment work?",
        answer:
          "50% up front to start, 50% on completion before the site goes live. No hidden fees between those two points.",
      },
      after: {
        question: "What happens after launch?",
        answer:
          "The site is yours. If you want me to keep it updated and monitored, ongoing support is available monthly — but it is optional, never bundled in.",
      },
    },
  },

  cta: {
    title: "Have something in mind?",
    description:
      "Fewer projects, full attention. Tell me what you need and you will get a straight answer on scope, timing and cost.",
  },

  contact: {
    eyebrow: "Contact",
    title: "Start a project.",
    intro:
      "Fill in what you know. A name, an email and a phone number is enough to begin.",
    fields: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      dialCodeLabel: "Country code",
      phoneNumberPlaceholder: "911 608 486",
      phoneNumberPlaceholderOther: "Full number with country code",
      service: "What do you need?",
      servicePlaceholder: "Select a service",
      budget: "Budget",
      budgetPlaceholder: "Select a range",
      timeline: "Desired timeline",
      message: "About the project",
      messagePlaceholder: "What it is for, what it has to do, anything you already know.",
      optional: "optional",
      required: "required",
      recommended: "recommended",
    },
    countries: {
      SK: "Slovakia",
      CZ: "Czechia",
      AT: "Austria",
      HU: "Hungary",
      PL: "Poland",
      DE: "Germany",
      GB: "United Kingdom",
      IE: "Ireland",
      US: "United States",
      OTHER: "Other",
    },
    budgets: {
      under500: "Under €500",
      "500to1500": "€500 – 1 500",
      "1500to3000": "€1 500 – 3 000",
      over3000: "€3 000+",
    },
    consent: {
      label: "I agree to the processing of my personal data",
      link: "Privacy Policy",
    },
    submit: "Send enquiry",
    sending: "Sending…",
    success: {
      title: "Thank you — your enquiry is with me.",
      body: "I reply personally, usually within one working day. If you left an email address, a confirmation is already on its way to it.",
    },
    failure: {
      title: "That did not go through.",
      body: "Something failed on the way. Try again, or reach me directly — both land in the same place.",
      retry: "Try again",
    },
    rateLimit: "Too many attempts in a short time. Wait a few minutes, or contact me directly.",
    errors: {
      name: "Please enter your name.",
      email: "That email address does not look right.",
      phone: "That phone number does not look right.",
      service: "Please choose what you need.",
      consent: "Please agree to the processing of your data.",
    },
    direct: "Or reach me directly",
  },

  footer: {
    tagline: "Premium websites, designed and built end to end.",
    navTitle: "Navigate",
    contactTitle: "Contact",
    settingsTitle: "Preferences",
    social: "Social",
    rights: "All rights reserved.",
    privacy: "Privacy Policy",
    location: "Bratislava, Slovakia — working remotely across the country",
  },

  notFound: {
    title: "This page does not exist.",
    description:
      "The address is wrong, or the page has moved. Here is the way back.",
    services: "Services",
    work: "Work",
    orWrite: "Or just write to me",
  },

  error: {
    title: "Something went wrong.",
    description: "An unexpected error occurred. Try again, or contact me directly.",
    retry: "Try again",
  },
};

export default en;
export type Dictionary = typeof en;
