# MNADA — National Livestock & Commodity Exchange

**Funding memorandum · Tanzania · August 2026**
Companion document to `mnada-pitch.html` (the interactive showcase).

> **Country assumption.** Built for **Tanzania**, inferred from TZS expense logging and NBAA/ACPA study in this vault. If the intended market is Kalemie / DRC, the architecture transfers but every number, law and market name below must be re-sourced.

---

## 1. The one-sentence pitch

Tanzania has 39.2 million cattle worth TZS 33.22 trillion, and not one of them can be used as loan collateral. MNADA builds the identity, grading, custody and settlement layer that turns a live animal into a **Livestock Deposit Receipt** — a bankable, transferable document of title — and takes a fee on every trade that crosses it.

## 2. Why this is not "an app for farmers"

Every failed agri-marketplace in East Africa made the same mistake: it built a listings board and assumed liquidity would follow. It doesn't, because an unlisted cow is not a tradeable object. Four things have to be true before a buyer 900 km away will bid:

| Requirement | What it means | Our answer |
|---|---|---|
| **Identity** | The animal is uniquely and permanently identified | Ear tag registered against keeper's National ID and origin ward — under the **Livestock Identification, Registration and Traceability Act, 2010**, which already mandates a registry nobody has funded |
| **Fungibility** | Two buyers agree what "this animal" is | Published grading standard: weigh-band, dentition age, sex, breed group, body condition score → a lot code like `TZ-C-M2-300-350-BCS3` |
| **Custody** | Someone reputable is holding it, and it won't die | Licensed holding grounds / partner feedlots under custody agreement, mandatory mortality cover |
| **Title** | A document that transfers ownership and can be pledged | The **Livestock Deposit Receipt (LDR)** — architecturally identical to a warehouse receipt, which Tanzania already has legal machinery for |

The Warehouse Receipt System proved the model here for crops: **TZS 2.68 trillion cleared through TMX auctions in 2025/26** on 1.12 billion kg. We are porting that machine onto animals.

## 3. Market

| Figure | Value | Source |
|---|---|---|
| Cattle | 39.2m (+3.4% YoY) | Ministry of Livestock & Fisheries, 2024/25 |
| Goats / sheep | 28.6m / 9.65m | Ministry of Livestock & Fisheries, 2024/25 |
| National herd value | TZS 33.22tn (from 30.49tn) | Ministry of Livestock & Fisheries |
| Indigenous cattle offtake | 10–13% (dairy systems reach 22%) | Tanzania Livestock Master Plan |
| Primary livestock markets | 400+ | Ministry of Livestock & Fisheries |
| Abattoirs | 6 operating at ~50% capacity, 7 under construction | Livestock Sector Analysis |
| Mobile money accounts | 80.98m (Mar 2026) | TCRA |
| Internet penetration | 84.2%; smartphones 42.5% | TCRA |

**Serviceable market (live animals):** ~4.3m cattle traded/yr × TZS 700k + ~11.5m shoats × TZS 120k ≈ **TZS 4.4 trillion/yr**. Crop side adds a further ~TZS 1.5tn of addressable spot and aggregation volume alongside (not against) TMX.

## 4. Revenue model — four lines

1. **Trade commission** — 1.50% on livestock (0.75% buyer / 0.75% seller), 0.90% on crops
2. **Haulage matching** — ~0.24% of livestock GMV
3. **Credit & custody fees** — 1.2% on LDR-secured loan volume originated
4. **Data, insurance attach, verification** — flat per node, ~TZS 1.8m/node/month

## 5. Unit economics — one market node at maturity

| Line | Monthly (TZS) | Annual (TZS) |
|---|---:|---:|
| Cattle 900 head @ 700,000 | 630,000,000 | 7,560,000,000 |
| Shoats 1,800 head @ 120,000 | 216,000,000 | 2,592,000,000 |
| **Node GMV** | **846,000,000** | **10,152,000,000** |
| Trade commission @ 1.50% | 12,690,000 | 152,280,000 |
| Haulage matching @ 0.24% | 2,030,400 | 24,364,800 |
| Data / insurance / verification | 1,800,000 | 21,600,000 |
| **Node revenue** | **16,520,400** | **198,244,800** |
| 2 market agents, loaded | (2,300,000) | (27,600,000) |
| Equipment amortised | (1,916,667) | (23,000,000) |
| Settlement cost @ 0.30% | (2,538,000) | (30,456,000) |
| Central cost share | (1,200,000) | (14,400,000) |
| **Node contribution** | **8,565,733** | **102,788,800** |

Node capex TZS 23m; payback month 14–16.

