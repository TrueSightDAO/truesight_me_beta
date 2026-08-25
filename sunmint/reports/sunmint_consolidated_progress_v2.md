# SunMint Program — Consolidated Progress Report (v2)

**Prepared by:** Sophia Truesight (autopilot) · **For:** Gary Teh & TrueSight DAO members · **Date:** 2026-08-26

> **Revision note:** v2 adds the SunMint Mobile App (Android/iOS) as the farmer-facing measurement layer — the model has evolved from web app to native mobile, with the phone becoming the tree-growth monitoring and carbon-credit issuance device.

---

## 1. The model has evolved — the mobile app is live

**SunMint Farmer App (Android + iOS)** — `TrueSightDAO/sunmint_mobile`, Capacitor 8, one shared codebase → native Android (direct signed APK) + native iOS (TestFlight). 21+ merged PRs, UAT'd on emulator 2026-08-23.

| Capability | Implementation |
|---|---|
| Tree planting reports | Live camera capture (JPEG q90, camera-only — no gallery), species selector (Cacao Criolla/Trinitario/Forestero + Other), GPS (8s timeout, non-blocking) |
| Offline-first | Native SQLite queue + Filesystem for photos; flushes on reconnect/foreground — works where rural farmers have no signal |
| Identity & signing | RSA-2048 keypair, RSASSA-PKCS1-v1_5/SHA-256, **byte-compatible** web ↔ native (proven in `scripts/rsa-compat-test/`); keys in Android Keystore / iOS Keychain |
| Ledger integration | Signed `[TREE PLANTING EVENT]` → Edgar → on-chain DAO ledger (identical payloads web & native) |
| Localization | PT default / EN toggle |

**The evolution:** `sunmint_beta` (web) → `sunmint_mobile` (native app) → **next: tree-growth monitoring in the app**. The phone is becoming the farmer's MRV device — measuring, attesting, and earning from carbon, all from a pocket device.

## 2. The certification route (the big decision)

SunMint's PDD commits to a **two-route certification strategy**:
- **Pilot route → Plan Vivo (PVCs)** — the standard used by ACORN and CommuniTree for cacao/coffee agroforestry. Participatory farmer monitoring, lower validation costs, ≥60% of credit revenue to communities.
- **Scale route → Verra VM0047 (ARR) + CCB** — the ICVCM-approved ARR methodology; the path for corporate offtake.

