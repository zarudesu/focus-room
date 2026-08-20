# Focus Room — companion-app Dopamine Static

Бесплатный веб-companion YouTube-канала: if-then ритуал → movement snack → музыка канала → непунитивный итог. Без регистрации, биллинга и бэкенда; всё в localStorage. Спека и ватерфол: `../docs/spec-focus-ritual.md` (родительский зонтик `~/Projects/dopamine-static`, сам НЕ в git — этот репо вложенный).

## Команды

- `npm run dev` — дев-сервер
- `npm run build` — tsc + vite (DoD: зелёный)
- `npm run lint` — oxlint
- Деплой: push в main → GH Pages workflow → focus.adhdrenaline.com

## Структура

- `src/App.tsx` — стейт-машина экранов: entry → ritual → movement → session → review
- `src/strings.ts` — ВСЯ копия UI (i18n-ready; банк Calm Review здесь)
- `src/data/` — playlists (ID канона — НЕ менять без docs/lineup-taxonomy.md зонтика), themes (анлоки 3/7/15), movementSnacks, ritualPresets
- `src/lib/` — storage (localStorage, префикс `fr.`, shape-валидация через safeStorage), notification-budget (max 2 тоста/сессию), track (umami no-op без window.umami)
- `src/components/` — экраны + YouTubePlayer (IFrame API, onerror/timeout + фолбэк-ссылка на плейлист) + ErrorBoundary (чистит fr.* при краше)

## Жёсткие правила (спека §9 — блокеры ревью)

- Никаких: регистрации, пейволов, стриков/вины за пропуск, слова «AI» в копии, псевдонауки (40Hz/binaural), пуш-спама.
- Анлоки гейтят ТОЛЬКО украшения (темы), никогда пользу — главный урок beatyour8.
- Копия только через `strings.ts`; тон Calm Review — непунитивный, без «well done».
- Коммиты conventional; никаких следов AI в коммитах/коде.
- Метрика продукта — D7-возврат; события track() не переименовывать молча (ломает аналитику).
