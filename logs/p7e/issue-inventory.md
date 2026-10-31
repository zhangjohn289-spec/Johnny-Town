# Initial P7E inventory

Baseline: e55c6f8 (accepted P7D). Original working tree contained only the previously documented unrelated untracked reports. Local branch codex/p7e-mobile-accessibility.

| Priority | Component / reproduction | Observed / expected | Minimal correction |
| --- | --- | --- | --- |
| P1 | Desktop, focus Quick Introduction button then hold D | Traveler moves at 175 despite UI focus; expected no world movement while operating HTML controls. Phaser global capture also continues consuming arrow defaults. | Scene-owned focus ownership; suppress keyboard movement and release native key capture while UI owns focus. Focusable world surface gives an explicit return route. Keep touch independent. |
| P1 | Touch 667×375, DPR2, open long Quick Introduction | Whole panel scrolls (341px viewport / 633px content); sticky close overlays body text. Expected readable body plus separate accessible close. | Apply existing activity/trial flex layout principle to all dialogs; only body scrolls. Preserve all text. |
| P1 | Locked journal text, 13px | rgb(120,117,97) on parchment rgb(255,240,207) is relatively low contrast. | Darken only this text to rgb(98,98,79); no content/art changes. |
| P2 | Dialog keyboard focus ring | Pale focus ring is weak against parchment. | Dark green dialog-only outline; retain header focus styling. |
| Deferred | Chest rear approach, Town | Front route is supported; back approach is outside existing door radius. | Verify front touch access, record rear limitation; no radius/collision change. |

No P0 blocker was found in the initial audit. Further touch-only journey checks follow. Native dialog, existing joystick cancellation/resize/blur logic, audio-independent information routes and accepted gameplay are preserved rather than rewritten. Screenshots/data: before/results.json and before/landscape-intro.png.
