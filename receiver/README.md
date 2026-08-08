# Yogaholic — Cast Receiver

Statyczna strona (HTML/CSS/JS, bez build stepu) wyświetlana na telewizorze podczas castowania.
Mirroruje stan ekranu `app/run/[id].tsx` odbierając wiadomości JSON od telefonu przez custom
namespace `urn:x-cast:com.szymonwsteam.yogaholic.run` (kształt wiadomości: `src/cast/payload.ts`).

## Podgląd lokalny

```bash
cd receiver
python3 -m http.server 4173
```

Otwórz `http://localhost:4173` — zobaczysz ekran w stanie "Oczekiwanie na telefon…" (WebSocket
errory w konsoli do `ws://localhost:8008` są oczekiwane poza prawdziwym Chromecastem, CAF SDK
próbuje połączyć się z natywnym mostkiem urządzenia i się wycisza).

## Deploy (wymagane, zanim zarejestrujesz Custom Receiver w Google Cast Developer Console)

Cast wymaga publicznego, HTTPS URL-a. Najszybciej:

- **Vercel** — `npx vercel deploy receiver --prod` (albo przeciągnij folder na vercel.com/new).
- **GitHub Pages** — w ustawieniach repo włącz Pages dla folderu `receiver/` (branch `main`,
  `/receiver`).
- **Netlify Drop** — przeciągnij folder `receiver/` na app.netlify.com/drop.

Po deployu wklej URL w konsoli Cast (Custom Receiver → Receiver Application URL), skopiuj
przydzielony **Application ID** i zaktualizuj `app.json`:

```json
"plugins": [
  ..., 
  ["react-native-google-cast", { "receiverAppId": "TWOJE_APP_ID" }]
]
```

Potem trzeba przebudować dev client: `eas build --profile development --platform android`.

## Ręczny scenariusz QA (Faza C6, wymaga fizycznego Chromecasta/Android TV w tej samej sieci Wi-Fi)

1. Start sekwencji na telefonie → nacisnąć ikonę Cast w pasku górnym → sparować z TV.
2. Potwierdzić, że TV pokazuje to samo ćwiczenie/czas/progres co telefon (opóźnienie ~1s).
3. Pauza na telefonie → TV przestaje odliczać w tym samym momencie.
4. Zablokować telefon / zejść do tła na kilka sekund → wrócić → TV powinien doskoczyć do
   aktualnego stanu (bez zamrożenia).
5. Pominąć ćwiczenie (skip) → TV natychmiast pokazuje kolejne.
6. Dojść do końca sekwencji → TV pokazuje ekran "Świetna robota! / Trening zakończony", telefon
   przechodzi na ekran podsumowania.
7. Rozłączyć sesję Cast w trakcie treningu (z poziomu systemowego dialogu) → telefon działa dalej
   normalnie, bez crasha; przycisk Cast wraca do stanu "niepołączony".
