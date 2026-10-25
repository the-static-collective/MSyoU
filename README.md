# MSyoU — Community Infrastructure Stack

**An independent, source-linked civic technology field lab by the Static Collective.**

> Communities already have people, places, skills, and intentions. The missing piece is often a clear, accountable handoff between them.

**MSyoU** is a playful name for a serious experiment: make locally organized projects easier to discover, participate in, and carry forward **without placing everyone under one new institution or account system**.

**Status: PUBLIC EXPERIMENT / LOCAL DEMO — 2026-10-24.** This is **not** an official Minnesota State University, Mankato website, project, endorsement, partnership, or university infrastructure deployment. No real Coalition, grocery, university or partner submissions have been ingested. No student information or university systems are accessed.

## Enter the field kit

Open [index.html](index.html) through a local web server to use the working, no-account field-card demonstration. It exercises a bounded local round trip:

```text
Someone brings a question, need, offer or possible build
    → DRAFT (memory only)
    → LOCAL_HOLD (explicit human decision)
    → HANDOFF_PREPARED (human choice)
    → JSON download (optional; NOT delivered)
    → a real steward must separately choose whether to receive it
```

The demo does **not** email, transmit, sign, publish, store on a backend, assign an organization, certify human identity, or record a real-world completion. It is intentionally possible to try with entirely fictional data.

```sh
# Node.js 20+; zero npm dependencies
npm test
npm run serve
# open http://localhost:8080
```

## Energy Commons × GHoT

[**Try the fictional spare-compute and energy-routing demonstration**](resources/index.html). It protects volunteered capacity with owner opt-in, capabilities, battery, thermal and declared Wh budgets. It proposes a candidate or HOLD; it never accesses devices or executes work. [GHoT integration design and field gates](docs/GHOT-ENERGY-COMMONS.md).

## Morse Cone 001 — the thin discovery channel

[**Try the fictional Morse/radio discovery experiment**](radio/). It generates a fixed checksum-checked Morse presence token, simulates reception, corruption, collision and no path, and protects the receiver's right to HOLD. The local lookup is explicitly untrusted and cannot enqueue or execute GHoT work. The [source-linked protocol](docs/MORSE-CONE-001.md) traces its National Treasure, TranchNOSE, radio-ear and Radio House roots.

## The working hypothesis

One small **community coordination membrane** may be reusable across several local efforts: community grocery organizing, Coalition convenings, stewardship work, event invitations, local mutual aid, and (only with an actual invitation) campus–community collaboration.

**We are proposing a pilot, not claiming MSU adoption.** Source experiments have different owners and different levels of proof. The kit **does not import them as a single production service**.

| Public question | Experimental instrument | Owns what |
| --- | --- | --- |
| Where do I begin? | [webZ / Abundent](https://github.com/the-static-collective/webZ) | Public porch / accessible doors |
| What is being offered or needed? | [CIRCULATION](https://github.com/the-static-collective/webZ/tree/feature/circulation-003-coalition-field-kit/circulation) + this field kit | Small explicit cards; no assumed public intake |
| Who may act on it? | [reLATTE](https://github.com/the-static-collective/reLATTE) | Proposed boundaries, custody and review evidence |
| Can people meet around it? | [TABLElogic](https://github.com/the-static-collective/tablelogic) + [GHoT](https://github.com/the-static-collective/GHoT) | Human-readable coordinated work and optional physical artifacts |
| What survives the meeting? | [GRAFT](https://github.com/the-static-collective/GRAFT) | Source-linked continuity and separate branch ownership |
| Can care become sustained participation? | [Full Measure](https://github.com/the-static-collective/full-measure-world-layer) + [GrO](https://github.com/the-static-collective/GrO) | Human-gated contribution/quest experiments, **not** reputation scores |
| Where might questions enter? | [JAR;VIS](https://github.com/the-static-collective/JAR-VIS) | Proposed attended question routing, never automatic authority |

## Documents

- [MSU-facing technology briefing](docs/MSU-TECH-UPDATE.md) — readable in under three minutes.
- [Source and branch atlas](docs/SOURCE-ATLAS.md) — exact projects, branches, evidence and limits.
- [Pilot contract](docs/FIELD-PILOT.md) — scope, consent, measures, stop conditions, public output.
- [Architecture and field-card protocol](docs/ARCHITECTURE.md) — the real runnable slice.
- [Morse Cone 001](docs/MORSE-CONE-001.md) — distinct signal, observation, interpretation, and authority, with a [fictional signal lab](radio/).
- [GHoT Energy Commons](docs/GHOT-ENERGY-COMMONS.md) — voluntary resource federation frontier and interactive simulation.
- [A possible follow-up message](docs/CONTACT-NOTE.md) — **draft only; not sent**.

**Architecture principle:** a proposal is not admission; receipt is not proof of physical completion; invitation is not enrollment; a university conversation is not a university partnership.

*Build something small enough to test with people; keep every person free to leave.*
