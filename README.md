# Pittura Group — Website

Marketing website for **Pittura Group**, a Dubai-based web development, software development and mobile app development agency.

Pure static site — no framework, no build step. HTML + CSS + vanilla JS.

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| Services hub | `services.html` |
| Web Development | `web-development.html` |
| Software Development | `software-development.html` |
| Mobile App Development | `mobile-apps.html` |
| Work / Portfolio | `work.html` |
| About | `about.html` |
| Contact | `contact.html` |

## Run locally

Open `index.html` in a browser, or serve the folder:

```sh
npx serve .
# or
python -m http.server 8000
```

## Design system

- **Fonts:** Syne (display) + Inter (body), via Google Fonts
- **Palette:** near-black `#050507` canvas with a "liquid paint" gradient accent — violet `#7c3aed` → magenta `#ec4899` → amber `#f59e0b` (Pittura = "painting" in Italian)
- **Effects:** canvas aurora hero, custom cursor, magnetic buttons, scroll reveals, 3D-tilt spotlight cards, marquees, animated counters, FAQ accordions, portfolio filters. All respect `prefers-reduced-motion`.

## ⚠️ Placeholder content to replace

The following was invented as placeholder copy and **must be replaced with real data before going live**:

- **Stats** (projects shipped, years, retention, downloads, awards) on Home, Work and About
- **Portfolio projects** (Vaulta, Dunes, Karama, Meridian, Nokhba, Sukoon, Qafila, Ghaf) — fictional case studies
- **Testimonials** and author names
- **Team members** other than the founder
- **Phone number** `+971 4 400 1234` and street address (Dubai Design District, Building 7)
- **Pricing figures** in the FAQ sections
- **Social links** (currently `#`)

The contact form opens the visitor's mail client (`mailto:hello@pitturagroup.com`). Swap it for a form backend (Formspree, Basin, or your own API) when ready.
