# marcinplywa.pl — szablon strony

**Strona:** https://marcinplywa.pl

Statyczna strona wizytówka (one-page) dla **Marcina Kędziora** — instruktora nauki pływania,
ratownika WOPR i nauczyciela Edukacji dla Bezpieczeństwa.

Bez frameworków, bez procesu budowania — czysty HTML + CSS + JavaScript.
Wystarczy wgrać pliki na dowolny hosting.

## Struktura

```
marcinplywa-www/
├── index.html              # cała treść strony
├── robots.txt
├── sitemap.xml
├── README.md
└── assets/
    ├── css/style.css       # style (paleta, komponenty, RWD)
    ├── js/main.js          # menu, animacje, FAQ, formularz
    └── img/
        ├── favicon.svg       # ikona strony
        ├── marcin-hero.jpg   # zdjęcie w sekcji powitalnej (1200×1600)
        └── marcin-woda.jpg   # zdjęcie w sekcji „Doświadczenie zawodnicze” (660×1600)
```

## Podgląd lokalny

Otwórz `index.html` w przeglądarce, albo uruchom prosty serwer:

```powershell
python -m http.server 8000
# → http://localhost:8000
```

## Dane kontaktowe na stronie

| Co | Wartość | Gdzie w kodzie |
|---|---|---|
| Telefon | +48 664 984 527 | `index.html` — sekcja `#kontakt`, stopka, blok JSON-LD |
| E-mail | kontakt@marcinplywa.pl | `index.html` + `assets/js/main.js` (`CONTACT_EMAIL`) |
| Miejsce zajęć | Rzeszów i okolice | `index.html` — sekcja `#kontakt`, `title`, `description`, JSON-LD |
| Data w `sitemap.xml` | aktualizuj przy każdej zmianie treści | `sitemap.xml` |

Zdjęcia są już wstawione. Podmiana: wystarczy nadpisać `marcin-hero.jpg`
(kadr pionowy, twarz w górnej części) lub `marcin-woda.jpg` (kadr bardzo wysoki).
Gdyby pliku zabrakło, w sekcji powitalnej pokaże się zastępnik — strona nadal wygląda poprawnie.

### Formularz kontaktowy

