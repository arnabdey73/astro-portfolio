# 🌐 Personal Portfolio with Astro

This project is a **professional developer portfolio** built with [Astro](https://astro.build), designed to showcase my experience as a DevOps/Cloud Engineer, highlight open-source projects, publish technical blogs, and prepare for potential **monetization** via GitHub Sponsors and Patreon.

---

## 📌 Goals

* Establish a **credible and elegant personal brand** online
* Attract **potential employers and collaborators**
* Enable future **monetization opportunities**
* Maintain a performant, accessible, and SEO-friendly site

---

## 📁 Pages Structure

| Page            | Purpose                                                                               |
| --------------- | ------------------------------------------------------------------------------------- |
| `/` (Home)      | Elevator pitch, tagline, recent work snapshot                                         |
| `/about`        | Background, journey, skills, tech stack                                               |
| `/projects`     | Key projects with images, GitHub links, and live demos                                |
| `/blog`         | [External Blog](https://blog.arnabdey.dev) built with Astro, integrated into the site |
| `/case-studies` | Long-form deep-dives on real-world problem-solving                                    |
| `/open-source`  | Contributions, sponsorship pitch, and GitHub activity                                 |
| `/resume`       | Downloadable and web-friendly resume                                                  |
| `/contact`      | Email, LinkedIn, GitHub, and optional contact form                                    |
| `/support`      | GitHub Sponsors, Patreon, BuyMeACoffee links                                          |

---

## 🛠️ Tech Stack

* **Framework**: Astro
* **Styling**: Tailwind CSS
* **Markdown**: MDX for case studies
* **Deployment**: Vercel (CI/CD + previews)
* **Analytics**: Plausible / Umami (privacy-first)
* **Accessibility**: WCAG AA compliance planned

---

## ✅ Features

* 💼 Professionally curated content (About, Projects, Resume)
* 🖍️ Blog hosted at [blog.arnabdey.dev](https://blog.arnabdey.dev) with Astro
* 🚀 Fast and SEO-optimized build
* 🧐 Designed with AI assistance (GitHub Copilot + Claude Sonnet)
* 🌟 Monetization hooks included

---

## � Current Status

**✅ Production Ready** - All core features implemented with robust fallbacks.

For complete project status, see **[docs/site-status.md](./docs/site-status.md)** which includes:
- Contact form multi-tier fallback system status
- GitHub API integration with rate limit handling
- All resolved issues and current site health

---

## �📂 Repo Structure

```
astro-portfolio/
├── public/                        # Static assets (images, icons, etc.)
│   ├── favicon.ico
│   └── og-images/
│       └── project-x.png
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ProjectCard.astro
│   │   └── SponsorButton.astro
│   ├── layouts/                  # Page layouts
│   │   ├── BaseLayout.astro
│   │   ├── BlogLayout.astro
│   │   └── ProjectLayout.astro
│   ├── pages/                    # Main route pages
│   │   ├── index.astro           # Home
│   │   ├── about.astro
│   │   ├── projects.astro
│   │   ├── case-studies.astro
│   │   ├── open-source.astro
│   │   ├── resume.astro
│   │   ├── contact.astro
│   │   └── support.astro
│   ├── styles/                   # Custom Tailwind or global styles
│   │   └── globals.css
│   ├── data/                     # Project data, links, case study metadata
│   │   ├── projects.json
│   │   └── sponsors.js
│   └── utils/                    # Helpers, date formatters, RSS, etc.
│       └── formatDate.ts
├── astro.config.mjs              # Astro config
├── tailwind.config.js            # Tailwind setup
├── tsconfig.json                 # TypeScript config (optional)
├── package.json
├── README.md
└── vercel.json                   # Vercel deployment config (optional)
```

---

## 🧐 Future Enhancements

* RSS feed for external blog
* Search and filtering on projects and case studies
* Dark/light theme toggle
* Email subscription or newsletter
* GitHub Sponsors integration with widget

---

## 🤝 Contributions & Feedback

This site is my personal playground and professional anchor. If you're reviewing this repo for collaboration, inspiration, or hiring — feel free to open issues or send feedback.

---

## 📃 License

MIT License — feel free to use this as a base with proper attribution.
