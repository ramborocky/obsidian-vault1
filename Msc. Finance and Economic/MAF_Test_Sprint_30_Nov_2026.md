---
tags: [maf, tests, revision, november-2026]
updated: 2026-11-20
tests-start: 2026-11-30
---
# 🎯 MAF Test Revision Sprint
> **Five subjects • preparation from 20–29 November 2026 • tests start 30 November**
>
> [[MSc_Study_Plan|Full semester roadmap]] · [[../MAF & Life Dashboard|Life dashboard]]

## 🔴 What controls this revision plan

Your supplied topic list is the **test scope reported by you**. The GitHub guides support the topic breakdown for FM, FR and PM. They do not identify the exact forthcoming questions. All questions and worked examples below are newly created practice material.

**Missing:** test order/times, duration, marks, permitted materials, and lecture notes/module guides for Research Methodology and the first subject. Its supplied name is “Qualitative techniques for finance”; the numerical topics suggest **Quantitative Techniques for Finance**, but confirm the official name.

**Do not use the old semester-exam ticks to exclude these test topics.** This is a separate, short-term preparation plan based on the new list. It does not replace the March semester roadmap.

| Subject | Your test topics | Expected practice formats — inference, not confirmed paper format |
|---|---|---|
| 🔵 Finance techniques — title to confirm | Time value of money; risk/return; CAPM; probability/distributions | Numerical problems, choosing a model, interpreting a result |
| 🟣 Performance Management | Cost estimation; decision-making scenarios | Estimate a cost function; evaluate alternatives; recommend with calculations |
| 🟢 Research Methodology | Correlation analysis | Calculate/interpret correlation; read output; explain limitations |
| 🟠 Financial Management | Working capital; restructuring; mergers/acquisitions | Cash-cycle and funding calculations; comparisons; acquisition valuation and recommendation |
| 🟡 Financial Reporting | Framework; statement elements; concepts/principles applied to statements | Explain/apply rules; classify items; adjustments, entries and statement preparation |

**Known date:** tests start 30 November. **Unknown:** which subject is first and the remaining dates. The schedule below covers all five before the start, then follows the real order when supplied.

## 🔵 1 Finance techniques

No dedicated guide for this subject was found in the current MSc folder. This section is standard preparation inferred from your topic headings. Advanced extensions are labelled for confirmation.

| Topic | You should be able to do | Representative question | Common mistake |
|---|---|---|---|
| Time value of money | PV/FV of a lump sum; annuities; uneven cash flows; match rates and periods | “Compare receiving cash now with a series of future payments.” | Mixing monthly periods with an annual rate |
| Payment timing | Distinguish an ordinary annuity from an annuity due | “How does valuation change if payments begin immediately?” | Discounting a payment at time zero |
| Risk and return | Holding-period return; expected return; probability-weighted variance and standard deviation | “Calculate return and risk for two investments and interpret the difference.” | Omitting income or using a sample formula for a probability distribution |
| CAPM | Required return from risk-free rate, beta and market premium; explain systematic risk | “Is the forecast return sufficient for this beta?” | Treating the market return as the market risk premium |
| Probability | Addition, multiplication, independence and conditional probability | “Given default, what is the probability the borrower belongs to group A?” | Confusing P(A given B) with P(B given A) |
| Distributions | Expected value/variance; recognise a suitable distribution; interpret normal probabilities | “Find the probability of returns below a threshold.” | Assuming normality without being told |
| Confirm depth | Binomial, Bayes, normal tables; portfolios/covariance, perpetuities and effective rates | “Which of these were taught and included?” | Spending revision time on untaught extensions |

### Core formula card

- Lump sum: **FV = PV(1+r)^n**; **PV = FV/(1+r)^n**.
- Ordinary annuity PV: **A[1−(1+r)^(-n)]/r**, for n equal end-period payments.
- Annuity due: multiply the matching ordinary-annuity value by **(1+r)**.
- Holding-period return: **(ending price − initial price + income)/initial price**.
- Expected return: **E(R) = ΣpR**.
- Probability-distribution variance: **Σp[R−E(R)]²**; standard deviation is its square root.
- CAPM: **required return = Rf + β[E(Rm)−Rf]**.
- Conditional probability: **P(A given B) = P(A and B)/P(B)**, when P(B)>0.
- Normal standardisation: **z = (x−μ)/σ**, when a normal model is appropriate.

