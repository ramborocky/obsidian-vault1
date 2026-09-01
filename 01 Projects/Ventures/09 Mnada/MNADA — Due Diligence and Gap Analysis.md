---
tags: [ventures, mnada, due-diligence, swot, analysis, gaps, strategy, tmx, cropsupply]
aliases: [MNADA Due Diligence, MNADA Gaps, MNADA SWOT]
date: 2026-08-10
status: rebuilt against TMX published fee tables and CropSupply/MazaoHub · CropSupply answered 10 Aug 2026 (no livestock) · app rebuilt as a custody tool — not yet ranked on The Board
fx: 1 USD = 2,647 TZS (4 August 2026)
author: Claude — analysis. Not investment advice.
---

# 09b · MNADA — DUE DILIGENCE, GAPS AND OPPORTUNITIES

→ back to [[00 The Board|The Board]] · source documents: [[MNADA — Bank Pitch Memo]] · [[Pilot Term Sheet]] · `app-android/`

> [!info] What this is, and what changed
> [[00 The Board]] filed MNADA as track 09 and said it **"has not been costed, ranked, or tested."** This is that test, rebuilt on 10 August 2026 around the two benchmarks that actually govern this business:
>
> - **[TMX](https://www.tmx.co.tz/)** — the CMSA-licensed national commodity exchange the memo proposes to route crop trades through. Its **published, current fee tables** say exactly what an exchange is permitted to charge in Tanzania.
> - **[CropSupply](https://cropsupply.com/) / MazaoHub** — a Tanzanian company already operating the data, sourcing and warehouse-visibility layer nationally, funded in September 2025 at almost exactly MNADA's ask.
>
> Both are decisive, and neither appears anywhere in the pitch memo. The first re-prices the revenue model. The second re-prices the opportunity.

---

## THE ONE-LINE VERDICT

> **TMX publishes what an exchange may charge here — TZS 5 per kilo, about 0.2% — and CropSupply already owns the data layer on $2m of institutional money. MNADA's exchange and index are both taken. What is left untaken is the collateral instrument, and that is a smaller, better and entirely fundable business than the one in the memo.**

---

## PART 1 · WHAT TMX'S FEE TABLES DO TO THE REVENUE MODEL

The memo's §8 mitigation is to *"route commodity trades **through** TMX under its CMSA licence."* Good instinct. But routing through TMX means accepting TMX's published economics, and those are now on the table.

### The actual charge stack, 2026/27 season

From the **[TMX Commodity Trading Procedure, 2026/27](https://tmx.co.tz/assets/guidelines/2026-2027/Pulses_Trading_Procedure__2026_2027.pdf)**, issued by the CEO on 12 February 2026. Every one of these is paid **by the buyer, on top of the winning price per kilogram**:

| Charge | Pulses (TZS/kg) | Sesame (TZS/kg) | Aggregator regions (TZS/kg) |
|---|---:|---:|---:|
| Cooperative societies administration | 60 | 100 | — |
| Warehouse operator | 37.5 | 37.5 | 38 |
| Inspection | 1.5 | 1.5 | — |
| Warehouse guarantee fund | 4 | 4 | 5 |
| Transportation | 40 | 40 | 40 |
| **Trading administration** | **5** | **5** | **10** |
| Region administration | 2 | 2 | 2 |
| District administration | 2 | 2 | 2 |
| Bags | 20 | 20 | 20 |
| Crop development | 30 | 30 | 30 |
| **Total** | **202 + 3% cess** | **242 + 3% cess** | **147 + 3% cess** |

Anchor it to a real price. Sesame cleared at **TZS 3,144/kg in 2024/25** and **TZS 2,329/kg in 2025/26**.

```
Trading administration       5 / 2,329   =  0.215%   of trade value
  in aggregator regions     10 / 2,329   =  0.429%
Whole charge stack         242 / 2,329   = 10.39%  + 3% cess  =  13.4%
```

### Three things follow, and each one hurts

**1 · The exchange layer is the cheapest link in the chain, by an order of magnitude.**
TMX's own line takes **5 of the 242 TZS/kg** — about **2% of the fee stack**. The money in Tanzanian agricultural trade sits in cooperatives (60–100/kg), warehousing (37.5/kg), transport (40/kg) and cess. **The platform is a regulated utility here. The margin is in the physical links.** MNADA's model is built the other way round.

*(Caveat worth confirming with TMX: the line is labelled "Trading administration" and the 2024/25 sesame table carried no equivalent line at all. Whether all 5 TZS/kg reaches TMX, or is shared with COPRA, is not stated in the document. Either way it is the ceiling on what the exchange function is charged out at.)*

**2 · The 0.90% crop commission is not achievable through TMX.**

```
MNADA assumed crop commission   0.90%  =  21 TZS/kg at sesame 2,329
TMX trading administration              =   5 TZS/kg
                                             4.2×
```

Applying real rates to the memo's own Year 5 crop GMV of TZS 1,159.8bn:

| Crop commission at | Yr 5 revenue |
|---|---:|
| 0.90% (memo) | TZS 10.44bn |
| 0.43% (TMX aggregator rate) | TZS 4.98bn |
| 0.215% (TMX standard rate) | TZS 2.49bn |

**A shortfall of TZS 5.5–8.0bn a year by Year 5 — 9–13% of total modelled revenue — on the line the memo describes as riding an existing rail.** The rail exists; the fare is set by someone else.

**3 · The same regulator prices livestock, if MNADA ever gets its exchange licence.**

The memo's Phase 3 plan is an exchange licence under the **Commodity Exchanges Act 2015** — the Act TMX is licensed under, administered by CMSA. Price MNADA's livestock fee the way that regulator prices TMX's:

```
A 320 kg animal at TZS 742,000  =  2,319 TZS/kg live weight
TMX-equivalent fee   5 TZS/kg   =  TZS  1,630 per head   (0.22%)
MNADA modelled fee      1.50%   =  TZS 11,130 per head
                                     6.8×
```

Run the node on TMX-equivalent pricing:

```
900 cattle × 1,630                  =  TZS 1,467,000 / month
1,800 shoats × ~275                 =  TZS   495,000 / month
Node commission                     =  TZS 1,962,000   (vs 12,690,000 modelled)
Node costs as modelled              =  TZS 7,954,667
Node contribution                   = −TZS 5,992,667 / month
```

**Every node loses about TZS 6m a month.** This is not a prediction — it is what happens if the regulator that already prices this function applies its existing benchmark. **Regulatory fee-setting risk is not in the memo's risk table, and on these numbers it is the largest single risk to the revenue line.**

### One thing TMX does that MNADA should copy outright

Settlement risk is solved with a **cash security bond**, not a guarantee fund: TZS 5m for 1–30 MT, TZS 30m for 30–50 MT, TZS 100m for 51 MT and above, posted before bidding; payment due in **72 working hours**; a **5% penalty** on late payment; and on default the lot is re-auctioned and **the deposit is used to compensate the sellers**.

The memo's answer to the same problem is a **TZS 1.00bn ring-fenced settlement guarantee fund** — 18% of the entire ask. **TMX pushes that cost onto the buyers and holds none of it.** Adopting the bond model frees TZS 1bn from the ask and removes a balance-sheet obligation MNADA cannot carry anyway.

### A regulator the memo never mentions

Buyers register through **COPRA** — the Cereals and Other Produce Regulatory Authority, under the **Cereals and Other Produce Act 2023**. That is a live licensing gate on the crop side which appears nowhere in the memo's regulatory analysis, alongside WRRB, TCDC, CMSA and the regional and district authorities named in the procedure. **The crop side is a five-regulator room.**

---

## PART 2 · WHAT CROPSUPPLY DOES TO THE OPPORTUNITY

**[CropSupply.com](https://cropsupply.com/)** is the sourcing and intelligence platform of **MazaoHub**, a Tanzanian agritech founded in 2021 by Geophrey Tenganamba (CEO) and Adelard Josephat Urassa (CTO). In **September 2025 it raised $2m** — $1.5m equity led by Catalyst Fund with Nordic Impact Fund, Mercy Corps Ventures, elea Foundation, Impacc and DOB Equity, plus $500k non-dilutive from the Livelihood Impact Fund.

What it is running **today**:

| | |
|---|---|
| Live wholesale prices | **500+ markets**, refreshed every 30 minutes; ~547 live quotations |
| Tanzania coverage | **163+ tracked markets** — Dar, Dodoma, Kilimanjaro, Tanga, Arusha, Mbeya and more |
| Commodities | 112+, graded **A / B / C / Mixed**, with seasonal status |
| Supply side | 604+ suppliers — bulk suppliers, farm aggregators, collection centres |
| Warehouses | **67+ tracked, integrated with the Warehouse Receipt System** |
| Named user types | market agents, traders, warehouse operators, **collateral managers**, factories, exporters, **animal feed producers**, transporters |
| Documents | **Digital Harvest Receipts** — digital records of sales and deliveries |
| Access | Web, free tier ("Get Started Free"), public API |
| Footprint | Tanzania, Kenya, Rwanda, Uganda, Zambia; data across 37+ countries |

### What this kills

**The price index by observation is gone as a differentiator.** The previous version of this note ranked "walk four markets, publish weekly prices by grade" as the cheapest compounding asset in the folder. On crops it is built, national, graded, refreshed every half hour, and free at the point of entry. **A four-market weekly sheet cannot compete with 163 markets on a 30-minute cycle.**

It also demonstrates that **grading standards, digital receipts and WRS integration are commodity capabilities in this market**, not moats. And it names *collateral managers* as a user type — meaning the collateral-management workflow is already inside someone else's product surface on the crop side.

### What this proves — and it matters more

| | |
|---|---|
| **The funding path is real and it is not a bank** | $2m ≈ TZS 5.3bn, against MNADA's TZS 5.5bn ask. Catalyst Fund, DOB Equity, Mercy Corps Ventures — **impact-venture and blended finance, not a commercial bank credit committee.** The memo is aimed at the wrong counterparty with the wrong instrument |
| **The bar for that money is visible** | Four years of operating history, a hardware product, agronomists in the field, five countries, a live platform. **That is the comparison a Catalyst Fund partner will make**, and MNADA currently brings a WebView demo and no company |
| **A Tanzanian founder can raise it** | Not theory. Dar es Salaam address, local founders, September 2025 |
| **They describe themselves as "a supply chain operating system, not a marketplace"** | The same conclusion the memo reaches in §2 — reached first, and funded |

### What CropSupply does **not** do — and this is MNADA's actual ground

**No livestock. No individual animal identity. No custody. No document of title. No credit. No settlement rail.**

They serve animal *feed* producers; they do not touch animals. Everything on that list is the hard, physical, regulated part — and it is precisely what [[Pilot Term Sheet]] is about. **CropSupply's existence narrows MNADA's defensible territory to the collateral instrument, and makes that territory more clearly the right one, not less.**

It also makes them the obvious **first conversation** — distribution, data and capital on one side; a livestock-specific instrument nobody else has on the other. Partner, acquirer, or the competitor who adds a livestock tab in a quarter. That is decided by who calls whom.

> [!check] The call was made — 10 August 2026
> **CropSupply confirmed they do no livestock, and said they may add it "in the near future."** Reported by the user from a direct conversation, not inferred here.
>
> **Read the five-year silence as information, not oversight.** MazaoHub has been operating since 2021, raised $2m in September 2025, and runs 163+ Tanzanian markets — and still has not touched animals. That is not a gap they failed to notice. Crops are fungible, they sit still in a licensed warehouse, and they do not die; the whole business scales from a desk and an API. An animal is an individual, it walks, it gets sick, and its grade depends on dentition and body condition that a human has to physically inspect. **There is no desk-scalable version of the livestock layer. That is exactly why the territory is open, and exactly why it is expensive.**
>
> Three consequences:
>
> 1. **The moat is real, and it is a field-operations moat, not a software one.** Nothing in Part 4's Strengths changes; the reason behind them does. Anyone entering has to put people in Bariadi.
> 2. **"Near future" is a clock.** They have the capital, the markets and the API to add a livestock tab in a quarter — Part 4 already lists this as a threat, and it has now been said out loud. The window is finite but not closed.
> 3. **Partnership leverage is weaker than the previous version of this note assumed.** They have no reason to buy what they can build once the crop side is saturated. Do not gate anything on it, and do not wait for it.

### The one asymmetry worth a second email

CropSupply is **web and API only — no Android app, and nothing on the Play Store.** Their product is built for a trader, an off-taker or an analyst at a desk. It is not built for the person standing in a pen with a phone, and Tanzanian smartphone penetration of ~42.5% is the reason that gap has not hurt them yet.

MNADA has the opposite shape: a working Android field client, real grading maths, Kiswahili-first, offline by design.

**This is a genuine complement, and it is still not leverage.** They can commission an Android client whenever they want it, and $2m buys one. Treat it as a reason the conversation is worth having twice — *"you have the data and no field client; I have a field client and no data"* — not as a bargaining position. **One email, no follow-up campaign, and nothing in the plan depends on the answer.**

---

## PART 3 · THE CREDIT STRUCTURE — TWO REAL DEFECTS

The [[Pilot Term Sheet]] is the strongest document in the folder. Two things in it do not survive Tanzanian price data.

### Defect 1 — the coverage triggers use the wrong denominator

§8 sets coverage as **assessed value ÷ outstanding facility**, and fires mandatory sale below **108%**. But §10 correctly shows that cess and custody rank **ahead** of the lender:

```
G × (1 − 0.015) − 19,800,000 ≥ 120,327,671
G ≥ TZS 142,261,595
```

Against a facility of TZS 118m, that break-even is a coverage ratio of:

```
142,261,595 / 118,000,000  =  120.6%
```

**The mandatory-sale trigger fires at 108%, twelve points below the level at which the lender is already under water.** And because custody accrues over the tenor, the true trigger is not a constant:

| Day | Senior costs accrued | Gross needed | Correct trigger |
|---:|---:|---:|---:|
| 1 | ~0 | ~TZS 119.8m | **~102%** |
| 22 | ~9.7m | ~TZS 131.8m | **~112%** |
| 45 | 19.8m | TZS 142.3m | **~121%** |

Drawdown coverage is 125.8% — which is **5 points** of headroom over the day-45 trigger, not the 18 points the document implies. **Replace the static ladder with an accrual-adjusted one.** This is an hour's work and a credit officer will find it in ten minutes if you don't.

### Defect 2 — a 26% single-season fall just happened, in this country, in an adjacent commodity

Sesame: **TZS 3,144/kg in 2024/25 → TZS 2,329/kg in 2025/26. A 26% fall in one season**, on a commodity with a public price and an organised national auction.

Apply that to the pilot lot:

```
Entry index                      TZS   742,000 / head
−26%                             TZS   549,080 / head
200 head gross                   TZS 109,816,000
less cess 1.5%                   TZS   1,647,240
less custody 45 days             TZS  19,800,000
Available to lender              TZS  88,368,760
Owed at maturity                 TZS 120,327,671
SHORTFALL                        TZS  31,958,911   =  27% of the facility
```

**Loss given default of about 27%**, before the personal guarantee and outside the insurance (mortality is covered; price is not).

The honest reply is that the margin-call machinery is meant to intervene long before that — and it would, *if* the fall is gradual and *if* a mandatory sale can actually be executed into a falling market inside five business days. Both are assumptions, and the second is the weak one: livestock prices in Tanzania move on rainfall, disease corridors and festival demand, which are step functions, not slopes. **§10's claim that the lot "can realise 21% below its expected exit price and the Lender is still repaid" is true only against a smooth market. Model the step case, name it, and let the lender price it.** Volunteering this is worth more than hiding it — the term sheet's credibility is built on §14 already doing exactly that with the legal risk.

---

## PART 4 · SWOT, REBUILT ON THE NEW EVIDENCE

### Strengths

| | |
|---|---|
| **The diagnosis is right, and CropSupply independently confirms it** | Identity → fungibility → custody → title is the correct order, and a funded company reached the same "operating system, not marketplace" conclusion |
| **Repayment inside the settlement rail** | Still the best idea in the folder. It solves the failure mode that killed the 2018/19 cashew season, where farmers waited six months to be paid |
| **The one thing nobody else is doing** | No livestock anywhere in CropSupply, TMX, or any funded Tanzanian platform found. The territory is genuinely open |
| **The grading logic is real code** | `lotCode()` and `valueOf()` compute from weigh-band, dentition, BCS and node basis. Not a mockup |
| **The documents volunteer their own weaknesses** | §14 names its largest legal risk; §13 pays the bank's costs on failure. Rare, and worth real credibility |
| **The pilot is correctly sized** | One lender, one lot, 45 days, fees waived |

### Weaknesses

| | |
|---|---|
| **The revenue model is priced 4–7× above the regulated benchmark** | Part 1. This is now a measured fact, not a comparison |
| **A TZS 1bn guarantee fund that TMX proves is unnecessary** | 18% of the ask, solving a problem the incumbent solves with buyer bonds |
| ~~There is no product~~ | **Partly addressed 10 August 2026 — see Part 7.** The custody tool exists, persists, and produces an evidence pack. What does not exist is a server, NIDA verification, a tag reader, or one hour of testing on a real handset |
| **Debug keystore** | The build now takes a real release key from an untracked `keystore.properties`, **but falls back to the debug key when that file is absent — and it is absent.** Generate the key before the first field trial |
| **No company, no team, no domain operator** | MNADA Exchange Ltd does not exist. Against MazaoHub's four years, hardware, agronomists and five countries, this is the widest gap in the folder |
| **Wrong counterparty for the ask** | A TZS 5.5bn bank facility for a pre-revenue platform. The comparable raise went to impact venture, not a credit committee |
| **Five regulators on the crop side** | CMSA, WRRB, TCDC, COPRA, plus regional and district authorities — and COPRA is not mentioned in the memo at all |
| **Founder capacity** | Employed, in debt, ACPA open, 25 October prize deadline. This is the eighth track on a board whose first line is that **seven businesses is zero businesses** |

### Opportunities

| | |
|---|---|
| **The collateral instrument, standing alone** | Nobody in this market is doing it, and it needs no exchange, no 280 nodes and no TZS 5.5bn |
| **The security-interest route instead of the LDR** *(Part 5)* | Removes the largest legal risk without legislation |
| **CropSupply as partner, not competitor** | They have distribution, data and capital and explicitly do not do animals. This is a conversation, and it costs an email |
| **Be a WRRB-licensed collateral manager on the crop side** | An existing licence category, revenue this season, and the exact operational record the livestock version needs |
| **Insurance attach** | UAP Tanzania and Howden write conventional mortality cover; ACRE Africa writes index-based. MNADA distributes, does not underwrite |
| **The TANLITS reframe** *(Part 5)* | Turns a Ministry refusal into an explanation of the Ministry's own stall |
| **Kiswahili and ground presence** | The same moat [[00 The Board]] found for the prizes. Nairobi-funded agritech does not staff Bariadi |

### Threats

| | |
|---|---|
| **CMSA prices the exchange fee at TMX levels** | Node contribution goes to −TZS 6m/month. The single largest revenue risk, and it is absent from the memo |
| **CropSupply adds livestock** | They have the capital, the markets, the graders and the API. One quarter of work |
| **Political capture of the index** | The cashew precedent: unpaid farmers ~TZS 20.4bn, service providers TZS 11.3bn, state price-setting. A national price index is a politically owned object the moment it falls |
| **Price step-moves** | Sesame −26% in one season. Part 3 |
| **State platform / incumbent tag supplier** | e-Kilimo, plus S and J Animal Company already supplying e-tags to district councils |
| **Broker retaliation** | Co-opting them costs margin the node model does not carry |
| **Disease closure** | Zanzibar has banned livestock and meat imports over Rift Valley Fever. Precedent, not theory |
| **Opportunity cost** | 24 months of the only founder's attention, against a guaranteed ~48%/yr from clearing the debt |

---

## PART 5 · THE TWO REFRAMES THAT COST NOTHING AND CHANGE EVERYTHING

### Reframe 1 — stop fighting for the LDR

The **Warehouse Receipts Act, Cap. 339 (R.E. 2016/2023)** is drafted for a *commodity* stored in a *licensed warehouse*, issued by a warehouse operator or collateral manager, regulated by WRRB. It does recognise electronic receipts — which is why the analogy is tempting — but a live animal in a holding ground is not a stored commodity, and stretching the Act to cover one is a legislative amendment, not an argument.

**The LDR is not necessary.** What the lender needs is a perfected security interest over identified animals, control of the proceeds, a custodian who acknowledges the lender's interest, and assigned insurance. **§5 of the term sheet already builds all four.** The LDR is doing branding work, not legal work.

The region agrees: **Kenya's movable property registry took 34,638 livestock collateral registrations in the year to June 2023**; **Ethiopia's central bank registry names cattle, camels, sheep, goats and poultry as eligible collateral**; Zimbabwe, Namibia and South Africa all run cattle-backed lending. **None of them invented a receipt.**

> **The question for counsel is not "can an electronic LDR be a document of title?" It is: "can a security interest over individually identified livestock be created and perfected in Tanzania today, and where is it registered?"**

Tanzania has been urged to modernise secured transactions on the UNCITRAL model with a computerised registry; mainland law requires registration of security within 42 days of creation. **Whether a usable movable-collateral registry is live today is the single most valuable unknown in this folder, and it is a two-page question for one lawyer.**

- **Yes** → legal risk collapses, Cap. 339 becomes irrelevant, the pilot is signable this year.
- **No** → everything sits behind legislation, and time-to-money is 5–7 years, not 24 months.

### Reframe 2 — TANLITS did not fail to exist. It failed to be worth using.

The memo's load-bearing sentence is that the 2010 Act mandates a registry "nobody has funded." That is wrong. **TANLITS is live** — roughly **70,000 cattle individually e-tagged and ~17m registered by group identification as of 2019**, tags manufactured by **S and J Animal Company Limited** and supplied to district councils, recording owner, premise, breed, age and veterinary history. It does not track movement, registration rates stayed low, and the exercise has been suspended at points for assessment.

**The true version is the stronger pitch.** "We will build the statutory registry" is a claim the Ministry can refuse. **"TANLITS tagged 70,000 animals and stalled because a tag did nothing for the keeper — we make the tag the thing that gets him a better price and a loan"** is a claim that explains the Ministry's own failure back to them, and they have no counter to it. Rewrite §2 and §8 around this.

---

## PART 6 · WHAT ELSE THE MODEL IS MISSING

The five-year arithmetic is sound — I re-ran it, and the §8 take-rate stress case does hold, *provided* the 0.90% compression applies to livestock only and crop rates are unchanged. **Given Part 1, that proviso is now the wrong way round: crops are the line that compresses.** State the condition explicitly.

Beyond that, the leaks are omissions:

**Tag cost — the largest single omission.**

```
Year 2:  40 nodes  × 2,700 animals × 12  =  1,296,000 animals
Year 5:  280 nodes × 2,700 animals × 12  =  9,072,000 animals

1,296,000 tags × TZS 1,300 (≈$0.50)  =  TZS 1.68bn
1,296,000 tags × TZS 3,000           =  TZS 3.89bn
```

The **entire equipment line in the ask is TZS 1.00bn**, and it must also cover crushes, weigh bars and readers. Either the keeper pays — in which case it is the adoption problem that stalled TANLITS, and belongs in the risk section — or MNADA pays and the ask is under-sized. **A quote from S and J Animal Company for 10,000 units settles it in one phone call**, and it moves the size of the ask more than any other input. (Mitigating: an animal is tagged once and may trade twice, so the true figure is per first registration.)

**Broker share.** §8 mitigates broker capture by recruiting brokers on commission share; §5's node P&L has no such line.

```
Node commission at maturity              TZS 12,690,000 / month
Node contribution as modelled            TZS  8,565,733 / month
Brokers take one third of commission    −TZS  4,230,000
Node contribution                        TZS  4,335,733 / month   (−49%)
```

**Six lines that are not there at all:**

| Missing | Why it bites |
|---|---|
| Bad debt / settlement failure provision | Zero is not credible for a spot market in live animals. TMX's answer is a cash bond — copy it |
| Settlement working capital | Paying the seller before buyer funds clear is the *only* reason a seller switches rails. TMX takes 72 working hours; a seller who has waited since the cashew season will not |
| Seasonality | Offtake is violently seasonal — dry season, Eid, festive, school-fee months. Flat monthly volumes overstate revenue and understate the working-capital peak |
| FX and inflation | Year 5 converted at a flat 2,647 TZS/USD across five years. A USD investor reads a smaller number than $22.4m |
| Customer acquisition | Field ops is staffed, not marketed. Trust in a new intermediary is bought |
| The payback ramp | TZS 23m capex against TZS 8.57m/month at maturity is a 2.7-month payback; "month 14–16" implies ~12 months of ramp that is never shown. Show the curve, or a reviewer assumes you hid it |

**And one convention error:** the memo splits commission 0.75% buyer / 0.75% seller. **Both TMX procedures put the entire charge stack on the buyer, on top of the winning price.** Sellers here — AMCOS, unions, keepers — expect the hammer price net. The seller-side 0.75% is the half that gets refused.

---

## PART 7 · THE PRODUCT GAP

The four screens (Soko / Sajili / Zizi / Bei) demo the right four things and the grading maths is real. What is absent:

| Missing | Consequence |
|---|---|
| **Persistence** | No `localStorage`, no database. Close the app and the register is gone. The `SYNC` / `QUEUE` chip is a label, not a queue |
| **Network layer** | No `fetch`, no network permission in the manifest. Every price and counterparty is generated on-device |
| **Real identity binding** | "Bound to keeper's National ID" is a display string. NIDA verification is the regulatory floor for a lending rail and the hardest integration in the stack |
| **USSD** | Budgeted in the ask, absent from the build — and at 42.5% smartphone penetration, USSD *is* the supply-side product |
| **Evidence trail** | No photos, timestamps, GPS, agent signature or immutable log. A collateral manager who cannot prove what it saw is uninsurable |
| **Reconciliation ledger** | The term sheet promises weekly 100% tag reconciliation. Nothing in the app reconciles anything |
| **Dispute / reversal** | Every real market has bad trades. There is no path for one |
| **Mobile money** | No integration, in a country with **80.98m mobile money accounts** |

Not a criticism of the demo, which does its job. It is the size of the gap: **12–24 months of a small engineering team, plus NIDA and mobile-money integrations that are themselves licensing exercises.** Say so in the memo — a reviewer who discovers it alone stops believing the rest. CropSupply's live API is the visible standard of what "built" looks like here.

> [!check] Rebuilt as a custody tool — 10 August 2026 · `app-android/` v0.2.0-custody
> The table above prices the gap for **the platform in the memo**. Scoped to the pilot instead — one lender, one lot, two users — most of it stops being required, and what remains was built.
>
> **Gone:** the market board, the bid book, the price index, the LDR issuance, the simulated counterparties, the drifting prices, the `SYNC` chip, and "bound to keeper's NIDA" on a field nobody verified.
>
> **Built:** enrolment with a required photograph, GPS fix and timestamp; persistence that survives closing the app; a weekly reconciliation walk that reports present / missing / dead against the 1% default threshold; a SHA-256 hash chain over every action, verified against what is *persisted* rather than what the session holds; and a single JSON pack for the lender.
>
> **The cover calculation is now the app's front screen**, computed against accruing senior costs — reproducing the term sheet's day-1 TZS 120.3m and day-45 TZS 142.3m exactly. Defect 1 stops being a paragraph in a note and becomes a number the agent looks at every morning.
>
> **Still absent and still labelled as absent:** NIDA verification, a tag reader, any server, mobile money, insurance, and a live market mark. The Record tab states this in both languages, on the theory that a reviewer who finds one fake string stops believing the grading maths too — and the grading maths is real.
>
> **Not yet run on a physical handset.** The camera chooser, MediaStore capture, location bridge and pack writer need one pass on a real phone.

---

## PART 8 · THE OPPORTUNITY, RE-RANKED

> The exchange is taken. The data layer is taken. **What survives is the instrument** — and it gets stronger as the plan gets smaller.

| Rank | Move | Cost | Time to money | What it removes |
|---:|---|---|---|---|
| **1** | **Counsel's opinion: is a security interest over identified livestock perfectible in Tanzania today, and where is it registered?** | Hours + a modest fee | — | The largest risk in the folder. Nothing else deserves an hour first |
| ~~2~~ | ~~Email CropSupply / MazaoHub~~ | — | — | **Done, 10 August 2026. No livestock, "maybe in the near future." Downgraded: one further email on the Android-client asymmetry, then drop it. Nothing depends on the answer** |
| **3** | **Apply as a WRRB-licensed collateral manager on the crop side** | Application + one season | **Months** | No new law, no new licence category, and it builds the exact record the livestock version needs |
| **4** | **Run the pilot as the whole business** — one bank, one feedlot, one lot, collateral management only | ~TZS 30–60m of work | On lot #2 | The exchange, the 280 nodes, the Ministry MoU and the TZS 5.5bn ask |
| **5** | **Insurance attach** with UAP / Howden / ACRE | Partnership only | Months | Revenue without balance sheet; makes the collateral bankable |
| **6** | **Rewrite the memo**: TANLITS reframe, buyer-pays convention, TMX fee reality, accrual-adjusted triggers, and re-aim it at impact venture rather than a bank | A weekend | — | The credibility failures a reviewer would find in ten minutes |
| ~~7~~ | ~~Publish a price index by observation~~ | — | — | **Struck. CropSupply runs 163+ Tanzanian markets on a 30-minute refresh, free at entry** |
| **8** | The full exchange, 280 nodes, TZS 5.5bn | 24+ months full time | Year 3+ | Nothing — it needs everything above to be true first |

**Moves 1 and 3 cost almost nothing and fit inside the maintenance-mode budget [[00 The Board]] allows.** Move 2 is now answered and downgraded. Move 8 is a different life.

---

## PART 9 · THE BOARD'S THREE QUESTIONS, ANSWERED

| Question | Answer |
|---|---|
| **What does it return?** | On the memo's own plan, **nothing for 24+ months** — the pilot waives all MNADA fees by design, correctly. And the modelled returns are now suspect: crops at TMX rates are TZS 5.5–8.0bn/yr short by Year 5, and a CMSA fee ruling at TMX levels makes every node loss-making |
| **How long until money?** | **Best case M9–M12**, requiring yes from a bank, a feedlot, an insurer, a custodian, the Ministry and counsel. **Realistic 18–30 months.** Move 3 — crop collateral management — is the only path here with money inside 12 months |
| **Which live track would it displace?** | **Both.** A registry MoU and a bank pilot are not maintenance-mode work |

> [!danger] Against the Board's own sentence
> *Kill the debt · make the ACPA call · earn in USD · enter the free prizes.*
>
> **MNADA fails it on every clause** — nothing for two years, TZS not USD, and it consumes the hours the ACPA call needs.
>
> **It earns a research spike, not a row:** counsel's opinion, one email to CropSupply, one WRRB enquiry about the collateral-manager licence, one tag quote. No build, no company, no spend. If the counsel's opinion comes back *yes, perfectible today*, this becomes genuinely interesting and gets re-ranked then.

---

## WHAT WOULD CHANGE THIS ANALYSIS

| Fact | Effect |
|---|---|
| A live movable-collateral registry in Tanzania accepting livestock | Moves MNADA from "5-year idea" to "signable this year" |
| TMX confirming the exchange may price ad valorem, not per kilo | Restores most of the revenue model — **ask them, it is one email** |
| ~~CropSupply saying yes to a livestock partnership~~ | **Asked and answered 10 August 2026: no livestock today, "maybe in the near future." Distribution and data remain MNADA's own problem** |
| A named co-founder who is a livestock operator or a credit officer | Fixes the widest weakness in Part 4 |
| A tag quote at the low end, with the keeper paying | Closes the largest cost omission and shrinks the ask |
| One bank saying yes to a 200-head pilot | Beats every projection in the memo combined |
| An impact-venture term sheet (Catalyst Fund, DOB Equity, Mercy Corps Ventures, FSDT, AgDevCo) | The correct instrument and the correct room — MazaoHub raised $2m from exactly this set |

---

## Sources checked, 10 August 2026

**The two anchors**
1. [Tanzania Mercantile Exchange](https://www.tmx.co.tz/) — home, [operations](https://www.tmx.co.tz/page.php?page=operations)
2. [TMX Commodity Trading Procedure 2026/27 (pulses and sesame) — issued 12 February 2026](https://tmx.co.tz/assets/guidelines/2026-2027/Pulses_Trading_Procedure__2026_2027.pdf) — **the fee tables in Part 1**
3. [TMX Sesame Seeds Trading Procedure 2024/25](https://www.tmx.co.tz/assets/guidelines/SESAME_TRADING_PROCEDURE_2024_25.pdf) — the prior-season charge stack, TZS 198/kg
4. [TMX Raw Cashewnut Trading Procedure 2025](https://www.tmx.co.tz/assets/guidelines/2025-2026/TMX_RCN_Trading_Procedure_2025.pdf)
5. [CropSupply.com](https://cropsupply.com/) — coverage, grading, warehouse/WRS integration, user types
6. [MazaoHub](https://mazaohub.com/) — [crop buyers / CropSupply](https://mazaohub.com/service/to-large-off-takers), [cooperatives and AMCOS](https://mazaohub.com/service/cooperatives-and-amcos-agricultural-marketing-cooperative-societies)
7. [Tech in Africa — MazaoHub secures $2m](https://www.techinafrica.com/tanzanian-agritech-startup-mazaohub-secures-2-million-to-scale-ai-driven-farming-solutions-across-africa/) · [iAfrica](https://iafrica.com/tanzanias-mazaohub-raises-2m-to-scale-ai-powered-farming-solutions/)
8. [The Citizen — Tanzania bets on quality in tough sesame market](https://www.thecitizen.co.tz/tanzania/news/national/tanzania-bets-on-quality-in-tough-sesame-market-5449990) — **sesame TZS 3,144 → 2,329/kg**
9. [Wikipedia / CMSA — TMX licensed under the Commodity Exchanges Act 2015](https://en.wikipedia.org/wiki/Tanzania_Mercantile_Exchange)

**Registry, legal and market**
10. [Towards an integrated animal health surveillance system in Tanzania — TANLITS registration figures](https://pmc.ncbi.nlm.nih.gov/articles/PMC7936506/)
11. [ILRI — livestock identification and traceability pilot, northern Tanzania–Narok–Nairobi](https://pmc.ncbi.nlm.nih.gov/articles/PMC5780531/)
12. [Daily News — TZ cattle electronic ear tagging](https://dailynews.co.tz/why-tz-cattle-electronic-ear-tagging-a-great-leap-forward/)
13. [Warehouse Receipts Act, Cap. 339 R.E. 2023](https://www.vkadvocates.co.tz/LIBRARY/Cap.%20339%20Warehouse%20Receipts%20Act,%20R.E%202023.pdf)
14. [KG&P — suitability of warehouse receipts as collateral in Tanzania](http://kgpartners.co.tz/suitability-of-warehouse-receipts-as-collateral-for-loan-financing-transactions-in-tanzania/)
15. [Chambers — Banking & Finance Tanzania (security registration, 42 days)](https://practiceguides.chambers.com/practice-guides/banking-finance-2021/tanzania) · [Lexology — security interests in Tanzania](https://www.lexology.com/library/detail.aspx?g=023a5ac0-20d1-4ce2-82a5-c499bdfde2a2)
16. [The Citizen — government owes cashew farmers and service providers TZS 31.6bn](https://www.thecitizen.co.tz/tanzania/news/national/government-owes-cashew-farmers-service-providers-sh31-6bn-for-2018-2019-season-2705188) · [allAfrica — 2018/19 cashew woes](https://allafrica.com/stories/201909300375.html)
17. [This is Africa — Zimbabwe livestock as collateral](https://thisisafrica.me/politics-and-society/livestock-collateral-loans/) · [Agribank Namibia livestock loans](https://agribank.com.na/product/livestock-loans-16-53)
18. [UAP Tanzania livestock insurance](https://www.uaptanzania.co.tz/corporate/livestock-insurance) · [Howden Tanzania](https://www.howdengroup.com/tz-en/cover/livestock-insurance) · [ACRE Africa IBLI](https://acreafrica.com/livestock-insurance/index-based-livestock-insurance/)
19. [ReliefWeb — Zanzibar bans livestock and meat imports over Rift Valley Fever](https://reliefweb.int/report/united-republic-tanzania/tanzania-zanzibar-bans-livestock-meat-imports-prevent-rvf)
20. [AuctionsPlus](https://auctionsplus.com.au/) · [Queensland Country Life — FY22 volumes](https://www.queenslandcountrylife.com.au/story/8959137/cattle-sales-surge-on-auctionsplus-platform/) — the offshore benchmark, ~0.15% implied take rate

> [!warning] Standing limits
> This is a business-model analysis built from published figures and the vault's own documents. **No payments, no transfers, no banking or mobile-money credentials, and no recommendation to invest.** → [[Expenses]] · [[00 The Board]]

## Related
- [[MNADA — Bank Pitch Memo]] · [[Pilot Term Sheet]] · [[Pilot Term Sheet — Plain English]] · [[00 The Board]] · [[Projected Profit — All Tracks]] · [[Debt First]] · [[Career Leverage]]
