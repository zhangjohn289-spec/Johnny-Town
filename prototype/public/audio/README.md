# Johnny Town reviewed audio assets — Audio Pass Patch 01

Only Woods, Lake and Valley have continuous ambience. Town, Meadow and Ruins
are intentionally silent. No wind layers, replacement atmospheric beds, music
or voices are included.

Seven reviewed mono PCM16 / 22050 Hz WAV files: three 18-second ambiences and
four short UI cues (~2.31 MiB). Files load only after explicit opt-in;
silent regions load UI effects only. No private media is included.

## CC0 external sources (voluntary credit; attribution not required)

- **Spring Spring**, *Birds and Wind — Ambient* (nature-only variant):
  https://opengameart.org/content/birds-and-wind-ambient-birds-wind-and-synth
  - https://opengameart.org/sites/default/files/Birds%20and%20Wind%20-%20Ambient_1.ogg
  - Creator credits public-domain birds by isaiah658, syncopika, pauliuw.
  - `woods.wav`: two 1100 Hz high-pass stages and a smooth foreground expander
    retain sparse calls while rejecting the recording's windy bed. No separate
    wind source. Subjective listening remains an owner acceptance step.
- **transitking**, submitted by **qubodup**, *Water Waves*:
  https://opengameart.org/content/water-waves
  - https://opengameart.org/sites/default/files/wave_01_cc0-11505__transitking__wavesound.flac
  - Original: https://freesound.org/people/transitking/sounds/11505/
  - `lake.wav`: softened, overlapped small-wave recording only; no wind layer.

Publisher pages explicitly label these CC0:
https://creativecommons.org/publicdomain/zero/1.0/
Sources verified in the original Audio Pass. Original source hashes remain in
that report; source files stay in ignored scratch storage.

## Original sounds (CC0 contribution)

`valley.wav`: quiet 72 Hz machinery and damped 710 Hz metallic ticks only.
`open.wav`, `close.wav`, `confirm.wav`, `fortune.wav`: unchanged original short
warm tones with smooth envelopes; fortune adds a tiny woody transient.

## Removed sources and reproduction

Luke.RUSTLTD's wind1 is no longer loaded, used or required. Obsolete
`town.wav`, `meadow.wav`, `ruins.wav` were deleted. All four short effects are
byte-identical to the original Audio Pass.

`prototype/scripts/generate-audio.mjs` takes a local source directory containing
`forest.ogg` and `water.bin`, uses existing Edge/Playwright for offline decoding,
and adds no runtime dependency. It is not part of normal builds; no expensive
sound generation runs in the game loop.