### Worked practice

**Q1 — cash timing.** Find the present value of TZS 5,000,000 payable in three years at 12% annually. Then find the PV of TZS 1,000,000 received at each year-end for three years at the same rate.

**Answer:** lump sum = 5,000,000/(1.12³) ≈ **TZS 3,558,901**. Annuity = 1,000,000[1−1.12^(-3)]/0.12 ≈ **TZS 2,401,831**. Draw the timelines before calculating.

**Q2 — risk/return.** Returns are −10%, 10%, 30% with probabilities 0.2, 0.5, 0.3. Calculate expected return and standard deviation.

**Answer:** E(R) = −2%+5%+9% = **12%**. Using percentage-point units, variance = 0.2(−22)²+0.5(−2)²+0.3(18)² = **196**; SD = **14 percentage points**. Equivalently, decimal variance is 0.0196 and SD 0.14. Expected return is not a guaranteed outcome.

**Q3 — CAPM.** Risk-free return is 8%, expected market return 14%, beta 1.2. A share's forecast return is 13%. Evaluate it using CAPM.

**Answer:** required return = 8%+1.2(14%−8%) = **15.2%**. Forecast return is **2.2 percentage points below** the CAPM requirement. Under these assumptions it fails the required-return test. Explain estimation/model limitations.

**Q4 — distribution choice.** Ten independent borrowers each have a 10% probability of default. Find the probability exactly two default.

**Answer:** assuming equal independent default probabilities, use binomial: C(10,2)×0.1²×0.9⁸ ≈ **19.37%**. Real borrower defaults need not be independent. Confirm binomial coverage with the lecturer.

## 🟣 2 Performance Management

The PM guide explicitly includes high-low, scattergraph, least squares/regression, reliability, learning curves, relevant costing, CVP, pricing and decisions under risk/uncertainty. Your phrase **“decision-making scenarios” is broad**: confirm which of these have been selected for this test.

| Area | Learn/do | Representative question |
|---|---|---|
| Cost behaviour/estimation | Fixed, variable, mixed costs; relevant range; high-low; cost equation | “Estimate fixed/variable cost and forecast cost at a stated activity.” |
| Least squares | Fit or interpret a cost regression; distinguish estimation from prediction | “Interpret intercept/slope and comment on reliability.” |
| Reliability | Correlation/R² where taught; outliers, omitted drivers and range limits | “Why might this forecast mislead management?” |
| Learning curves | Average versus incremental hours; apply the taught learning model | “Estimate hours for the next batch.” Confirm inclusion. |
| Relevant decisions | Incremental cash flows; opportunity costs; sunk/allocated costs | “Make or buy? Accept an order? Continue or close?” |
| Constraints/CVP | Contribution, break-even, safety margin; contribution per scarce resource | “Select the best product mix.” Confirm scenario scope. |
| Risk/uncertainty | Expected values, trees, payoff/regret criteria, information value | “Choose and justify a decision under the stated rule.” Confirm inclusion. |

**Answer structure:** identify decision → relevant figures → calculate alternatives → compare → discuss operational factors → recommend.

**Q5 — high-low.** At 2,000 units, cost is TZS 7,000,000; at 5,000 units, cost is TZS 13,000,000. Estimate the cost function and cost at 4,000 units.

**Answer:** variable cost = (13m−7m)/(5,000−2,000) = **TZS 2,000/unit**. Fixed cost = 7m−2,000×2,000 = **TZS 3m**. Equation **Y = 3,000,000 + 2,000X**. At 4,000 units, cost = **TZS 11m**. High-low uses the highest/lowest **activity**, not cost; it relies on two observations and a stable relationship.

**Q6 — make or buy.** You need 10,000 components. Internal variable cost is TZS 4,000 each; avoidable fixed cost TZS 5m. The supplier asks TZS 4,800 each. Unavoidable allocated overhead is TZS 8m. Assume no alternative use of capacity.

**Answer:** make = 40m+5m = **45m**; buy = **48m**. Making saves **3m**. Exclude the unchanged allocated overhead from the comparison. Assess quality, reliability and capacity. If buying frees capacity producing net additional contribution above 3m, the choice can change.

**Further prompts:** classify ten sunk/opportunity costs; solve one limiting-factor problem; calculate one expected-value decision and explain why a risk-averse manager might choose differently. Only expand into each branch once its test inclusion is known.