The earlier PDD reference to **VM0017 was corrected** (it's SALM, not ARR) — fixed in the whitepaper (PR #294).

## 3. The landmark precedent

**Andean Cacao (Colombia)** — first large-scale cacao agroforestry project validated & verified under Verra: VM0047 + CCB, developed with Terra Global Capital, **56,000+ VCUs first issuance**. SunMint is the same model.

## 4. Phone-based tree monitoring is proven (13 precedents)

| Program | What they do | Proof |
|---|---|---|
| **ACORN** (Rabobank) | Cocoa/coffee agroforestry, satellite + farmer apps, ~80% of credit value to producers | Plan Vivo-certified, operating |
| **TREEO** | Calibration-card DBH measurement via phone camera | 94–95% accuracy (R²≥0.95 vs tape); first dMRV tool under Global Tree C-Sink Standard |
| **Greenstand Treetracker** | Geotagged repeat photos of the same tree, ML-verified, paid per capture | 500k+ trees, open-source |
| **CommuniTree** (Taking Root) | Farmer-verified tree survival & growth | 28M trees, Plan Vivo since 2010 |

**Methodology synthesized:** calibration-card photo → DBH @ 1.3 m → species-specific allometric formulas → biomass → CO₂e, cross-checked by satellite. Works offline on cheap phones. **This is exactly what the SunMint mobile app now enables.**

## 5. The MRV technology stack

| Layer | Provider | Role |
|---|---|---|
| Farmer phone | **SunMint Mobile App** ✅ live | Per-tree DBH measurement, growth attestation, survival tracking (monitor module = next build) |
| Drone | PODream | Per-plot tree growth scanning, field calibration |
| Satellite | NOR Space | Landscape biomass, baseline, deforestation/fire monitoring, auto-PDD |
| Verification | VVB (to engage) | Validation + verification at credit issuance |

PODream ↔ NOR Space are **complementary, not competing** — VM0047 requires both remote-sensing baselines (NOR) and field calibration (PODream).

## 6. The decentralized model (this era's fit)

- **Farmer-as-node:** phone = sensor, self-sovereign keypair, on-chain attestation (DePIN + ReFi)
- **Value-to-community:** ACORN 80% to producers; Plan Vivo ≥60% requirement
- **This era's precedents:** Plan Vivo participatory monitoring, ACORN, Greenstand, Open Forest Protocol, bean-to-bar transparency movement
- **Mission tie-back:** 10,000 ha of Amazon cannot be centrally surveyed — **decentralization is the scaling mechanism**. Thousands of farmer-nodes with phones = the only path to scale.

## 7. Financing plan (staged, source-mapped)

| Stage | When | What it buys | Capital | Who pays |
|---|---|---|---|---|
| 0 — De-risk & submit | 0–3 mo | NOR feasibility, legal/tenure, Terra RFP | ~$10–15k | DAO injection + grants (regen.fund, Regenerative Ag Foundation, CocoaAction) |
| 1 — PDD & Validation | 3–12 mo | PDD, NOR baseline, VVB validation | ~$45–80k | DAO round 2 + Terra RFP + chocolate-industry co-funding |
| 2 — Pilot Planting | 12–36 mo | 20–50 ha + maintenance + MRV ops | ~$150–250k | Terra Climate Finance + offtake advances + CocoaAction + PRONAF |
| 3 — Scale to 10,000 ha | 3–7 yr | Phased expansion (Bahia + Amazon) | $3–10M+ | Forward VERR sales, Amazon Fund (BNDES), Banco da Amazônia, Fundo Flora, impact capital |

**Key principle:** stage-gated funding — each stage's output de-risks the next source. No Stage 2 capex until PDD validated + offtake signed.

## 8. The Terra RFP opportunity

- Terra Global Capital's RFP is open for exactly our project type (agroforestry tree planting, tropical, FCPF REDD+ country — Brazil qualifies)
- **Minimum project size: 3,000 ha** (phased design allowed) → frame at program scale, Bahia as Phase 1
- **Readiness gaps:** GIS boundary files, baseline land-use data, CAR tenure docs, community engagement records, budget, PDD outline, VVB shortlist, offtake pre-signals

## 9. What's been delivered (this thread)

| Item | Location |
|---|---|
| Whitepaper VM0047 + Andean Cacao update | PR #294 (merged) |
| Community-First MRV section | PR #308 (open) |
| NOR Space gap review PDF | sunmint_nor_space_podream_gap_review_v2.pdf |
| Phone-MRV research report | sunmint_phone_camera_tree_monitoring_research.pdf/.md |
| Terra RFP draft (3 versions) | sunmint_terra_rfp_draft_v1–v3.pdf |
| SunMint Mobile App (Android/iOS) | TrueSightDAO/sunmint_mobile (21+ PRs merged, UAT'd) |
| Consolidated progress report | this document (v2) |

## 10. Next steps (forward plan)

1. **Add the tree-growth monitoring module to the mobile app** — `monitor_tree_growth.html` (calibration-card photo + DBH + allometric CO₂e + signed on-chain event + growth history) — the phone becomes the carbon-MRV device
2. **Close RFP readiness gaps** — commission NOR Space feasibility/potential analysis (fills baseline + VM0047 evidence simultaneously)
3. **Fill RFP brackets + submit Terra Jotform**
4. **Shortlist VVBs** active in Brazilian ARR projects
5. **Review beta whitepaper → promote to prod** (sync_beta_to_prod)

---

*Prepared by Sophia Truesight, autopilot · TrueSight DAO · Mission: restore 10,000 hectares of Amazon rainforest*
