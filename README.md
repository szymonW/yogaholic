# Yogaholic

Aplikacja mobilna do prowadzenia sesji jogi — sekwencje ćwiczeń, tryb treningu z timerem, kalendarz i cele tygodniowe. Zbudowana w Expo (React Native) z routingiem plikowym Expo Router i stanem w Zustand.

## Wymagania

- **Node.js 20+** (projekt był budowany na v24.19.0). Jeśli w terminalu `node`/`npm`/`npx` nie są rozpoznawane mimo zainstalowanego [nvm](https://github.com/nvm-sh/nvm), doładuj go w danej sesji terminala:
  ```bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
  ```
- **npm** (dołączony do Node)
- Do testowania na telefonie: aplikacja **Expo Go** (App Store / Google Play)
- Do testowania na symulatorze/emulatorze (opcjonalnie): Xcode (iOS) lub Android Studio (Android)

## Instalacja

```bash
npm install
```

W repo jest plik `.npmrc` z `legacy-peer-deps=true` — jest **wymagany**, bo devtools `expo-router` mają konflikt wersji `react-dom` z resztą zależności SDK 57. Bez tego `npm install` kończy się błędem `ERESOLVE`.

## Uruchomienie

```bash
npm start
```

Otworzy się Metro/Expo CLI z kodem QR. Dalej:

- **Telefon (Expo Go)** — zeskanuj QR aparatem (iOS) lub z poziomu apki Expo Go (Android). Telefon i komputer muszą być w tej samej sieci Wi-Fi (w przeciwnym razie użyj `npx expo start --tunnel`).
- **Symulator iOS** — naciśnij `i` w terminalu (wymaga Xcode).
- **Emulator Androida** — naciśnij `a` w terminalu (wymaga Android Studio).
- **Przeglądarka** — naciśnij `w`, albo `npm run web`.

### Uwaga o wersji Expo Go

Ten projekt jest na **Expo SDK 57**. Jeśli przy skanowaniu QR na telefonie pojawi się `Project is incompatible with this version of Expo Go`, apka Expo Go na telefonie ma starszą wersję SDK niż projekt (widać to w samej apce Expo Go, w profilu). Sklep Play zwykle nadgania szybko, ale jeśli nie — wejdź na `expo.dev/go` na telefonie, wybierz SDK 57 i zainstaluj stamtąd wskazaną wersję.

## Skrypty

| Komenda | Co robi |
|---|---|
| `npm start` | Uruchamia dev server (Expo CLI / Metro) |
| `npm run ios` | Uruchamia dev server i otwiera symulator iOS |
| `npm run android` | Uruchamia dev server i otwiera emulator Androida |
| `npm run web` | Uruchamia dev server w trybie web |
| `npm test` | Uruchamia testy jednostkowe (Jest) |
| `npm run lint` | ESLint (`expo lint`) |
| `npm run typecheck` | Sprawdzenie typów TypeScript (`tsc --noEmit`) bez emitowania plików |

Przed commitem/PR warto odpalić wszystkie trzy:

```bash
npm run typecheck && npm run lint && npm test
```

## Struktura projektu

```
app/            trasy Expo Router (routing plikowy) — każdy plik to ekran
src/
  components/   komponenty UI wielokrotnego użytku + ikony SVG
  store/        stan globalny (Zustand), część z zapisem w AsyncStorage
  data/         dane startowe (przykładowe sekwencje, pula ćwiczeń)
  theme/        kolory, spacing, typografia
  types/        wspólne typy TypeScript
  utils/        czyste funkcje pomocnicze (czas, kalendarz, historia)
  hooks/        hooki React (np. logika timera treningu)
```

Testy (`*.test.ts`/`*.test.tsx`) leżą obok testowanego pliku.

## Uwagi

- `.claude/launch.json` i `.claude/settings.local.json` są celowo poza repo (`.gitignore`) — zawierają ścieżki/ustawienia specyficzne dla konkretnej maszyny.
- Projekt jest powiązany ze zdalnym projektem EAS (`app.json` → `extra.eas.projectId`) pod kątem przyszłych buildów przez `eas build`, ale nic się nie builduje/publikuje automatycznie.