*Sanity check:* Pugu alone moves 600–1,000 cattle and 400–500 goats **per session**. Modelling 900 cattle/month per node is partial capture of one large market, not displacement.

## 6. Five-year projection (base case, TZS billion)

| | Yr 1 | Yr 2 | Yr 3 | Yr 4 | Yr 5 |
|---|---:|---:|---:|---:|---:|
| Active nodes | 14 | 40 | 95 | 180 | 280 |
| Livestock GMV | 42.6 | 182.7 | 530.4 | 1,133.0 | 1,932.9 |
| Crop GMV | 17.9 | 95.0 | 291.7 | 634.5 | 1,159.8 |
| **Total GMV** | **60.5** | **277.8** | **822.2** | **1,767.4** | **3,092.7** |
| Trade commission | 0.80 | 3.60 | 10.58 | 22.70 | 39.43 |
| Haulage matching | 0.10 | 0.44 | 1.27 | 2.72 | 4.64 |
| Credit & custody fees | 0.03 | 0.33 | 1.78 | 5.09 | 11.13 |
| Data / insurance / verification | 0.09 | 0.39 | 1.13 | 2.41 | 4.11 |
| **Total revenue** | **1.02** | **4.76** | **14.76** | **32.92** | **59.32** |
| Total operating cost | 2.76 | 6.45 | 13.81 | 24.72 | 37.74 |
| **EBITDA** | **(1.74)** | **(1.70)** | **0.95** | **8.20** | **21.58** |
| Cumulative cash | (1.74) | (3.44) | (2.49) | 5.71 | 27.30 |

- **EBITDA breakeven:** Year 3
- **Peak cumulative deficit:** ~TZS 3.44bn (Year 2)
- Yr 5 revenue ≈ **USD 22.4m** at 2,650 TZS/USD

The HTML showcase exposes six of these assumptions as sliders so the credit committee can re-run it against its own view.

## 7. What the bank gets that is not equity upside

This is the actual pitch. **You are buying an origination channel, not a share of a commission.**

At Year 5 base case:

| | Value |
|---|---:|
| Annual LDR-secured loan originations | TZS 928bn |
| Average outstanding book @ 45-day tenor | TZS 114.4bn |
| Indicative annual net interest income @ 10% net margin | TZS 11.44bn |
| Average escrow deposits held at the settlement bank | TZS 16.9bn |

So: **TZS 5.5bn in, and by Year 5 the loan book alone throws off roughly TZS 11.4bn/yr of net interest income plus ~TZS 17bn of low-cost float** — from an asset class that currently sits entirely outside the credit system.

Three structural reasons the credit performs:

- **Repayment sits inside the rail.** The loan is repaid at settlement, before seller proceeds release. No chasing a herd across a district.
- **Valuation stops being a guess.** Every settled trade feeds a published price index by grade and node — a defensible mark within 12 months.
- **Uncorrelated.** Livestock credit tracks rainfall and disease, not the urban salary and trade cycles that dominate a Tanzanian bank's existing book.

**Terms sought by the bank:** settlement-bank exclusivity for 60 months, right of first refusal on all LDR-secured lending originated on the platform.

## 8. Risks, honestly

| Risk | Severity | Structural mitigation |
|---|---|---|
| No licence category exists for a live-animal exchange | High | Launch as licensed market operator/agent under existing LGA arrangements; route commodity trades **through** TMX under its CMSA licence. Exchange licence is a Phase 3 application with 24 months of record behind it. |
| Broker capture at market level | High | Recruit the top brokers at each node as licensed MNADA agents on commission share. Co-opt the middleman; don't try to delete him. |
| Disease outbreak closes a corridor | High | Four independent corridors by Yr 2. Traceability lets authorities quarantine at ward not region level — which is itself the argument for Ministry support. |
| Mortality / shrinkage in custody | Medium | Licensed holding grounds only, mandatory cover, LDRs issued at 80% of assessed value, insurer carries first loss, weekly tag-read reconciliation. |
| State platform (e-Kilimo / Kilimo BaNDO) extends to livestock | Medium | Build for integration. Our identity layer *is* the Ministry's statutory registry; contract to operate it. This is our best distribution partner or our hardest competitor, decided in the first 12 months. |
| Take-rate compression | Medium | At 0.90% commission the model still breaks even in Yr 4 — but peak deficit rises to ~TZS 7.0bn, above this facility. Sustained sub-1% pricing means a second tranche. Stated up front. |

## 9. The ask — TZS 5.5bn over 36 months

