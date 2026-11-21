# ClipForge mobile (Expo app)

The screen half of ClipForge: a native Expo app that talks to the ClipForge
engine running in Termux on the **same Android phone**, over
`http://127.0.0.1:8787`. No cloud, no accounts, no AI API key. The engine repo
is `clipforge-engine`.

## Phase 1 scope

- **Device check** tab: live capability report straight from the engine
  (ffmpeg, Node, free storage, and what is still missing). Features stay off
  until their check passes. Shows a plain-language "Engine offline: open Termux
  and run `npm start`" banner instead of spinning forever.
- **Library** tab: pick a video, chunked upload (5 MB pieces) to the engine,
  the engine probes it with ffprobe, and finished exports can be saved to the
  gallery (with permission asked only when needed).
- **Settings** tab: unpair from the engine. Skills, downloader rights and
  Paperclip toggles arrive in later phases.

## Pairing

On first run the engine prints a one-time 6-digit code in Termux. Later phases
add the pair screen; until then the app stores the tokens it receives and sends
the access token on every call.

## Honest states

No fake success screens. Offline engine, upload failures, killed jobs (signal 9
from Android) and missing capabilities are all surfaced as visible states.

## Run

```sh
npm install
npx expo start
```

Open in Expo Go on the same phone as the engine. Cleartext HTTP is allowed only
for the loopback connection to the engine.