## 🟢 3 Research Methodology

Dedicated lecture notes are missing. **Correlation analysis is confirmed by your list; Pearson versus Spearman, significance tests and software-output depth still need confirmation.**

| Skill | Practice task | What a sound answer shows |
|---|---|---|
| Pearson correlation | Compute r from paired observations or sufficient totals | Correct paired data, calculation and interpretation of linear association |
| Interpretation | Explain direction and strength in context | Discuss the sample; avoid unsupported universal strength cutoffs |
| Scatterplots | Identify outliers, nonlinear patterns and restricted range | Explain why a single coefficient can hide structure |
| Significance/output | Read n, r and p-value; formulate a null hypothesis | Distinguish statistical significance from magnitude/importance |
| Spearman, if taught | Rank observations and correlate ranks | Correct tie handling; do not blindly use the no-ties shortcut |
| Causation/limitations | Give confounding and reverse-causality explanations | Correlation alone does not establish a causal effect |

**Pearson formula:** r = [nΣxy−ΣxΣy] / √{[nΣx²−(Σx)²][nΣy²−(Σy)²]}.

If a significance calculation is taught, the conventional Pearson test uses **t = r√[(n−2)/(1−r²)]**, df=n−2, under its statistical assumptions. Do not use significance to bypass checking the data/model.

**Q7 — calculate and interpret.** X = 1,2,3,4,5; Y = 2,4,5,4,5. Calculate Pearson r and comment.

**Answer:** n=5; Σx=15; Σy=20; Σx²=55; Σy²=86; Σxy=66. Numerator=30; denominator=√(50×30)=√1500. **r≈0.775**. There is a positive linear association in these five observations. It does not establish causation; the sample is small.

**Output question:** a fictional study reports r=0.62, p=0.003, n=20 between study hours and scores. Explain that the observed association is positive and statistically significant at 5% under the test assumptions. Do not say “hours cause 62% of marks.” In a simple linear regression with an intercept, r²≈0.384 describes the sample proportion of outcome variation accounted for by the fitted model, not a causal percentage.

## 🟠 4 Financial Management

The FM guide supports working-capital policies/requirements and M&A strategy, funding and valuation. **Corporate restructuring is explicitly in your test list but is not separately detailed in the guide.** Its specific breadth must come from class notes.

| Topic | Prepare | Representative question |
|---|---|---|
| Working-capital concepts | Gross/net working capital; liquidity/profitability; permanent/temporary needs; funding policies | “Compare aggressive and conservative approaches.” |
| Cash cycle and needs | Inventory, receivable and payable periods; forecast funding needs | “Calculate the cash-conversion cycle and suggest improvements.” |
| Management decisions | Collections/credit, inventory and payments; cost versus service risk | “Evaluate a credit-policy change.” Confirm which numerical models were taught. |
| Restructuring | Financial versus operational restructuring; recapitalisation, disposal, demerger/spin-off and reorganisation as taught | “Recommend a restructuring route for a distressed business.” |
| M&A logic | Acquisition/merger distinction; strategic motives, synergy, due diligence and integration | “Why might a deal destroy value despite revenue growth?” |
| M&A valuation/funding | Standalone values, synergy, premium, integration costs; cash/share funding | “Calculate buyer gain and maximum justifiable price under stated assumptions.” |

**Do not infer EOQ, cash-management models, share-exchange ratios or complex DCF are included simply because they fit the heading. Check lecture examples first.**

**Q8 — cash cycle.** Inventories TZS 60m, receivables 80m, payables 40m; annual cost of sales 360m, all-credit sales 480m, all-credit purchases 300m. Use 360 days.

**Answer:** inventory days=60/360×360=**60**; receivables=80/480×360=**60**; payables=40/300×360=**48**. Cash-conversion cycle=60+60−48=**72 days**. Cutting collection time by ten days releases approximately 480m/360×10=**TZS 13.33m**, if credit sales stay constant. Discuss customer and supplier consequences. Use purchases for payables when supplied.

**Q9 — acquisition value.** Buyer value TZS 500m, target standalone value 200m, synergy PV 60m. Buyer pays cash 230m; integration costs have PV 10m. Ignore tax and financing effects; all values are on a consistent basis.

