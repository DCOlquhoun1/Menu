# Audrey's Creations & Alterations — website

Static marketing site for **Audrey's Creations & Alterations** (trading as **A.C. Schoolwear**),
a family-run schoolwear, workwear, embroidery and alterations shop in Barrhead, East Renfrewshire.

The structure follows the pattern used by large schoolwear retailers such as Stevensons:
a "find your school" search as the primary entry point, split school-specific vs. plain uniform
routes, a category tile grid, a benefits strip, and service/branch pages behind a persistent
navy header and utility bar.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero with school finder, USP strip, category tiles, ordering steps, services, reviews, stores |
| `schools.html` | School finder with live search plus area/stage filters |
| `schoolwear.html` | Uniform, PE kit, leavers hoodies, dancewear, nursery, sizing guide |
| `workwear.html` | Branded workwear for businesses, sectors served, ordering process |
| `alterations.html` | Everyday alterations, uniform alterations, bridal/occasionwear, curtains & soft furnishings |
| `embroidery-printing.html` | Embroidery vs. vinyl printing, what we personalise, artwork guidance |
| `about.html` | Company story, why shop local, social links |
| `faqs.html` | Grouped accordion FAQs |
| `contact.html` | Both stores, opening hours, enquiry form, travel info |

Supporting files: `assets/css/styles.css`, `assets/js/main.js`, `robots.txt`, `sitemap.xml`.

## Running it

No build step and no dependencies — it is plain HTML, CSS and vanilla JavaScript.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying

Any static host will serve it as-is (GitHub Pages, Netlify, Cloudflare Pages, or the existing
hosting behind acschoolwear.org). Upload the repository root; `index.html` is the entry point.

If the site is published somewhere other than `https://www.acschoolwear.org/`, update the URLs in
`sitemap.xml` and `robots.txt` to match.

## What the JavaScript does

`assets/js/main.js` is one small file, no libraries:

- mobile navigation toggle
- highlights today's row in the opening-hours tables
- school finder: live text search plus area and stage filters, with an empty state
- header/hero search boxes redirect to `schools.html?school=…` and pre-fill the search
- school links carry the school name through to the contact form
- the contact form builds a pre-filled `mailto:` message (nothing is stored or posted anywhere)
- footer copyright year

## Before this goes live — things to confirm with Audrey

The content was written from publicly listed business information. These points need checking
against what the shop actually does today:

1. **School list** (`schools.html`) — only schools with public evidence of supply are listed
   (Barrhead High, St Luke's High, Eastwood High, Williamwood High, Woodfarm High, Mearns Castle
   High, Busby PS, Crookfur PS, Kirkhill PS, St Cadoc's PS, Glasgow Gaelic School, St Mark's PS).
   The real list is longer — add the rest, including the Renfrewshire and Edinburgh schools.
2. **Opening hours** — shown as Tue–Fri 10:00–16:00, Sat 10:00–14:00, closed Sun/Mon. Confirm,
   and confirm the separate Castlemilk hours.
3. **Second store** — Unit 6, 315 Drakemire Drive, Glasgow G45 9SS. Confirm it is still trading.
4. **Email address** — `audreyscreations2013@gmail.com` is used throughout;
   `acschoolwear@gmail.com` also appears publicly. Pick one.
5. **"Established 2013"** — inferred from the email address; confirm the real date.
6. **Reviews** on the home page are representative paraphrases, not verbatim quotes. Replace them
   with real reviews (with permission) or remove the section.
7. **Photography** — the design deliberately uses no stock imagery. Real photos of the shop, the
   embroidery machine and finished uniform would lift it considerably.
8. **Contact form** — currently opens the customer's own email app. If Audrey would rather receive
   submissions directly, wire it to a form service (Formspree, Netlify Forms) instead.
