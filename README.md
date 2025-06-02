# Platforma Uwierzytelniania i Wiadomości

Autorzy: Michał Kowalski, Oskar Stelmach
**Bezpieczna Komunikacja w Next.js**

Kompletna aplikacja Next.js zapewniająca bezpieczną komunikację w czasie rzeczywistym z uwierzytelnianiem użytkowników i szyfrowaniem end-to-end. Zbudowana w TypeScript, z nowoczesnym, responsywnym interfejsem.

---

## Spis treści

- [Pierwsze kroki](#pierwsze-kroki)
- [Główne funkcje](#główne-funkcje)
- [Architektura](#architektura)
- [Bezpieczeństwo](#bezpieczeństwo)
- [Rozwój](#rozwój)
- [Integracja API](#integracja-api)
- [Zarządzanie stanem](#zarządzanie-stanem)
- [Struktura plików](#struktura-plików)

---

## Pierwsze kroki

Aby uruchomić serwer deweloperski:

```bash
npm run dev
```

Następnie otwórz przeglądarkę i przejdź do [http://localhost:3000](http://localhost:3000).

---

## Główne funkcje

### System Uwierzytelniania

- Uwierzytelnianie oparte na sesjach (NextAuth)
- Identyfikacja użytkowników po nazwie
- Chronione trasy i API

### System Wiadomości

- Szyfrowanie end-to-end
- Wiadomości w czasie rzeczywistym
- Rozmowy wątkowe
- Wyszukiwanie i odkrywanie użytkowników
- Historia ze znacznikami czasu

### Interfejs Użytkownika

- Responsywny design, tryb ciemny
- Wskaźniki pisania
- Motywy czatu
- Integracja emoji
- Płynne przewijanie i animacje

---

## Architektura

Platforma podzielona na moduły zarządzające różnymi aspektami aplikacji.

### Moduł Wiadomości

#### Zarządzanie Wątkami (`/messages`)

- Lista aktywnych wątków
- Wyszukiwanie użytkowników
- Tworzenie rozmów z generowaniem klucza szyfrowania
- Zarządzanie wątkami (usuwanie, podgląd, awatary)

#### Aktywna Rozmowa (`/messages/thread/[id]`)

- Historia wiadomości (szyfrowanie/deszyfrowanie)
- Aktualizacje w czasie rzeczywistym
- Komponowanie i szyfrowanie wiadomości
- Motywy kolorystyczne
- Zaawansowane funkcje: wskaźniki pisania, przewijanie, emoji, znaczniki czasu

### Rozbicie Komponentów

- **Strona Wiadomości:** `app/(root)/messages/page.tsx` – punkt wejścia, uwierzytelnianie, renderowanie wątków
- **ThreadsClient:** `app/(root)/messages/ThreadsClient.tsx` – pobieranie wątków, wyszukiwanie, zarządzanie, aktualizacje
- **Strona Wątku:** `app/(root)/messages/thread/[id]/page.tsx` – walidacja sesji, autoryzacja, pobieranie danych
- **CurrentThreadClient:** `app/(root)/messages/thread/[id]/CurrentThreadClient.tsx` – czat, szyfrowanie, polling, UI, motywy

---

## Bezpieczeństwo

### Szyfrowanie Wiadomości

- Unikalne klucze szyfrowania dla każdego wątku
- Szyfrowanie przed zapisem do bazy
- Deszyfrowanie po stronie klienta

### Przepływ Uwierzytelniania

- Walidacja sesji na serwerze
- Autoryzacja na podstawie uczestnictwa w wątku
- Chronione API

---

## Rozwój

### Wymagania

- Node.js 18+
- Połączenie z bazą danych
- Zmienne środowiskowe do konfiguracji

---

## Integracja API

Komponenty komunikują się z API:

- `/api/messages/threads` – operacje na wątkach
- `/api/messages/messages` – wysyłanie i pobieranie wiadomości
- `/api/user` – wyszukiwanie użytkowników, dane profilu

---

## Zarządzanie stanem

- Hooki React
- Polling w czasie rzeczywistym
- Optymistyczne aktualizacje UI

---

## Struktura plików

### Struktura plików

- **app/**

  - `layout.tsx` – Główny layout HTML
  - `(root)/page.tsx` – Strona główna
  - `(root)/profile/page.tsx` – Profil użytkownika
  - `(root)/layout.tsx` – Layout sekcji uwierzytelnionych
  - `(root)/messages/`
    - `page.tsx` – Wiadomości – lista wątków
    - `ThreadsClient.tsx` – Komponent zarządzający wątkami
    - `thread/[id]/`
      - `page.tsx` – Strona pojedynczego wątku
      - `CurrentThreadClient.tsx` – Aktywny czat
  - `globals.css` – Globalne style CSS
  - `auth/error/page.tsx` – Błąd uwierzytelniania
  - `error/page.tsx` – Globalny błąd
  - `not-found.tsx` – Strona 404

- **api/**

  - `auth/[...nextauth]/`
    - `options.ts` – Konfiguracja NextAuth
    - `route.ts` – Handler API NextAuth
  - `user/route.ts` – API użytkowników
  - `messages/`
    - `messages/route.ts` – API wiadomości
    - `threads/route.ts` – API wątków
    - `thread/[id]/route.ts` – API pojedynczego wątku
    - `message/[id]/route.ts` – API pojedynczej wiadomości

- **lib/**

  - `mongodb.ts` – Połączenie z MongoDB
  - `models.ts` – Modele danych
  - `queries.ts` – Odczyt z bazy
  - `mutations.ts` – Zapis do bazy
  - `encryption.ts` – Szyfrowanie end-to-end
  - `utils.ts` – Funkcje pomocnicze

- **components/**

  - `Navbar.tsx` – Nawigacja
  - `AuthButtons.tsx` – Logowanie/wylogowanie
  - `Footer.tsx` – Stopka
  - `UIMode.tsx` – Przełącznik motywu
  - `Tooltip.tsx` – Tooltip

- **Pliki konfiguracyjne**
  - `.gitignore`
  - `package.json`
  - `tailwind.config.ts`
  - `tsconfig.json`
  - `next.config.ts`
  - `postcss.config.mjs`
  - `eslint.config.mjs`

---

**Stylowanie:**

- `app/globals.css` – Tailwind, niestandardowe komponenty, responsywność

---

**Autor:**
Projekt i wykonanie: [Twoje Imię lub Zespół]
