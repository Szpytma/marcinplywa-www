/* =========================================================
   marcinplywa.pl — skrypty strony
   ========================================================= */
(function () {
  'use strict';

  /* ---- KONFIGURACJA ------------------------------------------------------
     CONTACT_EMAIL  — adres, na który trafiają wiadomości z formularza.
     FORM_ENDPOINT  — usługa FormSubmit (bez rejestracji). Pierwsza wysyłka
                      uruchamia mail aktywacyjny; po kliknięciu linku w tym
                      mailu formularz działa na stałe.
                      Po aktywacji warto podmienić adres na wersję z kluczem
                      (np. 'https://formsubmit.co/ajax/abc123...'), którą
                      FormSubmit przysyła — nie wystawia wtedy adresu e-mail
                      w kodzie strony.
                      Pusty ciąg = tryb zapasowy: otwarcie programu pocztowego.
  ------------------------------------------------------------------------ */
  var CONTACT_EMAIL = 'kontakt@marcinplywa.pl';
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/' + CONTACT_EMAIL;

  /* Etykiety pól w treści maila — bez tego przyszłyby surowe nazwy z HTML-a. */
  var FIELD_LABELS = {
    imie: 'Imię i nazwisko',
    telefon: 'Telefon',
    email: 'E-mail',
    uczestnik: 'Uczestnik',
    poziom: 'Poziom',
    wiadomosc: 'Wiadomość'
  };

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Rok w stopce ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nagłówek: tło po przewinięciu ---------- */
  var header = $('#site-header');
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu mobilne ---------- */
  var toggle = $('#nav-toggle');
  var nav = $('#nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---------- Podświetlenie aktywnej sekcji w menu ---------- */
  var navLinks = $$('#nav a[href^="#"]');
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- Animacje wejścia ---------- */
  var revealables = $$('.reveal');
  if ('IntersectionObserver' in window && revealables.length) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var delay = Math.min(i * 70, 280);
        setTimeout(function () { entry.target.classList.add('visible'); }, delay);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealables.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Liczniki statystyk ---------- */
  var counters = $$('.stat-num[data-count]');
  var runCounter = function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1100;
    var start = null;
    var step = function (ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && counters.length) {
    var counterObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- Paski umiejętności ---------- */
  var bars = $$('.bar');
  if ('IntersectionObserver' in window && bars.length) {
    var barObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-filled');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    bars.forEach(function (b) { barObserver.observe(b); });
  } else {
    bars.forEach(function (b) { b.classList.add('is-filled'); });
  }

  /* ---------- FAQ: tylko jedna odpowiedź otwarta ---------- */
  var faqItems = $$('.faq details');
  faqItems.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      faqItems.forEach(function (other) { if (other !== d) other.open = false; });
    });
  });

  /* ---------- Zdjęcie w hero: zastępnik, gdy brak pliku ---------- */
  var heroPhoto = $('#hero-photo');
  if (heroPhoto) {
    var img = $('img', heroPhoto);
    var markMissing = function () {
      heroPhoto.classList.add('is-placeholder');
      if (img && img.parentNode) img.parentNode.removeChild(img);
    };
    if (img) {
      if (img.complete && img.naturalWidth === 0) markMissing();
      img.addEventListener('error', markMissing);
    }
  }

  /* ---------- Formularz kontaktowy ---------- */
  var form = $('#contact-form');
  var note = $('#form-note');

  var setNote = function (msg, type) {
    if (!note) return;
    note.textContent = msg;
    note.className = 'form-note' + (type ? ' ' + type : '');
  };

  var validate = function () {
    var ok = true;
    $$('[required]', form).forEach(function (field) {
      var valid = field.type === 'checkbox' ? field.checked : field.value.trim() !== '' && field.checkValidity();
      field.classList.toggle('invalid', !valid);
      if (!valid && ok) { field.focus(); ok = false; }
    });
    var email = $('#email', form);
    if (email && email.value.trim() !== '' && !email.checkValidity()) {
      email.classList.add('invalid');
      if (ok) { email.focus(); ok = false; }
    }
    return ok;
  };

  if (form) {
    $$('input, select, textarea', form).forEach(function (field) {
      field.addEventListener('input', function () { field.classList.remove('invalid'); });
      field.addEventListener('change', function () { field.classList.remove('invalid'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validate()) {
        setNote('Proszę uzupełnić zaznaczone pola.', 'err');
        return;
      }

      var data = new FormData(form);
      var btn = $('button[type="submit"]', form);

      // Pułapka na boty: pole ukryte przed ludźmi. Wypełnione = spam.
      // Udajemy sukces, żeby bot nie próbował ponownie.
      if ((data.get('_honey') || '') !== '') {
        form.reset();
        setNote('Dziękuję — wiadomość została wysłana.', 'ok');
        return;
      }

      if (FORM_ENDPOINT) {
        if (btn) { btn.disabled = true; btn.textContent = 'Wysyłanie…'; }
        setNote('Wysyłanie wiadomości…', '');

        var payload = {
          _subject: 'Zapytanie ze strony — ' + (data.get('imie') || 'formularz'),
          _template: 'table',
          _captcha: 'false'
        };
        Object.keys(FIELD_LABELS).forEach(function (key) {
          payload[FIELD_LABELS[key]] = data.get(key) || '—';
        });
        payload['Zgoda na przetwarzanie danych'] = data.get('zgoda') ? 'tak' : 'nie';

        // Odpowiedź trafi wprost do nadawcy, o ile podał adres.
        var replyTo = (data.get('email') || '').trim();
        if (replyTo) payload._replyto = replyTo;

        fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(payload)
        })
          .then(function (res) {
            return res.json().catch(function () { return {}; });
          })
          .then(function (res) {
            if (String(res.success) !== 'true') {
              throw new Error(res.message || 'Nieznany błąd');
            }
            form.reset();
            setNote('Dziękuję — wiadomość została wysłana. Odezwę się wkrótce.', 'ok');
          })
          .catch(function () {
            setNote(
              'Nie udało się wysłać wiadomości. Proszę o kontakt telefoniczny (+48 664 984 527) ' +
              'lub e-mail na ' + CONTACT_EMAIL + '.',
              'err'
            );
          })
          .finally(function () {
            if (btn) { btn.disabled = false; btn.textContent = 'Wyślij zapytanie'; }
          });
        return;
      }

      // Tryb zapasowy: otwarcie programu pocztowego z gotową treścią
      var lines = [
        'Imię i nazwisko: ' + (data.get('imie') || ''),
        'Telefon: ' + (data.get('telefon') || ''),
        'E-mail: ' + (data.get('email') || ''),
        'Uczestnik: ' + (data.get('uczestnik') || ''),
        'Poziom: ' + (data.get('poziom') || ''),
        '',
        'Wiadomość:',
        (data.get('wiadomosc') || '')
      ];
      var subject = 'Zapytanie o naukę pływania — ' + (data.get('imie') || 'strona www');
      window.location.href =
        'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));

      setNote('Otwieram program pocztowy z gotową wiadomością…', 'ok');
    });
  }
})();
