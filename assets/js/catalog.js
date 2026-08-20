/* Audrey's Creations - product catalogue.
   ONE place to edit schools, products and prices.
   Prices are in pence (1100 = £11.00) and are PLACEHOLDERS until
   confirmed by the shop. */
window.AC_CATALOG = (function () {
  'use strict';

  var SIZES = {
    blazer:  ['26"', '28"', '30"', '32"', '34"', '36"', '38"', '40"', '42"', '44"'],
    primary: ['3-4 yrs', '5-6 yrs', '7-8 yrs', '9-10 yrs', '11-12 yrs', '13 yrs'],
    teen:    ['9-10 yrs', '11-12 yrs', '13 yrs', 'S', 'M', 'L', 'XL', '2XL'],
    tie:     ['Standard', 'Clip-on'],
    one:     ['One size']
  };

  /* Product templates. Every school of a stage gets its stage's set;
     per-school tweaks can be added in overrides below. */
  var SECONDARY = [
    { id: 'blazer',    name: 'Badged Blazer',            price: 3400, sizes: SIZES.blazer,  icon: 'blazer',
      desc: 'School blazer with the crest embroidered in our workshop. Free sleeve turn-up with fitting.' },
    { id: 'tie',       name: 'School Tie',               price: 700,  sizes: SIZES.tie,     icon: 'tie',
      desc: 'Official school tie. Clip-on available for younger years.' },
    { id: 'jumper',    name: 'Badged V-Neck Jumper',     price: 1800, sizes: SIZES.teen,    icon: 'jumper',
      desc: 'Knitted v-neck in school colour with embroidered crest.' },
    { id: 'shirts',    name: 'Shirt Twin Pack (White)',  price: 1200, sizes: SIZES.teen,    icon: 'shirt',
      desc: 'Two easy-iron shirts. Long or short sleeve — tell us at collection.' },
    { id: 'pe-polo',   name: 'PE Polo (Crested)',        price: 1300, sizes: SIZES.teen,    icon: 'polo',
      desc: 'Breathable PE polo with printed crest. Names added on request.' },
    { id: 'pe-shorts', name: 'PE Shorts',                price: 850,  sizes: SIZES.teen,    icon: 'shorts',
      desc: 'Plain PE shorts in school colour.' }
  ];

  var PRIMARY = [
    { id: 'sweatshirt', name: 'Crested Sweatshirt',            price: 1100, sizes: SIZES.primary, icon: 'jumper',
      desc: 'Hard-wearing sweatshirt with embroidered school crest.' },
    { id: 'cardigan',   name: 'Crested Cardigan',              price: 1250, sizes: SIZES.primary, icon: 'cardigan',
      desc: 'Button-front cardigan with embroidered school crest.' },
    { id: 'polo',       name: 'Crested Polo Shirt',            price: 900,  sizes: SIZES.primary, icon: 'polo',
      desc: 'School-colour polo with embroidered crest.' },
    { id: 'plain-polo', name: 'Plain Polo Twin Pack (White)',  price: 800,  sizes: SIZES.primary, icon: 'polo',
      desc: 'Two plain white polos to mix with the crested one.' },
    { id: 'pe-tshirt',  name: 'PE T-Shirt',                    price: 700,  sizes: SIZES.primary, icon: 'shirt',
      desc: 'Plain PE t-shirt. Names printed on request.' },
    { id: 'bookbag',    name: 'Book Bag with Crest',           price: 850,  sizes: SIZES.one,     icon: 'bag',
      desc: 'Reinforced book bag with the school crest.' },
    { id: 'gymbag',     name: 'Gym Bag',                       price: 550,  sizes: SIZES.one,     icon: 'bag',
      desc: 'Drawstring gym bag in school colour.' }
  ];

  var SCHOOLS = [
    { slug: 'barrhead-high',          name: 'Barrhead High School',            stage: 'secondary', region: 'East Renfrewshire' },
    { slug: 'st-lukes-high',          name: "St Luke's High School",           stage: 'secondary', region: 'East Renfrewshire' },
    { slug: 'eastwood-high',          name: 'Eastwood High School',            stage: 'secondary', region: 'East Renfrewshire' },
    { slug: 'williamwood-high',       name: 'Williamwood High School',         stage: 'secondary', region: 'East Renfrewshire' },
    { slug: 'woodfarm-high',          name: 'Woodfarm High School',            stage: 'secondary', region: 'East Renfrewshire' },
    { slug: 'mearns-castle-high',     name: 'Mearns Castle High School',       stage: 'secondary', region: 'East Renfrewshire' },
    { slug: 'busby-primary',          name: 'Busby Primary School',            stage: 'primary',   region: 'East Renfrewshire' },
    { slug: 'crookfur-primary',       name: 'Crookfur Primary School',         stage: 'primary',   region: 'East Renfrewshire' },
    { slug: 'kirkhill-primary',       name: 'Kirkhill Primary School',         stage: 'primary',   region: 'East Renfrewshire' },
    { slug: 'st-cadocs-primary',      name: "St Cadoc's Primary School",       stage: 'primary',   region: 'East Renfrewshire' },
    { slug: 'glasgow-gaelic',         name: 'Glasgow Gaelic School (Secondary)', stage: 'secondary', region: 'Glasgow' },
    { slug: 'glasgow-gaelic-primary', name: 'Glasgow Gaelic School (Primary)', stage: 'primary',   region: 'Glasgow' },
    { slug: 'st-marks-primary',       name: "St Mark's Primary School",        stage: 'primary',   region: 'Glasgow' }
  ];

  /* Per-school additions or replacements, keyed by slug.
     add: extra products. Example kept for the Gaelic school, whose
     range includes a girls' flannel blazer on the current site. */
  var OVERRIDES = {
    'glasgow-gaelic': {
      add: [
        { id: 'girls-blazer', name: 'Girls Flannel Blazer', price: 3600, sizes: SIZES.blazer, icon: 'blazer',
          desc: 'Fitted flannel blazer with embroidered crest.' }
      ]
    }
  };

  function productsFor(slug) {
    var school = SCHOOLS.filter(function (s) { return s.slug === slug; })[0];
    if (!school) return null;
    var base = (school.stage === 'secondary' ? SECONDARY : PRIMARY).slice();
    var extra = (OVERRIDES[slug] && OVERRIDES[slug].add) || [];
    return { school: school, products: base.concat(extra) };
  }

  return { schools: SCHOOLS, productsFor: productsFor };
})();
