# marcinplywa.pl — szablon strony

**Podgląd na żywo:** https://szpytma.github.io/marcinplywa-www/

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

## Co trzeba uzupełnić przed publikacją

| Co | Gdzie |
|---|---|
| Numer telefonu (`+48 000 000 000`) | `index.html` — sekcja `#kontakt`, stopka, blok JSON-LD |
| Adres e-mail | `index.html` + `assets/js/main.js` (`CONTACT_EMAIL`) |
| Miasto / basen, na którym odbywają się zajęcia | `index.html` — sekcja `#kontakt` („Miejsce zajęć”) |
| Data w `sitemap.xml` | przy każdej aktualizacji treści |

Zdjęcia są już wstawione. Podmiana: wystarczy nadpisać `marcin-hero.jpg`
(kadr pionowy, twarz w górnej części) lub `marcin-woda.jpg` (kadr bardzo wysoki).
Gdyby pliku zabrakło, w sekcji powitalnej pokaże się zastępnik — strona nadal wygląda poprawnie.

### Formularz kontaktowy

Domyślnie formularz otwiera program pocztowy z gotową treścią wiadomości (tryb `mailto`).
Aby wiadomości przychodziły na e-mail bez otwierania klienta poczty, załóż darmowe konto
np. w [Formspree](https://formspree.io) i wpisz adres formularza w `assets/js/main.js`:

```js
var FORM_ENDPOINT = 'https://formspree.io/f/twoj-identyfikator';
```

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

### Własna domena marcinplywa.pl

1. Dodaj w katalogu głównym plik `CNAME` o treści `marcinplywa.pl`
2. U rejestratora domeny ustaw rekordy DNS:
   - `A` dla `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` dla `www` → `szpytma.github.io`
3. W ustawieniach repozytorium (Settings → Pages) wpisz domenę i zaznacz **Enforce HTTPS**
4. Podmień adresy w `index.html` (`canonical`, Open Graph) oraz w `sitemap.xml`

Strona jest w pełni statyczna, więc działa też na każdym innym hostingu:
zwykły FTP, Netlify, Cloudflare Pages, Vercel.

## Dostępność i wydajność

- semantyczny HTML, `lang="pl"`, link „Przejdź do treści”
- widoczny focus dla klawiatury, `aria-*` w menu i formularzu
- obsługa `prefers-reduced-motion` (wyłączone animacje)
- brak zależności zewnętrznych poza Google Fonts
- dane strukturalne JSON-LD (`LocalBusiness`) dla Google
- osobne style do druku
