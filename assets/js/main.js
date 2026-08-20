/* Audrey's Creations / A.C. Schoolwear - site behaviour */
(function () {
  'use strict';

  /* ---- Mobile navigation ---- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---- Highlight today's row in opening hours ---- */
  var todayIndex = new Date().getDay(); /* 0 = Sunday */
  document.querySelectorAll('.hours li[data-day]').forEach(function (li) {
    if (parseInt(li.getAttribute('data-day'), 10) === todayIndex) {
      li.classList.add('today');
    }
  });

  /* ---- School finder filtering ---- */
  var search = document.getElementById('school-search');
  var region = document.getElementById('school-region');
  var stage  = document.getElementById('school-stage');
  var groups = Array.prototype.slice.call(document.querySelectorAll('.school-group'));
  var empty  = document.getElementById('school-empty');

  function filterSchools() {
    if (!groups.length) return;
    var term = (search && search.value || '').trim().toLowerCase();
    var reg  = region ? region.value : 'all';
    var stg  = stage ? stage.value : 'all';
    var total = 0;

    groups.forEach(function (group) {
      var groupRegion = group.getAttribute('data-region');
      var groupStage  = group.getAttribute('data-stage');
      var regionOk = (reg === 'all' || reg === groupRegion);
      var stageOk  = (stg === 'all' || stg === groupStage);
      var shown = 0;

      group.querySelectorAll('.school-list li').forEach(function (li) {
        var name = (li.textContent || '').toLowerCase();
        var match = regionOk && stageOk && (term === '' || name.indexOf(term) !== -1);
        li.hidden = !match;
        if (match) shown++;
      });

      group.hidden = shown === 0;
      var count = group.querySelector('[data-count]');
      if (count) count.textContent = shown + (shown === 1 ? ' school' : ' schools');
      total += shown;
    });

    if (empty) empty.hidden = total !== 0;
  }

  [search, region, stage].forEach(function (el) {
    if (!el) return;
    el.addEventListener('input', filterSchools);
    el.addEventListener('change', filterSchools);
  });

  /* Pre-fill the finder from ?school= (set by the header search box) */
  if (search) {
    var q = new URLSearchParams(window.location.search).get('school');
    if (q) { search.value = q; search.focus(); }
    filterSchools();
  }

  /* ---- Header search sends you to the finder ---- */
  document.querySelectorAll('form[data-finder]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[name="school"]');
      var value = input ? encodeURIComponent(input.value.trim()) : '';
      window.location.href = form.getAttribute('data-finder') + (value ? '?school=' + value : '');
    });
  });

  /* ---- Contact form: build a pre-filled email ---- */
  var contact = document.getElementById('contact-form');
  if (contact) {
    /* Arriving from the school finder? Pre-fill the school and subject. */
    var fromSchool = new URLSearchParams(window.location.search).get('school');
    if (fromSchool) {
      if (contact.elements.school) contact.elements.school.value = fromSchool;
      if (contact.elements.subject) contact.elements.subject.value = 'School uniform';
      if (contact.elements.message) {
        contact.elements.message.value = 'I\'m looking for uniform for ' + fromSchool + '. ';
      }
    }

    contact.addEventListener('submit', function (e) {
      e.preventDefault();
      var get = function (n) {
        var f = contact.elements[n];
        return f ? f.value.trim() : '';
      };
      var subject = 'Website enquiry: ' + (get('subject') || 'General') + ' - ' + get('name');
      var body = [
        'Name: ' + get('name'),
        'Email: ' + get('email'),
        'Phone: ' + get('phone'),
        'School / organisation: ' + get('school'),
        'Enquiry type: ' + get('subject'),
        '',
        get('message')
      ].join('\n');
      window.location.href = 'mailto:audreyscreations2013@gmail.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);
      var note = document.getElementById('contact-status');
      if (note) {
        note.hidden = false;
        note.textContent = 'Your email app should now open with the message ready to send. '
          + 'If nothing happened, email audreyscreations2013@gmail.com or call 0141 880 7704.';
      }
    });
  }

  /* ---- Footer year ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