Formularz wysyła wiadomości przez [FormSubmit](https://formsubmit.co) na adres
`kontakt@marcinplywa.pl`. GitHub Pages to hosting statyczny — nie ma tam czego,
co mogłoby wysłać maila samo z siebie, stąd usługa pośrednicząca.

Konfiguracja jest w `assets/js/main.js`, na samej górze:

```js
var CONTACT_EMAIL = 'kontakt@marcinplywa.pl';
var FORM_ENDPOINT = 'https://formsubmit.co/ajax/' + CONTACT_EMAIL;
```

**Aktywacja (jednorazowo):** pierwsza wysyłka z formularza powoduje, że FormSubmit
przysyła na `kontakt@marcinplywa.pl` mail z linkiem aktywacyjnym. Do czasu kliknięcia
tego linku wiadomości nie są przekazywane.

**Po aktywacji** FormSubmit udostępnia adres z kluczem, np.
`https://formsubmit.co/ajax/a1b2c3d4...`. Warto go wpisać zamiast adresu e-mail —
wtedy skrzynka nie jest wystawiona w kodzie strony dla robotów zbierających adresy.

Zabezpieczenia w formularzu:

- ukryte pole `_honey` (honeypot) — wypełniają je tylko boty, takie zgłoszenia są odrzucane
- walidacja pól wymaganych po stronie przeglądarki
- `_replyto` ustawiany na adres nadawcy, więc „Odpowiedz” w kliencie poczty działa poprawnie

Aby wrócić do trybu otwierania programu pocztowego, wystarczy ustawić
`var FORM_ENDPOINT = '';`.

Walidacja pól (w `assets/js/main.js`):

| Pole | Reguła |
|---|---|
| Imię i nazwisko | wymagane, min. 3 znaki, musi zawierać literę |
| Telefon | wymagany, 9 cyfr; prefiks `+48` / `0048` obcinany tylko wtedy, gdy długość na to wskazuje — numer `48 123 45 67` (kierunkowy Radomia) zostaje nietknięty |
| E-mail | opcjonalny, ale jeśli podany — musi mieć poprawny format |
| Zgoda RODO | wymagane zaznaczenie |

Błędy pokazują się pod polami i znikają, gdy użytkownik zacznie poprawiać.

### ⚠️ Cache — pamiętaj przy każdej zmianie CSS lub JS

GitHub Pages wysyła `Cache-Control: max-age=600`, więc przeglądarki trzymają
stare `style.css` i `main.js` nawet przez 10 minut po wdrożeniu. Dlatego oba
pliki są linkowane z numerem wersji:

```html
<link rel="stylesheet" href="assets/css/style.css?v=20260920c">
<script src="assets/js/main.js?v=20260920c" defer></script>
```

**Po każdej edycji CSS lub JS podnieś `?v=...` w `index.html`** (np. na `20260921a`).
Bez tego część odwiedzających — i Ty sam — zobaczy starą wersję i będzie szukać
błędu, którego już nie ma.

### Kolory

Cała paleta jest w jednym miejscu — `assets/css/style.css`, blok `:root`:

```css
--navy-800:#0b3d5c;   /* granat — nagłówki, sekcje ciemne */
--blue-500:#1287b8;   /* niebieski — linki, akcenty */
--cyan-400:#17b6dd;   /* turkus — przyciski, ikony */
--aqua-100:#e6f6fb;   /* jasne tło elementów */
```

Zmiana tych czterech wartości zmienia kolorystykę całej strony.

## Sekcje strony

1. **Hero** — hasło przewodnie + dwa przyciski CTA
2. **Pasek zaufania** — cztery kluczowe atuty
3. **O mnie** — pełne bio, uprawnienia, statystyki, cytat
4. **Zajęcia** — dzieci / młodzież / dorośli / doskonalenie techniki
5. **Program** — na co zwracam uwagę podczas zajęć (8 punktów)
6. **Doświadczenie zawodnicze** — sekcja ciemna z paskami stylów
7. **Dlaczego warto** — 6 powodów
8. **Jak wyglądają zajęcia** — 5 kroków
9. **FAQ** — 6 pytań (rozwijane)
10. **CTA** — „Zapisz się na naukę pływania”
11. **Kontakt** — dane + formularz
12. **Stopka**

## Publikacja

Strona jest hostowana na **GitHub Pages** z gałęzi `main`, katalog `/`.
Każdy `git push` do `main` automatycznie aktualizuje stronę (build trwa ~1 minutę).

```powershell
git add -A
git commit -m "opis zmiany"
git push
```

### Domena marcinplywa.pl — konfiguracja (gotowe)

Domena jest zarejestrowana w OVH, a jej strefa DNS wskazuje na GitHub Pages.
Wymuszanie HTTPS jest włączone, certyfikat odnawia się automatycznie.

Strefa DNS w OVH (panel → Web Cloud → Domeny → marcinplywa.pl → Strefa DNS):

| Subdomena | Typ | Cel |
|---|---|---|
| @ | A | 185.199.108.153 |
| @ | A | 185.199.109.153 |
| @ | A | 185.199.110.153 |
| @ | A | 185.199.111.153 |
| @ | AAAA | 2606:50c0:8000::153 |
| @ | AAAA | 2606:50c0:8001::153 |
| @ | AAAA | 2606:50c0:8002::153 |
| @ | AAAA | 2606:50c0:8003::153 |
| www | CNAME | szpytma.github.io. |

`www.marcinplywa.pl` przekierowuje na `marcinplywa.pl` (robi to GitHub).

Plik `CNAME` w katalogu głównym repozytorium zawiera `marcinplywa.pl` —
**nie usuwaj go**, bo GitHub natychmiast odetnie własną domenę.

### Poczta

Skrzynka `kontakt@marcinplywa.pl` działa na **Zimbra Starter** (darmowy pakiet
w cenie domeny, 15 GiB). Webmail: https://webmail.mail.ovh.net/

Rekordy pocztowe w strefie: MX `mx0`–`mx3.mail.ovh.net` oraz SPF
`v=spf1 include:mx.ovh.com ~all`.

Konfiguracja w kliencie poczty:

| | |
|---|---|
| IMAP | `ssl0.ovh.net`, port 993, SSL/TLS |
| SMTP | `ssl0.ovh.net`, port 465, SSL/TLS |
| Login | pełny adres `kontakt@marcinplywa.pl` |

Strona jest w pełni statyczna, więc działa też na każdym innym hostingu:
zwykły FTP, Netlify, Cloudflare Pages, Vercel.

## Dostępność i wydajność

- semantyczny HTML, `lang="pl"`, link „Przejdź do treści”
- widoczny focus dla klawiatury, `aria-*` w menu i formularzu
- obsługa `prefers-reduced-motion` (wyłączone animacje)
- brak zależności zewnętrznych poza Google Fonts
- dane strukturalne JSON-LD (`LocalBusiness`) dla Google
- osobne style do druku
