# Johnny Town Audio Pass assets

All ten WAVs in this directory are reviewed public build assets. No private
video, extracted video soundtrack, commercial music or NPC voice is included.
Mono PCM16, 22050 Hz. Six 18-second ambiences plus four short UI cues; ~4.58 MiB
total. Each region downloads only its own ~775 KiB file on demand after opt-in.
PCM WAV deliberately avoids codec/encoder dependencies and has broad browser
decode support. Runtime decoded ambience is ~1.51 MiB each (float32).

## External inputs (CC0 1.0; attribution not required, credited voluntarily)

- **Luke.RUSTLTD**, *wind1*: https://opengameart.org/content/wind1
  - Source: https://opengameart.org/sites/default/files/wind1.wav
  - Creator describes synthesized wind made with PureData.
- **Spring Spring**, *Birds and Wind — Ambient* (nature-only variant):
  https://opengameart.org/content/birds-and-wind-ambient-birds-wind-and-synth
  - Source: https://opengameart.org/sites/default/files/Birds%20and%20Wind%20-%20Ambient_1.ogg
  - Creator credits public-domain bird effects by isaiah658, syncopika, pauliuw.
  - Only the ambience variant is used, not the tracks containing synth music.
- **transitking**, submitted by **qubodup**, *Water Waves*:
  https://opengameart.org/content/water-waves
  - Source: https://opengameart.org/sites/default/files/wave_01_cc0-11505__transitking__wavesound.flac
  - Original: https://freesound.org/people/transitking/sounds/11505/

Each publisher page explicitly labels the material CC0. License:
https://creativecommons.org/publicdomain/zero/1.0/
Checked/downloaded 2026-10-31. Inputs stay in ignored local scratch space;
only these prepared derivatives ship. Source hashes are in the Audio Pass report.

## Derivative mapping / original synthesis

`town.wav`: filtered wind + sparse nature; `woods.wav`: nature-forward wind;
`meadow.wav`: stronger open wind, very low nature; `lake.wav`: softened wave
recording + breeze; `valley.wav`: breeze + original 72 Hz motor and damped
metallic ticks; `ruins.wav`: hollow breeze + very quiet 146/219 Hz resonance.
Sources are filtered, DC-rejected, level-limited, trimmed and overlapped for
loop continuity. No melodies or musical samples added.

`open.wav`, `close.wav`, `confirm.wav`, `fortune.wav`: original short synthesized
warm tones with smooth envelopes; fortune adds a tiny original woody transient.
Original generated material and derivative contributions are dedicated to CC0.

Reproduction utility: `prototype/scripts/generate-audio.mjs`, accepts a local
source directory, uses an already installed Edge/Playwright decoder offline,
and adds no game dependency. Do not run it as part of normal builds.

These are restrained prepared sound designs, not recordings of six real places.
Subjective listening approval and physical mobile speaker/headphone balancing
remain the owner's acceptance step.