**Answer:** premium=230−200=**30m**; net buyer gain=60−30−10=**20m**. Combined operating value before deducting payment/integration costs=500+200+60=**760m**. Value to buyer's owners after these deductions=760−230−10=**520m**, versus original 500m. Maximum zero-gain cash price=200+60−10=**250m**. A price below this is not automatically sensible if synergy assumptions are poor.

**Restructuring essay prompt:** a profitable company has a short-term debt crisis and a loss-making division. Compare debt rescheduling, new equity and disposal of the division. Discuss cash relief, value, control, creditors and implementation. Recommend a route using the facts rather than listing definitions.

## 🟡 5 Financial Reporting

Your “elements of financial statements” heading is **potentially much wider than definitions**. In the uploaded detailed syllabus, Topic 2 includes PPE, borrowing costs/grants, impairment, intangibles, leases, revenue/construction contracts, instruments, provisions, inventories and tax. Ask whether the test includes **all** of Topic 2 or just the standards taught so far.

| Area | Learn/do | Practice question |
|---|---|---|
| Framework | Purpose/users; qualitative characteristics; elements; recognition/measurement concepts | “Apply relevance and faithful representation to a reporting judgement.” |
| Concepts and principles | Going concern, accruals, materiality, consistency/comparability; prudence within the taught framework | “Identify the treatment and explain the principle.” |
| Elements | Assets, liabilities, equity, income/expenses; distinguish classification and recognition | “Does this event create an asset/liability? How is it reported?” |
| Adjustments | Accruals, prepayments, depreciation, inventory and other standards actually taught | “Adjust a trial balance and prepare statements/extracts.” |
| Complete answer | Workings, journal entries, statement effects and explanation | “Show both the amount and where it belongs.” |
| Standards scope | Match each Topic 2 standard to class notes and lecturer's instruction | “Which standards and depth are included in this first test?” |

**Q10 — adjustment drill.** Ignore tax. A machine cost TZS 12m at the start of the year, has a four-year life, nil residual and straight-line depreciation. Insurance TZS 2.4m paid on 1 October covers 12 months. Year-end is 31 December. Utilities of TZS 0.5m are unpaid and unrecorded.

**Answer:** annual depreciation **3m**, machine carrying amount **9m**; insurance expense for three months **0.6m**, prepayment **1.8m**; utilities expense/accrual **0.5m**. Explain accrual allocation and show:
- Dr depreciation expense 3m; Cr accumulated depreciation 3m.
- If insurance payment was initially expensed: Dr prepayment 1.8m; Cr insurance expense 1.8m.
- Dr utilities expense 0.5m; Cr accrued liabilities 0.5m.

**Full-statement practice question.** Use this small trial balance, in TZS millions:

| Account | Debit | Credit |
|---|---:|---:|
| Cash | 10 | — |
| Receivables | 8 | — |
| Opening inventory | 6 | — |
| Equipment at cost | 12 | — |
| Purchases | 20 | — |
| Rent expense | 4 | — |
| Wages | 5 | — |
| Capital | — | 25 |
| Revenue | — | 30 |
| Payables | — | 7 |
| Loan | — | 3 |
| Total | 65 | 65 |

Closing inventory is 7; depreciation 3; wages accrued 1. Ignore tax, interest, drawings and other adjustments. Prepare profit/loss and financial position.

**Check figures:** cost of sales=6+20−7=**19**; profit=30−19−4−6−3=**−2**. Assets=cash10+receivables8+inventory7+equipment net9=**34**. Liabilities=payables7+loan3+wage accrual1=**11**. Closing equity=25−2=**23**. **34=11+23**. This is a practice scaffold, not a forecast of paper complexity.

## 🗓️ 20–29 November execution plan

**Suggested time:** 2 hours on weekdays, 3 hours each weekend day: approximately **24 hours** over this ten-day window. Adjust to your availability; this is not exam weighting. Rotate all five instead of perfecting one subject before touching the others.

Each two-hour block: 15 min recall → 25 min repair/learning → 60 min fresh questions → 20 min marking/error correction. Take a short break between study blocks. Weekend third hour: revisit the weakest subject and clarify scope.

