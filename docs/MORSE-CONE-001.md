# MORSE-CONE-001 — Offline discovery is not distributed authority

**Date:** 2026-10-24 · **Owner:** MSyoU demonstration layer
**State:** locally runnable browser simulation with pure testable protocol.
**Not:** RF hardware, navigation equipment, remote resource discovery, executed GHoT job, MSU project, legal TX experiment or physical propagation proof.

## Why this specimen exists

A computer cannot rely on continuously connected broadband to *learn that there may be a resource somewhere*. But a weak/slow channel might carry a compact **discovery token** while a more capable authenticated channel later handles workload inputs, admission, scheduling and evidence.

The foundational separation:

```text
A (fictional) machine declares a tiny presence token
    ↓
finite Morse-like rhythmic frame / simulated path
    ↓
another machine records detection / non-detection / damage
    ↓
error-detected token is held as UNTRUSTED
    ↓
optional receiver-local fictional catalog match
    ↓
HOLD until the real resource owner, identity, data rights,
native GHoT scheduler and execution permissions are separately established
```

**No signal can authorize code execution.** The word `cone` is an optional visual toy inspired by historical complementary A/N beacon navigation and an overhead cone-of-silence condition. Neither the beam weights nor the overhead gap in this UI are a propagation equation, direction finder, distance estimator or geographic measurement.

## Executable contract

- `src/morse-cone.mjs` implements fixed text frame `MC1 NODE01 A13F ####`: a version, a **fictional** six-character advertised label, a four-character nonce, and CRC-16/CCITT-FALSE error detection.
- Frame text is encoded into standard human Morse dot/dash marks, with 1-unit dots, 3-unit dashes, 1-unit intracharacter gaps, 3-unit interletter gaps and 7-unit word gaps. A `0` is gap, `1` is keyed mark.
- The `observeBeacon()` channel choices are `clear`, `weak` (deterministically damages a keyed mark), `collision` (undecodable ambiguity) or `unreachable` (no receiver observation). They are **fixtures**, not RF sampling or a channel model.
- Frame decoding checks syntax and checksum, **not signatures or actual radio origin**. CRC can be forged; nonce is an illustrative field, not anti-replay protection.
- Return states include `DECODED_UNTRUSTED`, `REJECTED`, `AMBIGUOUS_COLLISION`, `NOT_OBSERVED`. Every disposition is `HOLD`, with `identityVerified=false`, `resourceGranted=false`, `execution=NONE`.
- `lookupLocalCandidate()` is a pure optional lookup against an explicitly passed **local fictional catalog**, not IP scanning, beacon enrollment, machine validation or GHoT dispatch.
- `modelCone()` produces deliberately arbitrary, labeled **illustrative weights** for an A/N-style observation plane. It cannot be used for navigation.

No generated source imports WebSockets, microphone permissions, geolocation, sockets, radios, a shell executor, browser persistent storage, or device-discovery APIs.

Run:

```sh
npm test
npm run serve
# open http://127.0.0.1:8080/radio/
```

The radio lab can also be served as static files; the production deploy is a source-hosted **simulation**, not a sender.

## Source ownership and why this is not the final solution

| System | Existing experiment | What remains separate |
| --- | --- | --- |
| [GHoT radio ear 002](https://github.com/the-static-collective/GHoT/blob/experiment/radio-ear-002/docs/RADIO-EAR-002.md) | Opt-in bounded RTL-SDR *receive-only* raw I/Q capture; fake device in CI | Actual physical receiver evidence; decoding an identified authorized beacon |
| [GHoT radio attention 003](https://github.com/the-static-collective/GHoT/blob/experiment/radio-attention-003/docs/RADIO-ATTENTION-003.md) | Two-index survey/focus proposals with explicit operator gates | Calibrated physical dual-receiver survey; original device identity |
| [GHoT radio house 004](https://github.com/the-static-collective/GHoT/blob/experiment/radio-house-004-clicky-lan/docs/RADIO-HOUSE-004.md) | Real native signed proposal/worker design, bounded hash computation and local click approval in two-process CI | Physical two-machine trial, hardened host deployment, broader data/task classes |
| [GHoT Power Field](https://github.com/the-static-collective/GHoT/blob/main/docs/POWER-FIELD.md) | Thermal/battery willingness and explicit withdrawal | Proof that declared surplus is measured and available on real owners' devices |
| [TranchNOSE celestial delay](https://github.com/the-static-collective/tranchNOSE/blob/main/RESEARCH_NOTE_CELESTIAL_DELAY_WITNESS.md) | Symbol clock versus propagation-return clock, Morse as readable witness layer | No path dependence, ranging or relational memory is proven here |
| [National Treasure propagation](https://github.com/the-static-collective/national-treasure/blob/research/radio-propagation-thread/threads/radio-propagation.md) | Distinct emission, path, coupling, detection, decoding and attribution | No fictional graph has physical reception authority |
| [planZ physical internet](https://github.com/the-static-collective/planZ/blob/proposal/master-servant-field-score-001/plans/2026-10-11-master-servant-physical-internet-001.md) | Proposed carrier-neutral reference / receipt protocol | No universal transport or live accepted schema |
| [MSyoU Energy Commons](../resources/) | Consent/thermal/battery-aware scheduling rehearsal | No actual GHoT node enrollment or execution |

## Real field proof ladder

**0. Present / now:** one browser, two fictional roles, structured decoding and failure states. Falsify bad claims and reject untrusted identifiers.

**1. Two-process loopback:** two independently configured local programs pass only a signed/authenticated, size-limited discovery advertisement; receiving program records observation with no action. Build *this separately*, with a defined trust source and replay policy. Do not treat CRC as an authentication scheme.

**2. Small own-device lab:** two consenting computers on a private LAN; GHoT signed-work/inbox and Power Field perform a bounded public-text hash under **separate owner approval**. Preserve any refusal or missing temperature observation. Does not involve radio.

**3. Receive-only SDR observation:** one operator-owned, compatible receiver, only publicly lawful reception; independently verify the actual attached device and IQ output before any claim about on-air identity. Define frequencies and local law before use. This path has **no transmitter**.

**4. Actual cross-carrier beacon:** only with legal authorization, compliant certified radio or controlled optical hardware, proper RF/eye safety, verified clocks and a validated MAC/signature over the bounded metadata. Compare RF/optical/LAN arrival outcomes without inferring equal provenance or permission.

**5. Research pilot:** with institutional review only if separately invited. Evaluate whether discovery over an intermittent medium helps any actual community task, with complete cost, security and reliability accounting.

### Strongest counterexamples to test

- Valid Morse frame with a fabricated source ID: error check passes, **trust remains none**.
- Exact replay of a previous transmission: nonce is not proof of fresh origin.
- A and N overlap: energy might be present without a decodable single sender.
- No observation under a synthetic blind region: source may exist elsewhere.
- Forged device advertisements: resource planner must reject without a fresh local, independently authorized owner offer.
- Disappeared worker: recomposition can propose a new plan, but cannot invent an executed receipt.

**Core invariant:** SIGNAL ≠ IDENTITY ≠ AUTHORITY; a closed or absent channel is not proof an endpoint ceased to exist.
