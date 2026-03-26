# Bug Kitchen — Antigravity / Claude Task Pack v0.2 (Merged)

This task pack is the **implementation companion** to `Bug_Kitchen_GDD_v0_2.md`.

It incorporates the merged feedback from the uploaded AI reviews.
The main shifts from v0.1 are:
- stronger first-playable criteria,
- **Slipper Orbit** elevated as a first-class hook,
- **splat factor** treated as a core requirement,
- MVP scope tightened harder,
- Yandex risk items phrased more safely.

---

## 0. Operating Rules

### 0.1 Patch discipline
Work in **small, reviewable patches**.
Do not attempt a giant rewrite in one pass.

### 0.2 Architecture discipline
Preserve the current Phaser scene architecture unless explicitly told otherwise.

### 0.3 Product discipline
Do not debate the concept.
`Bug Kitchen` is locked.

### 0.4 Response format
For every coding task below:
- change only the requested files,
- do not add systems unless explicitly necessary,
- return a **unified diff only**.

---

## 1. Locked Project Goal

Pivot the existing Phaser web game from `Void Survivors` into **Bug Kitchen**:
a bright, readable, cartoon household pest survivor for Yandex Games.

---

## 2. Non-Negotiable Product Rules

- no dark fantasy
- no neon void look
- no horror infestation tone
- no realistic insect detail
- no abstract magic naming
- no sci-fi residue
- no “cleanup sim” passivity
- household anti-bug fantasy only
- high readability on mobile and desktop
- first screenshot must instantly read as:
  - kitchen
  - bugs
  - anti-bug action
- **Slipper Orbit** must be treated as a premier hook
- **splat feedback** must be treated as essential, not optional polish

---

## 3. Technical Constraints

Keep and reuse the current structure:
- `src/data/constants.js`
- `src/data/enemies.js`
- `src/data/weapons.js`
- `src/scenes/BootScene.js`
- `src/scenes/MenuScene.js`
- `src/scenes/GameScene.js`
- `src/scenes/UpgradeScene.js`
- `src/scenes/GameOverScene.js`
- `src/sdk/YandexSDK.js`

Do not introduce:
- ECS
- inventory systems
- physics rewrites
- meta-progression frameworks
- complex AI layers
- giant utility abstractions
- new genre layers

---

## 4. MVP Lock

The first playable should aim for:
- 1 kitchen arena
- 5 enemy types max
- 5 weapons max
- 5 passives max
- 1 main run mode
- 1 early boss minimum
- record saving
- mobile + desktop readability
- strong first-kill feedback

Do **not** build:
- multiple arenas
- biomes
- skill trees
- shops
- crafting
- story mode
- achievement system
- complex daily systems
- deep cosmetics pipeline

---

## 5. Task Pack 1 — Data / Naming Pivot

### Goal
Replace all theme-facing names, descriptions, and palette values without changing core gameplay systems.

### Required enemy mapping
- `slime` → `Cockroach`
- `skeleton` → `Fly`
- `ghost` → `Moth`
- `golem` → `Beetle`
- `demon` → `Hornet`

### Required boss mapping
- `voidLord` → `Cockroach Queen`
- `deathKnight` → `Giant Mutant Fly`
- `ancientDragon` → `Fridge Monster`

### Required weapon mapping
- `energyBall` → `Spray Can`
- `lightning` → `Bug Zapper`
- `fireAura` → `Hot Steam Aura`
- `orbitShield` → `Slipper Orbit`
- `meteorStrike` → `Poison Bomb`

### Required passive mapping
- `moveSpeed` → `Kitchen Hustle`
- `maxHp` → `Thick Skin`
- `xpMagnet` → `Crumb Magnet`
- `regen` → remove or retheme conservatively; do **not** build the product around passive regen
- `armor` → `Apron Armor`
- `luck` → `Pest Instinct`

### Files
- `src/data/constants.js`
- `src/data/enemies.js`
- `src/data/weapons.js`

### Acceptance criteria
- all visible naming is Bug Kitchen themed
- palette shifts to warm kitchen tones
- no user-facing void/fantasy terminology remains
- gameplay systems remain stable

### Output requirement
Return a unified diff only.

---

## 6. Task Pack 2 — Procedural Visual Rewrite

### Goal
Rewrite the generated visuals so the game reads as Bug Kitchen in one screenshot.

### Requirements
In `src/scenes/BootScene.js`, replace current texture generation with readable cartoon household pest visuals.

Create or rewrite draw functions for:
- player as a simple kitchen defender / resident in visible slippers
- cockroach
- fly
- moth
- beetle
- hornet
- cockroach queen
- giant mutant fly
- fridge monster
- spray projectile
- zap projectile
- steam aura visual
- slipper orbit visual
- poison bomb visual
- crumb pickup

### Visual rules
- readability over detail
- exaggerated silhouettes are encouraged
- bugs may be larger than realism
- warm floor / kitchen context must be visible
- no realistic horror anatomy
- no neon cyan / purple void residue