| Use | Amount |
|---|---:|
| Platform, USSD stack, registry integration | TZS 1.85bn |
| Field operations — 40 nodes to Year 2 | TZS 1.40bn |
| Equipment — crushes, weigh bars, readers, tag stock | TZS 1.00bn |
| Licensing, legal, compliance, audit | TZS 0.25bn |
| Settlement guarantee fund (ring-fenced, never leaves the bank) | TZS 1.00bn |
| **Total** | **TZS 5.50bn** |

Sized at ~1.6× peak deficit so a twelve-month delay in node maturity does not force a second raise.

### Milestones

| When | Milestone |
|---|---|
| M0–M3 | **Registry MoU** with Ministry of Livestock & Fisheries to operate the statutory traceability registry. **Gating condition — no MoU, no drawdown.** |
| M3–M6 | 4 nodes live on the Shinyanga–Dodoma–Dar corridor. Grading standard published. First 5,000 animals tagged. |
| M6–M9 | **First LDR issued and financed** — single lender, 200 head, 45-day feedlot facility. The proof the whole memorandum turns on. |
| M9–M12 | 14 nodes live. Weekly price index by grade. TMX integration live for the sesame season. |
| M12–M18 | Traceability certification accepted at one border post or port → Comoros and Gulf live-animal channels open. |
| M18–M24 | 40 nodes, four corridors. Second-lender panel opens. Exchange licence filed. |

## 10. Phase 1 launch corridor — 14 nodes

**Shinyanga–Dodoma–Dar es Salaam**, plus the Arusha northern spur.

**Demand:** Pugu (Dar), Vingunguti (Dar), Themi (Arusha), Morogoro
**Supply:** Nyamatala, Mhunze (Shinyanga), Bariadi (Simiyu), Igunga, Ipuli (Tabora), Kahama (Shinyanga)
**Hubs:** Kizota (Dodoma), Singida, Meserani (Monduli), Korogwe (Tanga)

Phase 2 adds 26 nodes including the Kenya border gates (Namanga, Sirari, Holili), Dar and Tanga ports for the Comoros/Gulf channel, Zanzibar, and the Southern Highlands. Phase 3 extends to ~280 of the 400+ primary markets.

*Site list is a candidate list pending Ministry and LGA confirmation; coordinates on the map are approximate.*

---

## Sources

1. [Ministry of Livestock & Fisheries / Tanzania Government Portal](https://tanzania.go.tz/home/pages/1931) — herd population and sector value 2024/25
2. [Tanzania Livestock Master Plan](https://asdp.kilimo.go.tz/uploads/Tanzania%20Livestock%20Master%20Plan.pdf) — offtake rates, production systems, abattoir capacity
3. [Tanzania Mercantile Exchange](https://tmx.co.tz/) — 2025/26 auction volumes and trading procedures
4. [Warehouse Receipt System earnings 2025/26](https://www.therespondents.co.tz/2026/07/farmers-earn-record-tzs-23-trillion.html)
5. [TCRA communications statistics Q1 2026](https://www.tanzaniainvest.com/telecoms/tcra-telecom-stats-q1-2026) — mobile money, internet, smartphone penetration
6. [Livestock Identification, Registration and Traceability Act, 2010](https://media.tanzlii.org/media/legislation/318950/source_file/fda3170b19d70f8d/2010-12.pdf)
7. [Animals' Angels — Tanzania market monitoring](https://www.animals-angels.de/en/projects/animal-markets/tanzania.html) — Pugu and Vingunguti throughput
8. [ILRI — LITS pilot, Northern Tanzania–Narok–Nairobi corridor](https://pmc.ncbi.nlm.nih.gov/articles/PMC5780531/)
9. [Selina Wamucii — Tanzania live cattle prices](https://www.selinawamucii.com/insights/prices/tanzania/live-cattle/)
10. [Ministry of Livestock & Fisheries — Livestock Sector Analysis](https://www.mifugouvuvi.go.tz/uploads/documents/sw-1749142748-1553602287-LIVESTOCK%20SECTOR%20ANALYSIS_compressed.pdf)
11. [e-Kilimo platform launch](https://www.techinafrica.com/tanzania-launches-e-kilimo-to-revolutionize-agriculture-with-digital-solutions/)
12. [World Bank Tanzania Economic Update — livestock sector](https://www.worldbank.org/en/news/feature/2024/06/26/tanzania-economic-update-harnessing-the-opportunity-for-a-climate-smart-and-competitive-livestock-sector-in-afe-tanzania)

---

**Standing limits carried over from `01 Projects/CLAUDE.md`:** no payments, no transfers, no banking or mobile-money credentials, no investment advice. Everything in this memo is a modelled business projection built from published figures — not a forecast, guarantee, or recommendation to invest.
