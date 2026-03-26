# Bug Kitchen — Merged GDD + Production Documentation v0.2

## 0. Purpose

This document is the **merged source of truth** for the Bug Kitchen pivot.
It consolidates:
- the earlier internal product call,
- the uploaded external AI reviews,
- the current Phaser project reality,
- current Yandex platform constraints that matter to this scope.

This is **not** a giant dream design document.
It is a **small-project production lock** for a solo / AI-assisted build.

---

## 1. Executive Decision

**Final direction:** pivot the existing `Void Survivors` Phaser skeleton into **Bug Kitchen**.

**Why this wins:**
- the old void/dark/neon fantasy is generic, abstract, and commercially weak;
- Bug Kitchen is readable from one screenshot;
- it creates an instant conflict: **kitchen + pests + slapstick extermination**;
- it preserves the current survivor architecture with minimal structural change;
- it supports a low-cost 2D production path.

**Primary product thesis:**
Bug Kitchen succeeds only if it feels like **cartoon pest-control arcade violence**, not like a generic shooter with renamed labels.

**Critical merged conclusion from the external AI reviews:**
The project lives or dies on four things:
1. **first 5-second readability**
2. **Slipper Orbit as a front-facing hook**
3. **high splat factor**
4. **scope discipline**

If those four are weak, the pivot fails.

---

## 2. Merged Synthesis from External AI Reviews

### 2.1 What the other AI analyses improved
The uploaded reviews materially sharpened the plan in these areas:
- `Cleanup Crew` is a valid backup concept, but too soft for a survivor launch;
- the first 3–5 seconds matter more than general “theme strength”;
- the game needs an enemy the player instantly wants to destroy;
- **splat feedback is not optional polish** — it is core fantasy delivery;
- **Slipper Orbit** is the best marketing and early-game weapon hook;
- realism is poison here: readability and cartoon exaggeration must dominate;
- the MVP must be brutally constrained: one arena, limited roster, no meta bloat.

### 2.2 Product call after merged review
**Bug Kitchen remains locked.**
Do not re-open concept selection unless the first playable fails its validation criteria.

### 2.3 Backup hierarchy
If Bug Kitchen fails:
1. `Mosquito Season` is the closest cheap backup.
2. `Cleanup Crew` is the safer but lower-energy fallback.
These are not current production targets.

---

## 3. Product Positioning

### 3.1 One-line pitch
**A bright, chaotic kitchen survivor where you crush cartoon pests with slippers, spray, steam, and household anti-bug chaos.**

### 3.2 Store-facing promise
- readable from one screenshot;
- funny and slightly gross, not scary;
- short, intense arcade runs;
- strong “one more run” loop;
- satisfying splat / squash feedback.

### 3.3 Emotional target
The player should feel:
- “Ugh, bugs.”
- “Good, I can smash them.”
- “That splat felt great.”
- “One more run.”

The player should **not** feel:
- horror,
- revulsion,
- realistic infestation dread,
- slow passive cleanup,
- confusion about what the game is.

### 3.4 Platform fit
The game is aimed at Yandex Games:
- browser-first,
- mobile + desktop readable,
- fast onboarding,
- strong screenshot appeal,
- small production scope,
- short session viability.

---

## 4. Non-Negotiable Pillars

### 4.1 Household combat, not magic
All player power must feel household, tactile, and physical:
- slippers,
- aerosol spray,
- bug zapper,
- hot steam,
- poison/fumigation bomb.

No magical naming.
No sci-fi residue.
No dark-fantasy leftovers.

### 4.2 Cartoon disgust, not horror
The game tone must be:
- bright,
- punchy,
- exaggerated,
- slightly gross,
- visually clean.

Bugs are pests, not horror creatures.

### 4.3 Readability over realism
Everything must read on a phone screen.
Bugs should be **larger and simpler** than realism would suggest.
Silhouette separation is more important than biological accuracy.

### 4.4 Splat factor is mandatory
The first kill must feel good.
Death must not look like silent disappearance.
Flattening, splashing, popping, flashing, and visible reward output are part of the fantasy.

### 4.5 Small scope is a feature
The current Phaser skeleton is an advantage.
Do not destroy that advantage with “smart” architecture.

---

## 5. First 5 Seconds Lock

### 5.1 What the player must see immediately
Within the first second:
- warm cream or beige kitchen floor;
- player avatar in slippers / anti-bug role;
- several brown cockroaches moving toward the player;
- at least one visible weapon identity.

### 5.2 What the player must understand without text
Without reading anything, the player should understand:
- “This is a kitchen.”
- “Those are bugs.”
- “I kill them.”
- “This is fast arcade action.”

### 5.3 Mandatory on-screen sequence
**0.0–1.0s**
- player visible in center;
- 3–8 cockroaches visible;
- warm kitchen tone established.

