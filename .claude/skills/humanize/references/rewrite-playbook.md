# Rewrite playbook

One entry per pattern: what it looks like, what to do, and a worked example. Examples are
invented, not lifted from any source.

The rule that governs all of them, restated: **a tell is a symptom of a missing fact.** If you
can supply the fact, supply it. If you can't, cut the sentence. If you can neither supply it
nor cut it, mark it and tell the user. Do not invent it, and do not blur it into something
vaguer that no longer trips the pattern.

---

## Participial tail

**Signature:** sentence ends with a comma and an `-ing` verb passing judgment.

> The co-op opened a second warehouse in 1994, expanding its reach across the county and
> cementing its role as the region's primary grain buyer.

Cut at the comma. Then ask what the tail was pretending to know.

> The co-op opened a second warehouse in 1994.

If the second clause matters, it needs to become a claim with evidence behind it:

> The co-op opened a second warehouse in 1994. By 1998 it was buying roughly 70% of the
> county's grain.

**Do not** rewrite it as "which expanded its reach and cemented its role." Same content, same
absence of evidence, one fewer regex hit. That is laundering.

---

## Legacy paragraph

**Signature:** a paragraph, usually last in a section, about significance, enduring impact, or
what the thing symbolizes.

> The festival stands as a testament to the community's resilience, reflecting a broader
> revival of rural cultural traditions and underscoring the enduring importance of shared
> public space.

Delete it. Nothing is lost, because nothing was there. If the significance is genuinely
documented, replace the whole paragraph with the documentation:

> Attendance grew from 400 in 2009 to 11,000 in 2024, and three neighboring towns have since
> started their own.

---

## Copula avoidance

**Signature:** a marketing verb where "is" or "has" belongs.

> The archive serves as the primary repository for the family's correspondence and features
> over 4,000 items spanning six decades.

> The archive holds about 4,000 letters written between 1890 and 1950.

Note what happened: restoring the plain verb exposed "spanning six decades" as vaguer than the
actual dates, so the dates went in.

---

## Negative parallelism

**Signature:** "not just X, but Y" / "not X, but Y" / "X rather than Y".

> The renovation wasn't just a structural repair — it was a statement about what the town
> valued.

The first half exists only to be corrected. Drop it and commit:

> The town spent more on the renovation than on its schools that year.

In fiction, leave these in dialogue. Characters talk like this. Narration usually shouldn't.

---

## Rule of three

**Signature:** everything comes in threes, mechanically.

> The album is raw, ambitious, and deeply personal, drawing on gospel, punk, and field
> recordings, and it established her as a fearless, restless, and singular voice.

Break the count and cut the adjectives that aren't doing work:

> The album is raw and unfinished-sounding on purpose, built from gospel samples and
> tape hiss she recorded in her mother's kitchen.

---

## Puffery

**Signature:** boasts, vibrant, nestled, rich, renowned, in the heart of, groundbreaking.

> Nestled in the heart of the valley, the town boasts a vibrant arts scene and a rich
> agricultural heritage.

> The town is in the valley. It has two galleries and a Saturday market, and most of the land
> around it is still in hops.

---

## Vague attribution

**Signature:** experts, observers, critics, industry reports, widely regarded.

> Experts have noted that the technique is widely regarded as a turning point in the field.

Name them or drop it:

> In a 1974 review, Halloway called the technique "the first real break with the Vienna
> method."

If you cannot find who said it, the claim does not survive.

---

## Coverage padding

**Signature:** listing the kinds of outlets that covered something instead of what they said.

> Her work has been profiled in national media outlets and several trade publications, and she
> maintains an active social media presence.

> *The Times* reviewed her 2019 show; the review called the sequencing "deliberately
> unhelpful." She posts new work on Instagram roughly weekly.

If you can't say what the coverage contained, you probably haven't read it.

---

## "Faces challenges" coda

**Signature:** "Despite its [good thing], X faces several challenges..." then "Despite these
challenges..." then hope.

Delete the section. Real, specific, sourced problems belong in the body section they concern,
where they can be checked.

---

## Definitional lead

**Signature:** the first sentence defines the title rather than introducing the subject.

> "Community land trusts" refers to a model of collective land ownership in which...

> A community land trust owns land permanently and leases it to residents, which keeps the
> houses on it cheap after the first sale.

---

## Elegant variation

**Signature:** the same thing renamed every time it appears.

> The dockworkers struck in March. These laborers held out for nine weeks; by May the
> stevedores had lost public sympathy, and the strikers returned in June.

> The dockworkers struck in March and held out nine weeks. By May they had lost public
> sympathy. They went back in June.

---

## Flat rhythm

**Signature:** every sentence the same length and shape, every paragraph the same size.

> The company was founded in 1962 by three engineers from the aerospace industry. It initially
> produced hydraulic components for agricultural machinery. The business expanded into
> automotive parts during the 1970s, which proved highly profitable. By 1985 it employed over
> 300 people at two facilities in the region.

Vary it. Let one sentence be four words.

> Three aerospace engineers founded the company in 1962 to make hydraulic parts for tractors.
> Then came the seventies, and cars. By 1985 it had 300 employees across two plants, and none
> of the founders were still there.

---

## Em dash habit

**Signature:** several spaced em dashes doing ordinary comma work.

> The proposal — which had been in draft for two years — was rejected in a single session —
> a result nobody had predicted.

Keep at most one, and pick the right mark for each job:

> The proposal, in draft for two years, was rejected in a single session — a result nobody
> had predicted.

---

## Bold-header list

**Signature:** marker, bolded header, colon, description, repeated.

> - **Cost**: The system is cheaper than the alternative.
> - **Speed**: It processes claims faster.
> - **Reliability**: It fails less often.

Three sentences wearing a costume. Make it prose:

> It costs less than the alternative, processes claims faster, and fails less often.

Keep the list only when items are genuinely lookup-oriented — and even then, drop the bold.

---

## Verification checklist

After a pass, confirm:

- [ ] Density dropped (re-run the scanner)
- [ ] Word count did not drop more than ~30% — a big drop means you cut instead of replacing
- [ ] Nothing specific was replaced by something vaguer
- [ ] No fact was invented to fill a gap; gaps are marked and reported
- [ ] Sentence lengths vary when read aloud
- [ ] The writer's own habits survived
- [ ] Any provenance markers found were removed *and* the attached citations checked
