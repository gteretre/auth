# Kanban – aplikacja do zarządzania zadaniami

Autorzy projektu: Michał Kowalski, Eryk Tucki

## Technologie i konfiguracja

- **Next.js** – Framework do budowy aplikacji React z obsługą SSR/SSG.
- **TypeScript** – Typowanie statyczne.
- **Tailwind CSS** – Utility-first CSS framework.
- **MongoDB** – Baza danych NoSQL.
- **NextAuth.js** – Obsługa logowania przez GitHub, Google, Microsoft.

## Autoryzacja i uwierzytelnianie

Aplikacja obsługuje logowanie przez:

- GitHub
- Google
- Microsoft (Azure AD)

Przykład przycisków logowania:

```
<Tooltip text="Zaloguj się z GitHub" position="left">
  <button onClick={() => signIn("github")}>...</button>
</Tooltip>
<Tooltip text="Zaloguj się z Google" position="left">
  <button onClick={() => signIn("google")}>...</button>
</Tooltip>
<Tooltip text="Zaloguj się z Microsoft" position="left">
  <button onClick={() => signIn("azure-ad")}>...</button>
</Tooltip>
```

## Funkcjonalności aplikacji

- **Kanban** – Zarządzanie tablicami i zadaniami.
- Tworzenie, edycja, usuwanie tablic i zadań.
- Przeciąganie zadań między kolumnami (todo, in-progress, done).
- Przykładowe zadania po utworzeniu tablicy:

```
const demoTasks = [
  { title: "Przykładowe zadanie 1", description: "...", status: "todo", ... },
  { title: "Przykładowe zadanie 2", description: "...", status: "in-progress", ... },
  { title: "Przykładowe zadanie 3", description: "...", status: "done", ... }
];
```

## Struktura projektu

- `app/` – Główne strony i API (Next.js App Router)
- `components/` – Komponenty UI (Navbar, Footer, AuthButtons, Board, Card, Tooltip, UIMode)
- `lib/` – Logika biznesowa, modele, zapytania do bazy, mutacje
- `public/` – Pliki statyczne
- `tailwind.config.ts`, `postcss.config.mjs` – Konfiguracja stylów

## Przykładowe fragmenty UI

**Navbar** – Nawigacja z przyciskami do planów, profilu, trybu kolorów:

```
<Tooltip text="Moje plany" position="left">
  <Link href="/plan"><span><KanbanIcon /></span></Link>
</Tooltip>
<SignOutButton />
<Tooltip text={`Profil użytkownika ${session.user.username}`} position="left">
  <Link href={`/user/${session.user.username}`}><span><User /></span></Link>
</Tooltip>
```

**Tryb jasny/ciemny** – Przełącznik motywu:

```
function UIMode() { /* ... */ }
```

## Język polski

Interfejs użytkownika, komunikaty i przykładowe zadania są w języku polskim.

Przykład strony 404:

```
<h1 className="mb-4 text-4xl font-bold text-primary">
  404 - Strona nie istnieje
</h1>
<p className="mb-8 text-lg text-gray-500">
  Przykro nam, strona której szukasz została przeniesiona lub nie istnieje.
</p>
<Link href="/" className="search-btn rounded-full px-6 py-2">
  Wróć do strony głównej
</Link>
```

## Plik konfiguracyjny środowiska

Wymagane zmienne środowiskowe w `.env.local`:

- `MONGODB_URI`
- `MONGODB_DB`
- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_AZURE_AD_ID`
- `AUTH_AZURE_AD_SECRET`
- `AUTH_AZURE_AD_TENANT`

---

Aby uruchomić projekt:

1. Sklonuj repozytorium.
2. Zainstaluj zależności: `npm install`
3. Skonfiguruj plik `.env.local` według powyższych zmiennych.
4. Uruchom aplikację: `npm run dev`

---

Projekt stworzony w celach edukacyjnych. Wszystkie przykłady i fragmenty kodu mają charakter poglądowy.