**1.0–3.0s**
- first auto-attack fires;
- first hit flash happens;
- player movement feels snappy.

**3.0–5.0s**
- first bug dies with visible splat;
- flattened stain or splat particle appears;
- XP crumb appears and magnetizes toward the player;
- player immediately feels reward.

### 5.4 What must not happen
- leftover dark void visuals,
- tutorial walls,
- tiny bugs,
- empty screen,
- magical-looking projectiles,
- silent enemy deletion.

---

## 6. First Session Arc Lock

### 6.1 First 30 seconds
- immediate first kills;
- first crumbs collected;
- first quick level-up;
- first meaningful choice between early fantasy anchors:
  - **Spray Can**
  - **Slipper Orbit**
- enemy count remains readable and manageable.

### 6.2 First minute
- introduce second enemy type (`Fly`);
- teach movement and anti-encirclement pressure;
- deliver first mini-spike with one denser roach wave;
- show that weapon choice changes feel, not just numbers.

### 6.3 First boss
Target early memorable punctuation:
- **Cockroach Queen**
- appears around minute 2–3
- slower, large silhouette
- spawns smaller roaches
- dies with a large splat and crumb burst

### 6.4 First loss / retry trigger
Ideal first death window:
- around minute 3–6 for a weak or average run

Game Over must show:
- time survived,
- waves cleared,
- best score/time,
- immediate retry CTA,
- one visible short-term target:
  - survive 5:00,
  - kill 200 bugs,
  - unlock Bug Zapper,
  - beat the Queen.

### 6.5 First 3 sessions retention goals
Session 1:
- discover premise,
- enjoy first splats,
- die,
- retry.

Session 2:
- unlock another starting option or passive,
- understand that builds can differ.

Session 3:
- get first identity hook:
  - new starting weapon,
  - small cosmetic,
  - title badge,
  - personal best chase.

No giant progression tree.

---

## 7. Core Loop

1. Move in the kitchen arena.
2. Avoid encirclement.
3. Auto-attack pests.
4. Collect crumbs / scraps as XP.
5. Choose upgrades.
6. Increase clear speed and survivability.
7. Survive wave escalation.
8. Beat bosses.
9. Chase better runs and light unlocks.

This is **not** a cleaning simulator.
This is a **cartoon anti-bug action survivor**.

---

## 8. MVP Scope Lock

### 8.1 Mandatory MVP shape
- **1 arena**
- **5 base enemy types max**
- **2 bosses minimum**, 3 ideal
- **5 weapons max**
- **5 passives max**
- **1 main run mode**
- **record saving**
- **mobile readable**
- **desktop readable**

### 8.2 Explicitly not in MVP
- multiple arenas or biomes,
- deep meta progression,
- skill trees,
- equipment systems,
- narrative campaign,
- crafting,
- social systems beyond leaderboard if already easy,
- realistic insect detail,
- hand-drawn animation dependency,
- heavy particle tech,
- architectural rewrite.

---

## 9. Arena & Visual Tone

### 9.1 MVP arena
Single warm kitchen arena:
- cream / beige tile floor,
- subtle countertop/fridge/sink references near edges,
- readable background,
- not cluttered.

### 9.2 Visual hierarchy
Top priority:
1. player
2. living enemies
3. incoming threats
4. pickups
5. stains / dead-bug traces
6. floor dressing

### 9.3 Tone rules
Allowed:
- exaggerated shapes,
- warm palette,
- chunky silhouettes,
- playful squash,
- bright projectiles.

Banned:
- realistic bug legs and anatomical detail,
- gore,
- slimy horror closeups,
- neon grid remnants,
- magical aura leftovers.

---

## 10. Player Lock

### 10.1 Player fantasy
Preferred read:
- frantic resident,
- cook,
- kitchen defender,
- slipper-wearing exterminator.

### 10.2 MVP player silhouette
Use a simple chibi human with:
- visible slippers,
- readable torso color,
- clean outline,
- no fine detail required.

### 10.3 Player fantasy priority
The player is not the joke.
The **tools** and the **enemy destruction** are the joke.
Keep player readable and simple.

---

## 11. Enemy Ladder Lock

### 11.1 Base enemies

#### Cockroach
- role: baseline swarm filler
- pressure: numbers and constant approach
- read: brown oval, clear antennae suggestion, ground-based
- note: must be very readable instantly

#### Fly
- role: harasser
- pressure: erratic movement, forces directional adjustment
- read: rounder body, wing suggestion, slightly different motion profile

#### Moth
- role: fragile clutter / burst-XP target
- pressure: visual chaos and fast swarm moments
- read: pale wings, light flitter motion, dies fast

