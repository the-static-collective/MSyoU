# TWO-BODY FIELD 003 — from Morse discovery to one approved GHoT job

Status: OPERATOR FIELD KIT PREPARED. No hardware has been touched, enrolled or authorized. This is independent Static Collective work, not a university project.

## What we are proving

Two independently controlled Linux computers can exchange one authenticated, bounded public-text work proposal over a private, permitted connection. The receiving computer must approve the job locally, perform one limited computation if its own conditions permit, and return a signed result which the requester verifies independently.

The existing native implementation already exists in GHoT's RADIO HOUSE 004. MSyoU is creating an accessible field instruction and verification surface, not substituting a new insecure worker daemon.

Pinned experimental GHoT commit: `91efe8441a567944dff27e1206d4967876485dbd`. Source: https://github.com/the-static-collective/GHoT/blob/experiment/radio-house-004-clicky-lan/docs/RADIO-HOUSE-004.md .

## Why Morse remains separate

The [Morse Cone 001](../radio/) currently simulates discovery on a clear/weak/collision/missing channel. A decoded six-character token is an UNTRUSTED LABEL; a checksum is not an authentication credential. It may inspire a future separately authorized physical discovery experiment, but does not produce a trustworthy public key, enroll a machine, issue a GHoT lease, or initiate an execution.

The two-body trial below uses **independently verified, pinned signing keys** and explicit worker approval. Morse is not in its actual transport path yet.

## Two actual owners and two distinct computers — operator checklist

1. Select two computers you own or are specifically authorized to administer. Do not use a university, church or Coalition computer just because you can access it. Prefer Linux, with Python >= 3.10 and OpenSSL available. Both owners consent separately.
2. On **both** machines, obtain the GHoT source and use the pinned commit (inspect its code before running; no automatic installation is performed by MSyoU):
   ```sh
   git clone https://github.com/the-static-collective/GHoT.git
   cd GHoT
   git fetch origin experiment/radio-house-004-clicky-lan
   git checkout --detach 91efe8441a567944dff27e1206d4967876485dbd
   python3 -m unittest discover -s tests -p 'test_radio_house_004.py' -v
   ```
   The unit test intentionally uses synthetic power and localhost components. Passing it is software evidence, **not** proof the two machines met physically.
3. Requester owner generates their native private identity and exports *only* the corresponding public key:
   ```sh
   python3 -m ghot.radio_house_004 requester-init --root ~/radio-house-requester
   python3 -m ghot.radio_house_004 identity --root ~/radio-house-requester --role requester > requester-public.json
   ```
   Keep private state private. Transfer `requester-public.json` through a human-vetted channel and verify its fingerprint independently.
4. Worker owner chooses whether to pin the requester and then generates their own private key, again sharing only the public key:
   ```sh
   python3 -m ghot.radio_house_004 worker-init --root ~/radio-house-worker --requester-pin /verified/path/requester-public.json
   python3 -m ghot.radio_house_004 identity --root ~/radio-house-worker --role worker > worker-public.json
   python3 -m ghot.radio_house_004 serve --root ~/radio-house-worker --admin-port 8787 --intake-port 8788
   ```
   The owner-only worker dashboard is on **127.0.0.1:8787** and must not be exposed or forwarded. Remote requests can reach **only** the narrow signed-intake port 8788, through a separately approved and restricted connection.
5. An authorized system administrator prepares an **authenticated restricted SSH tunnel**, after pinning the worker host key. The documented GHoT source shows the limited authorized_keys `permitopen` rule and the requester-local `ssh -L 127.0.0.1:8788:127.0.0.1:8788` tunnel. **MSyoU does not automate SSH, change accounts/firewalls, or expose listening ports.** Use different SSH tunnel and GHoT signature identities; verify both.
6. Requester explicitly sends a single harmless public ASCII test payload:
   ```sh
   python3 -m ghot.radio_house_004 send --root ~/radio-house-requester \
     --worker-pin /verified/path/worker-public.json \
     --job-id public-work-001 --text "A deliberately public test input"
   ```
   The worker receives **PENDING**, not an execution grant.
7. **Worker owner alone**, on their local dashboard at 127.0.0.1:8787, may click Enable, Confirm idle, Approve locally, then Step. Stop and leave work held if OBS or another recording process is running, sensors are missing, power/thermal/cpu checks refuse, or operator consent changes. The worker may withdraw consent without further justification.
8. Requester polls the saved crossing JSON from their own outbox. The native requester validates signed HELD/EXECUTED receipts and recomputes the SHA-256; the verified output is not a claim of donated electricity or institutionally verified work:
   ```sh
   python3 -m ghot.radio_house_004 poll --root ~/radio-house-requester \
     --worker-pin /verified/path/worker-public.json \
     --bundle ~/radio-house-requester/outbox/relatte-crossing-v0_<SHA256>.json
   ```

## Before beginning any hardware trial

Use exactly one harmless public ASCII string. No student files, third-party data, SSH administrative accounts used for the tunnel, radio frequencies, transmitters, energy billing integrations, broad network scanning, or unattended execution.

The receiving node owns every approval. No one should bypass missing Linux power sensors by supplying the synthetic CI power stub on a real machine.

Do not infer that two processes in a CI runner are two physical computers. Measure and report real device/owner/provenance and thermal behavior separately if and when the authorized trial happens.

## Success and falsification

Required observations:
- A signed proposal actually reaches one independently operated worker; signed packet alone stays PENDING.
- Approval by the receiving operator is necessary for execution.
- Revoking permission or entering recording mode causes HOLD at the next checkpoint.
- Correctly signed, bounded public hashing returns to the requester and is independently recomputed.
- A forged requester, wrong worker identity, stale/expired packet, duplicate packet, bad signature, and disallowed input refuse.

Separate statuses: SOURCE_CODE_AVAILABLE; CI_TWO_PROCESS_TEST_PASSED; PHYSICAL_TWO_MACHINE_TEST_PASSED; LIVE_RADIO_OBSERVED; INSTITUTIONAL_PARTICIPATION_APPROVED. **None is inferred from another.**

## The next carrier experiment

Only after this succeeds: investigate a **receive-only** explicitly consented device and bounded optical/signal observations. Treat a decoded Morse token as untrusted; any physical RF transmission requires separate compliance and authorization.

**A signal is not a grant. A university conversation is not campus permission. A machine may say HOLD.**
