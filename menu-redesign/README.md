# Cova Catering — Menu booklet template

A faithful HTML/CSS rebuild of the original Pages menu booklet, so the menus can be
redesigned by editing content only — the fonts, colours, motifs and layout all stay
exactly on-brand.

## Files

- `index.html` — the whole booklet, one `<section class="page">` per A4 page.
  All content lives here as plain HTML; edit dishes/text and re-export.
- `assets/style.css` — the design system (colours, type, page kinds). Only touch
  this to adjust the template itself, not for content changes.
- `assets/sprig-wheat.svg` — gold wheat sprig motif (extracted from the original PDF)
- `assets/fern.png` — gold fern motif used on the Breakfast / Bowl Food / Afternoon Tea pages
- `assets/swoosh.svg` — pale sage "C" swoosh on the contents page
- `assets/fonts/` — self-hosted web fonts + `fonts-local.css`
- `Cova_Catering_Menus_template.pdf` — the exported booklet

## Design tokens (extracted from the original)

| Token | Value |
|---|---|
| Menu green | `#6F856A` (contents `#617D64`) |
| Gold motif | `#D6A065` |
| Frame grey | `#D0CECE` |
| Cover green | `#265135` |
| Label grey | `#404040` |
| Display font | Bodoni 72 Oldstyle (falls back to Bodoni Moda on non-Mac) |
| Body font | Cochin (falls back to EB Garamond) |

On a Mac, the true Bodoni 72 Oldstyle and Cochin fonts are used automatically; the
bundled Google fonts are near-identical fallbacks so the PDF renders the same anywhere.

## Page kinds

- `page menu` — sprig + italic title + section labels + dishes (add `roomy` for
  short menus that need more breathing room)
- `page divider` — sprig + big italic title one-third down, intro copy below
- `page divider-plain` — motif + title dead centre (Canapés, Breakfast, …)
- `page cover` — dark green page with white text (intro + thank-you pages)
- `page contents` — contents page with the sage swoosh
- Fern-styled pages use `frame frame-deep` and the `fern` image instead of the sprig

A dish is just:

```html
<div class="dish"><h3>Dish Name</h3><p>Description of the dish</p></div>
```

## Re-export the PDF

```bash
chromium --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="Cova_Catering_Menus_template.pdf" "file://$PWD/index.html"
```

(Any Chrome/Chromium works; on Mac use
`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.)