#### Beetle
- role: tank / path blocker
- pressure: durability, projectile soaking, lane denial
- read: larger shell, darker chunky silhouette

#### Hornet
- role: striker / priority threat
- pressure: dash or charge behavior, punishes standing still
- read: yellow-black contrast, pointed silhouette

### 11.2 Elite variants
Keep elite implementation cheap:
- **Armored Roach** — more HP
- **Explosive Fly** — death burst / puddle
- **Golden Moth** — loot target / high crumb reward

### 11.3 Bosses
#### Cockroach Queen
- early boss
- large body
- spawns adds
- slow movement
- very strong splat death

#### Giant Mutant Fly
- mid boss
- sudden dashes
- toxic goo or spread-shot hazard

#### Fridge Monster
- late boss
- comic “kitchen disaster” silhouette
- heavy presence
- push / slow / area pressure

Bosses should remain readable and simple.
No multi-phase cinematic complexity in MVP.

---

## 12. Weapon Lock

### 12.1 Core weapon roster

#### Spray Can
- basic projectile / cone / burst fantasy
- must look like aerosol, not magic
- readable hiss / mist behavior

#### Slipper Orbit
- the front-facing marketing hook
- should be available early
- should feel tactile and funny
- should be heavily featured in screenshots and early builds

#### Bug Zapper
- chain hit fantasy
- strong juice potential
- good clustered-enemy clearer

#### Hot Steam Aura
- close-range zone of safety
- good for body-checking dense waves

#### Poison Bomb
- delayed area burst
- heavy punctuation tool

### 12.2 Passives
Recommended small passive pool:
- **Kitchen Hustle** — move speed
- **Crumb Magnet** — pickup radius
- **Thick Skin** — max HP
- **Apron Armor** — flat survivability
- **Pest Instinct** — luck / crit / bonus proc

### 12.3 Cuts / weak fantasies
Avoid or cut:
- passive health regen as a major upgrade,
- slow sniper-style single-target weapons,
- hard-to-read poison-only builds,
- overly abstract damage buffs with boring names.

### 12.4 Main MVP anchor
**Slipper Orbit** is the weapon pillar.
It is not “one of many equal tools.”
It is the easiest to market, easiest to understand, and easiest to remember.

---

## 13. Juice Philosophy

### 13.1 The hierarchy of cheap impact
Priority order:
1. **Splat**
2. **Hit flash**
3. **Pickup pop + magnetism**
4. **Micro screen shake**
5. **Distinct hit/death sounds**
6. **Level-up reward feel**

### 13.2 Splat rules
On kill:
- flash,
- squash,
- particle burst,
- short stain/decal on floor,
- crumb output.

This is the #1 feel-delivery system.

### 13.3 Hit feedback
- short white hit flash
- tiny knockback or recoil if readable
- distinct boss hit feedback

### 13.4 Pickup feedback
Crumbs should:
- pop out visibly,
- be readable against the floor,
- accelerate toward player,
- snap attractively at the end.

### 13.5 UI reward moments
Level-up cards should feel rewarding:
- bounce / glow / quick arrival animation
- not flat placeholder UI

---

## 14. Retention Package (Low-Cost Only)

### 14.1 Core retention drivers
Use only low-cost retention:
- best time,
- best bugs squashed,
- early weapon unlocks,
- start-weapon choice after simple milestone,
- small badge/title/cosmetic,
- visible short-term goals.

### 14.2 Good examples
- “Survive 3:00 to unlock Bug Zapper”
- “Squash 200 bugs total”
- “Beat the Queen”
- “Start next run with Slipper Orbit”
- “New Best: 5:12”

### 14.3 Avoid
- huge meta tree,
- currencies and shops,
- long quest systems,
- heavy daily infrastructure,
- secondary game modes in MVP.

---

## 15. Yandex Compliance Notes (Build-Relevant Only)

### 15.1 Rewarded video handling
Rewarded ads must be optional bonus moments.
Do not build the product around rewarded revive as the only meaningful continuation fantasy.

### 15.2 Fullscreen ad handling
When fullscreen ads appear, gameplay and sound must pause/mute correctly.

### 15.3 Progress / record saving
Because the game is score-oriented and effectively endless-run style, record saving must exist.

### 15.4 Promo reality
Promotional screenshots must represent the real game clearly.
Do not fake a different visual tone for the store page than the playable build.

### 15.5 Language
Keep copy simple and localization-ready.
Russian should be straightforward to add if not first.

---

## 16. Milestone Plan

### Milestone 1 — Data + Naming Pivot
Files:
- `constants.js`
- `enemies.js`
- `weapons.js`

Goal:
- remove all void language
- install Bug Kitchen terminology
- swap warm palette
- preserve gameplay systems

