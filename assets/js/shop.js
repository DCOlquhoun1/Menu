/* Audrey's Creations - shop and basket.
   Basket lives in localStorage; checkout sends the order to the shop
   by email as a reserve-and-collect request (paid in store). */
(function () {
  'use strict';

  var KEY = 'acBasket';
  var memory = null; /* fallback when localStorage is unavailable (e.g. sandboxed preview) */

  /* ---------- basket storage ---------- */

  function readBasket() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : (memory || []);
    } catch (e) { return memory || []; }
  }
  function writeBasket(items) {
    memory = items;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* memory only */ }
    updateBadge();
  }
  function basketCount() {
    return readBasket().reduce(function (n, it) { return n + it.qty; }, 0);
  }
  function addItem(entry) {
    var items = readBasket();
    var match = items.filter(function (it) {
      return it.school === entry.school && it.id === entry.id && it.size === entry.size;
    })[0];
    if (match) match.qty += entry.qty;
    else items.push(entry);
    writeBasket(items);
  }

  function money(pence) {
    return '£' + (pence / 100).toFixed(2);
  }

  /* ---------- header badge ---------- */

  function updateBadge() {
    var n = basketCount();
    document.querySelectorAll('[data-basket-count]').forEach(function (el) {
      el.textContent = n;
      el.hidden = n === 0;
    });
  }

  /* ---------- product icons ---------- */

  var ICONS = {
    blazer:   '<path d="M20 8l8-4 4 6 4-6 8 4v40h-8V26l-4 6-4-6v22h-8z"/>',
    tie:      '<path d="M28 6h8l-2 8h-4zM30 14h4l4 26-6 8-6-8z"/>',
    jumper:   '<path d="M18 10l8-4c2 3 10 3 12 0l8 4 6 12-8 4v26H20V26l-8-4z"/>',
    cardigan: '<path d="M18 10l8-4c2 3 10 3 12 0l8 4 6 12-8 4v26h-9V22h-2v30h-9V26l-8-4z"/>',
    shirt:    '<path d="M18 10l8-4 6 6 6-6 8 4 6 12-8 4v26H20V26l-8-4z"/>',
    polo:     '<path d="M18 10l8-4 6 8 6-8 8 4 6 12-8 4v26H20V26l-8-4zM30 14h4v8h-4z"/>',
    shorts:   '<path d="M16 12h32l4 32H36l-4-16-4 16H12z"/>',
    bag:      '<path d="M22 18v-4a10 10 0 0 1 20 0v4h8l-2 34H16l-2-34zm6 0h8v-4a4 4 0 0 0-8 0z"/>'
  };

  function iconSvg(kind) {
    return '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" ' +
      'stroke-linejoin="round" aria-hidden="true">' + (ICONS[kind] || ICONS.shirt) + '</svg>';
  }

  /* ---------- routing helpers (works on the site and in the preview) ---------- */

  function schoolSlug() {
    var q = new URLSearchParams(window.location.search).get('school');
    if (q) return q;
    var m = (window.location.hash || '').match(/^#\/shop\/([\w\-]+)/);
    return m ? m[1] : null;
  }
  function inPreview() {
    return document.querySelector('.route') !== null;
  }
  function shopHref(slug) {
    return inPreview() ? '#/shop/' + slug : 'shop.html?school=' + slug;
  }
  function basketHref() {
    return inPreview() ? '#/basket' : 'basket.html';
  }

  /* ---------- shop page ---------- */

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function renderShop() {
    var grid = document.getElementById('product-grid');
    if (!grid || !window.AC_CATALOG) return;

    var slug = schoolSlug();
    var data = slug ? AC_CATALOG.productsFor(slug) : null;
    var title = document.getElementById('shop-school-name');
    var intro = document.getElementById('shop-school-intro');
    var picker = document.getElementById('school-picker');

    if (!data) {
      /* no (or unknown) school chosen: show the picker */
      if (title) title.textContent = 'Choose your school';
      if (intro) intro.textContent = 'Pick your school below to see its uniform range, or use the search in the header.';
      grid.innerHTML = '';
      if (picker) {
        picker.hidden = false;
        picker.innerHTML = AC_CATALOG.schools.map(function (s) {
          return '<a class="tile" href="' + shopHref(s.slug) + '">' + esc(s.name) +
            '<small>' + esc(s.region) + ' · ' + (s.stage === 'primary' ? 'Primary' : 'Secondary') + '</small></a>';
        }).join('');
      }
      return;
    }

    if (picker) picker.hidden = true;
    if (title) title.textContent = data.school.name;
    if (intro) intro.textContent = 'Badged uniform for ' + data.school.name +
      '. Add what you need, then send the order — you pay when you collect in store, after a fitting if you want one.';

    grid.innerHTML = data.products.map(function (p) {
      var sizeOpts = p.sizes.map(function (s) {
        return '<option value="' + esc(s) + '">' + esc(s) + '</option>';
      }).join('');
      return (
        '<div class="product-card" data-product="' + esc(p.id) + '">' +
          '<div class="product-ico">' + iconSvg(p.icon) + '</div>' +
          '<h3>' + esc(p.name) + '</h3>' +
          '<p class="product-desc">' + esc(p.desc) + '</p>' +
          '<p class="price">' + money(p.price) + '</p>' +
          '<div class="product-controls">' +
            '<label>Size <select class="field" data-size>' + sizeOpts + '</select></label>' +
            '<label>Qty <input class="field" data-qty type="number" min="1" max="10" value="1"></label>' +
          '</div>' +
          '<button class="btn btn-primary" data-add>Add to basket</button>' +
          '<p class="added-note" data-added hidden>Added ✓ <a href="' + basketHref() + '">View basket</a></p>' +
        '</div>'
      );
    }).join('');

    grid.querySelectorAll('[data-add]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.product-card');
        var id = card.getAttribute('data-product');
        var p = data.products.filter(function (x) { return x.id === id; })[0];
        var qty = parseInt(card.querySelector('[data-qty]').value, 10);
        if (!p || !qty || qty < 1) return;
        addItem({
          school: data.school.slug,
          schoolName: data.school.name,
          id: p.id,
          name: p.name,
          size: card.querySelector('[data-size]').value,
          price: p.price,
          qty: Math.min(qty, 10)
        });
        var note = card.querySelector('[data-added]');
        if (note) note.hidden = false;
      });
    });
  }

  /* ---------- basket page ---------- */

  function renderBasket() {
    var wrap = document.getElementById('basket-items');
    if (!wrap) return;
    var items = readBasket();
    var emptyEl = document.getElementById('basket-empty');
    var formEl = document.getElementById('basket-checkout');
    var totalEl = document.getElementById('basket-total');

    if (!items.length) {
      wrap.innerHTML = '';
      if (emptyEl) emptyEl.hidden = false;
      if (formEl) formEl.hidden = true;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;
    if (formEl) formEl.hidden = false;

    var total = 0;
    wrap.innerHTML =
      '<div class="table-wrap"><table><thead><tr>' +
      '<th>Item</th><th>School</th><th>Size</th><th>Qty</th><th>Price</th><th></th>' +
      '</tr></thead><tbody>' +
      items.map(function (it, i) {
        total += it.price * it.qty;
        return '<tr>' +
          '<td>' + esc(it.name) + '</td>' +
          '<td>' + esc(it.schoolName) + '</td>' +
          '<td>' + esc(it.size) + '</td>' +
          '<td><input class="field qty-input" type="number" min="1" max="10" value="' + it.qty + '" data-row="' + i + '"></td>' +
          '<td>' + money(it.price * it.qty) + '</td>' +
          '<td><button class="link-btn" type="button" data-remove="' + i + '">Remove</button></td>' +
          '</tr>';
      }).join('') +
      '</tbody></table></div>';

    if (totalEl) totalEl.textContent = money(total);

    wrap.querySelectorAll('[data-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var items2 = readBasket();
        items2.splice(parseInt(btn.getAttribute('data-remove'), 10), 1);
        writeBasket(items2);
        /* defer: never replace the table from inside its own event */
        setTimeout(renderBasket, 0);
      });
    });
    wrap.querySelectorAll('[data-row]').forEach(function (input) {
      input.addEventListener('change', function () {
        var items2 = readBasket();
        var row = items2[parseInt(input.getAttribute('data-row'), 10)];
        if (row) row.qty = Math.max(1, Math.min(10, parseInt(input.value, 10) || 1));
        writeBasket(items2);
        setTimeout(renderBasket, 0);
      });
    });
  }

  function wireCheckout() {
    var form = document.getElementById('basket-checkout');
    if (!form || form.getAttribute('data-wired')) return;
    form.setAttribute('data-wired', '1');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var items = readBasket();
      if (!items.length) return;
      var get = function (n) { var f = form.elements[n]; return f ? f.value.trim() : ''; };
      var total = 0;
      var lines = items.map(function (it) {
        total += it.price * it.qty;
        return it.qty + ' x ' + it.name + ' (' + it.size + ') - ' + it.schoolName + ' - ' + money(it.price * it.qty);
      });
      var body = [
        'RESERVE & COLLECT ORDER',
        '',
        'Name: ' + get('name'),
        'Phone: ' + get('phone'),
        'Email: ' + get('email'),
        '',
        'Order:'
      ].concat(lines, [
        '',
        'Total (to pay in store): ' + money(total),
        '',
        'Notes: ' + get('notes')
      ]).join('\n');
      window.location.href = 'mailto:audreyscreations2013@gmail.com' +
        '?subject=' + encodeURIComponent('Reserve & collect order - ' + get('name')) +
        '&body=' + encodeURIComponent(body);
      var status = document.getElementById('basket-status');
      if (status) {
        status.hidden = false;
        status.textContent = 'Your email app should now open with the order ready to send. ' +
          'We’ll reply to confirm when it’s ready to collect. If nothing happened, call 0141 880 7704.';
      }
    });
  }

  /* ---------- boot ---------- */

  function boot() {
    updateBadge();
    renderShop();
    renderBasket();
    wireCheckout();
  }
  boot();
  window.addEventListener('hashchange', boot); /* preview router re-renders */
})();