| Date | Main work | Second work / review | Finish with |
|---|---|---|---|
| Fri 20 Nov | Diagnose all five: one small question each | Ask for test order, FR standard list and PM scenario scope | Five baseline scores and red-topic list |
| Sat 21 Nov | Finance techniques: TVM, CAPM, risk/return | Probability/distribution questions; third hour weakest diagnostic | Marked numerical set and formula card |
| Sun 22 Nov | PM: high-low, regression/learning as confirmed | Relevant-decision scenarios; third hour FR scope/adjustments | Cost equation, decision answer and corrections |
| Mon 23 Nov | RM: Pearson calculation/output | Scatterplots, significance and limitations; brief earlier-topic recall | One hand calculation and one written interpretation |
| Tue 24 Nov | FM: working capital and cash cycle | Restructuring and acquisition-value case | Cash-cycle calculation and defensible deal decision |
| Wed 25 Nov | FR: framework/concepts | Adjustments/statements and confirmed Topic 2 standards | Balanced statements plus explanations |
| Thu 26 Nov | Timed finance-techniques set | PM timed set; mark both | Error list ranked by lost marks |
| Fri 27 Nov | Timed RM set | FM timed set; mark both | Corrected correlation and finance answers |
| Sat 28 Nov | Timed FR set | Repair weakest numerical areas; third hour mixed recall | Every subject has one marked timed set |
| Sun 29 Nov | Prioritise the actual first paper | Short formula/rule recall; selected error retries; materials check | Readiness check and test-week sequence |

If you cannot start on 20 November, merge diagnostics into the first session and cut repeated note-making before cutting all question practice. Once the real timetable arrives, move the first-tested subject to the final review slots.

### During test week

After each paper, record only one or two lessons, then move to the next subject. Use the available gap for its red/amber topics, not a full reread. Preserve the question/mark information you are permitted to retain for later revision.

## ✅ Readiness tracker

| Subject | Scope confirmed | Timed set completed | Score | Weakest skill / next question |
|---|---|---|---|---|
| Finance techniques | ☐ Title and distribution depth | ☐ | — | — |
| PM | ☐ Decision scenarios and estimation methods | ☐ | — | — |
| RM | ☐ Pearson/Spearman/testing/output | ☐ | — | — |
| FM | ☐ Restructuring and valuation depth | ☐ | — | — |
| FR | ☐ Specific Topic 2 standards | ☐ | — | — |

🔴 Cannot set up → one worked example, then fresh question.  
🟠 Can solve but inaccurate/slow → timed practice and targeted correction.  
🟢 Two different fresh sets at 80%+ with explanations → brief maintenance review.

The 80% threshold is a personal mastery target, not the institution's pass mark.

## ❓ Send or ask for these missing details

1. Exact date/time/order and duration of all five tests; marks, compulsory/optional format and permitted aids.
2. Finance-techniques official title, distribution types and lecture examples.
3. PM's precise decision scenarios: relevant costing, CVP, risk, constraints, pricing? Which estimation techniques?
4. RM's correlation methods, significance calculations and software-output requirements.
5. FM's restructuring forms, M&A valuation methods and working-capital models.
6. FR's precise “elements” standards and whether full statements/cash flows are included.

No need to wait for all answers before beginning the overlapping fundamentals above.

## 📚 Evidence and sources

- **Your five-subject topic table**, supplied in this conversation: controlling short-term scope; start date supplied by you.
- [FM guide](<1.  MODULE GUIDELINE OF FM  2026, MOGA1.docx>): working capital, financing requirements, M&A strategy/funding/valuation; corporate restructuring not separately detailed.
- [PM guide](<ASSESSMENT PLAN & MODULE GUIDE-PERFORMANCE MNG-ACG09104-2022-2023.pdf>): estimation and decision techniques in the learning tables; older guide, so no current test-format guarantee.
- [FR syllabus](<FINANCIAL REPORTING SYLLABUS.docx>): Topics 1–3; broad meaning of statement elements and preparation.
- [FR assessment allocation](<ALLOCATION   OF TOPICS  MODULE GUIDE AND ASSESSMENT PLAN    FINANCIAL REPORTING.docx>): framework and standard-level coursework allocation; not an exact first-test blueprint.
- Repository listing checked **20 November 2026**: the four source documents retain the same blob hashes as those previously read. No dedicated finance-techniques/RM guides or test papers were present in this folder.

Worked examples, numerical data, question formats, time allocations and suggested priorities were created for practice. They are not actual examination questions or official marking schemes.