### Acceptance criteria
- screenshot instantly reads as kitchen bug action
- enemy silhouettes are separable on mobile
- player identity is readable
- Slipper Orbit is visually obvious and funny

### Output requirement
Return a unified diff only.

---

## 7. Task Pack 3 — UI / Copy / Tone Rewrite

### Goal
Replace all remaining void/cyber tone with Bug Kitchen tone.

### Required changes
- title becomes `BUG KITCHEN`
- subtitle communicates a kitchen under infestation
- menu visuals use warm kitchen accents
- upgrade cards read as household anti-bug tools
- game over copy is playful and arcade-like, not dark
- remove all abstract fantasy phrasing

### Files
- `src/scenes/MenuScene.js`
- `src/scenes/UpgradeScene.js`
- `src/scenes/GameOverScene.js`
- supporting constants only if truly needed

### Acceptance criteria
- menu no longer looks like a void survivor
- upgrade text supports household fantasy
- game over invites immediate retry
- no dark-fantasy residue remains in UI copy

### Output requirement
Return a unified diff only.

---

## 8. Task Pack 4 — Core Feel / Splat Pass

### Goal
Make the first kill and early combat feel satisfying.

### Priority order
1. enemy hit flash
2. enemy death splat particles
3. short-lived stain / squash trace
4. stronger pickup pop / magnetism
5. tiny screen shake on major impacts
6. remove magical-looking old VFX

### Requirements
Implement the smallest high-impact version of:
- visible hit flash
- enemy death particle pop
- short stain or flattened bug trace
- stronger pickup arrival feedback
- boss hit / death emphasis
- special love to **Slipper Orbit** impacts

### Primary file
- `src/scenes/GameScene.js`

### Rules
- do not overengineer
- do not introduce particle frameworks
- do not add heavy physics
- do not add large VFX systems

### Acceptance criteria
- first 3 kills visibly feel better
- Slipper Orbit feels materially stronger and funnier
- enemies no longer vanish silently
- pickups feel rewarding

### Output requirement
Return a unified diff only.

---

## 9. Task Pack 5 — Enemy Readability & First Playable Validation

### Goal
Tune the early run so the first 5 seconds and first 2–3 minutes validate the concept.

### Required focus
- cockroaches readable instantly
- first kill happens quickly
- early weapon choice between Spray Can and Slipper Orbit is clear
- first wave density remains readable
- Cockroach Queen appears early enough to punctuate the run

### Primary tuning targets
- early enemy counts
- early enemy speed
- pickup visibility
- boss timing
- first minute weapon choice pacing

### Acceptance criteria
A new player should be able to say within 5 seconds:
> “I am killing bugs in a kitchen.”

And within the first run:
- first kill feels good
- first weapon choice matters
- the Queen is memorable
- death feels fair enough to retry

### Output requirement
Return a unified diff only.

---

## 10. Task Pack 6 — Yandex Compliance Pass

### Goal
Patch platform-risk items without changing the core game.

### Requirements
- verify pause is available
- verify mute is available
- ensure fullscreen ad flow pauses gameplay and sound
- avoid making rewarded revive the main product pillar
- implement record saving at minimum
- keep guest play possible without forced authorization

### Files
- `src/sdk/YandexSDK.js`
- `src/scenes/GameOverScene.js`
- any minimum additional files truly required

### Acceptance criteria
- records save
- ad flow does not leave gameplay/sound running
- game remains playable without forced login
- compliance-related behavior is stable and minimal

### Output requirement
Return a unified diff only.

---

## 11. Task Pack 7 — Packaging Readability Polish

### Goal
Improve the first screenshot and store-facing readability using only in-game changes.

### Focus
- warm floor clarity
- visible player silhouette
- visible Slipper Orbit or Spray Can
- readable bug ring
- readable crumbs / splats
- clean minimal UI for capture

### Rules
Do not add fake marketing scenes.
Improve the real gameplay view.

### Acceptance criteria
A captured real gameplay frame should clearly show:
- kitchen setting
- visible anti-bug weapon
- swarm pressure
- splat satisfaction

### Output requirement
Return a unified diff only.

---

## 12. Absolute Do-Not-Do List

- do not add lore systems
- do not add narrative cutscenes
- do not add equipment systems
- do not add crafting
- do not add meta progression trees
- do not add multiple arenas for MVP
- do not add horror detail
- do not add realistic insect anatomy
- do not add complex pathfinding
- do not add heavy physics
- do not add ECS or architecture rewrites
- do not keep old void naming anywhere user-facing
- do not turn the game into a cleanup idle sim

---

## 13. Final First Playable Definition

The first playable is **done** when:
- the game is fully playable from start to game over,
- the screen instantly reads as Bug Kitchen,
- the first kill is satisfying,
- Slipper Orbit is funny and memorable,
- the Cockroach Queen encounter works,
- records save,
- the build is mobile and desktop readable,
- no dark-fantasy residue remains.

If this slice is not fun, do not add more content.
Fix the slice first.