Success:
- gameplay works unchanged
- user-facing names are fully pivoted
- warm palette reads correctly

### Milestone 2 — Procedural Visual Rewrite
File focus:
- `BootScene.js`

Goal:
- replace void visuals with basic kitchen + bug silhouettes
- make first screenshot read as Bug Kitchen
- install clear player / enemy / pickup identity

Success:
- screen instantly reads as kitchen bug action
- enemy silhouettes are clearly separable
- player identity is readable

### Milestone 3 — UI / Copy / Juice
File focus:
- `MenuScene.js`
- `UpgradeScene.js`
- `GameOverScene.js`
- `GameScene.js`

Goal:
- kill remaining void tone
- implement first high-value juice systems
- make first kills and pickups satisfying

Success:
- first kill feels good
- level-up feels rewarding
- game over invites retry

### Milestone 4 — Yandex Compliance + Launch Prep
File focus:
- `YandexSDK.js`
- score/save hooks
- ad pause/mute flow
- mobile check

Goal:
- stabilize platform-risk items
- make build launch-ready
- capture first screenshot / promo assets from real gameplay

Success:
- records save
- ads behave correctly
- mobile + desktop are playable
- build is submission-safe

---

## 17. First Playable Slice (Definition of Done)

The first playable must validate **feel**, not content quantity.

### 17.1 Must include
- 1 warm kitchen arena
- playable start-to-death run
- player movement
- cockroach / fly / beetle minimum, all 5 ideal
- Spray Can + Slipper Orbit minimum, 5 weapons ideal
- level-up with 3 choices
- Cockroach Queen boss
- splat feedback
- pickup feedback
- menu + game over in Bug Kitchen tone
- score/record saving
- mobile playable
- desktop playable

### 17.2 Success criteria
A new player can say within 5 seconds:
> “I am killing bugs in a kitchen.”

The first 3 kills feel satisfying.
The player wants to retry after losing.
The Queen is memorable.
Nothing still feels like dark fantasy residue.

### 17.3 Validation logic
If this slice is not fun, more content will not save the game.
This slice validates the actual emotional transaction:
**cartoon disgust → splat satisfaction → survival tension → retry desire**

---

## 18. Yandex-First Packaging Lock

### 18.1 Title shortlist
Recommended shortlist:
1. **Bug Kitchen**
2. **Kitchen Panic**
3. **Slipper Hero**
4. **Bug Bash**
5. **Kitchen Exterminator**

Current preferred title:
**Bug Kitchen**

### 18.2 First screenshot composition
- top-down warm kitchen tiles
- player in center
- visible slipper or spray
- dense but readable roach ring
- visible splat decals
- crumbs on floor
- minimal UI

### 18.3 One-sentence promo line
**Grab your slippers and survive a cartoon kitchen infestation using spray, steam, zappers, and pure anti-bug panic.**

### 18.4 Packaging mistakes to avoid
- dark screenshot
- no visible weapon
- realistic cockroaches
- empty clean room with no threat
- leftover fantasy UI language

---

## 19. Deferred Art Documentation Plan

Art-heavy documentation should **not** be front-loaded into Antigravity if gameplay proof is still missing.

### 19.1 Defer until after first playable validation
- polished sprite sheets
- final icon pack
- cover art
- promo composition bible
- final SFX pack
- full localization kit
- advanced boss art sheets
- alternate kitchen skins

### 19.2 When to create art docs
Create the separate art doc only after:
- first screenshot reads correctly,
- first playable is fun,
- Slipper Orbit feels good,
- splat feedback is validated.

### 19.3 Future art doc structure
When created later, the art doc should include:
- palette lock
- silhouette sheet
- bug scale guide
- stain / splat library
- player sheet
- UI sheet
- promo shot guide
- icon guide
- safe grossness rules
- anti-realism rules

---

## 20. Absolute Do-Not-Add List

Do not add:
- horror art direction,
- realistic insect anatomy,
- magic or sci-fi weapon residue,
- crafting,
- inventories,
- equipment grids,
- multiple arenas for MVP,
- deep meta progression,
- cutscenes,
- complex AI,
- physics-heavy interactions,
- architecture rewrites,
- “smart” system bloat from coding agents.

---

## 21. Final Lock

**Bug Kitchen approved.**
**Merged external feedback incorporated.**
**MVP scope locked.**
**Slipper Orbit elevated to front-facing pillar.**
**Splat factor elevated to core product requirement.**
**First playable redefined around feel validation, not feature accumulation.**

If built this way, Bug Kitchen has a better chance than generic survivors because it sells itself instantly:
- kitchen,
- bugs,
- slipper,
- splat,
- retry.

That is faster, cheaper, and more memorable than any dark-neon survivor pitch.
