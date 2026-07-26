---
tags: [learning-curve, feedback, critique, process, ai-prompts]
aliases: [The Cold Read Protocol, Harsh Feedback, How To Ask]
---

# THE COLD READ PROTOCOL

> Vague requests get polite answers, and polite answers are worthless.

## Why Most Feedback Is Useless

Ask *"is this good?"* and you have asked a question with a social cost attached to every honest answer. Human readers manage that cost by softening. So do I — a model trained on human text inherits the same reflex, and a warm answer costs me nothing while costing you a month.

The fix is not to ask people to be meaner. It is to **ask questions whose honest answer carries no social cost.**

| Useless | Useful | Why |
| --- | --- | --- |
| Is this good? | What is the weakest line here, and why? | Presupposes a weakest line. Everything has one |
| Do you like the opening? | At which exact sentence would a saturated judge stop reading? | Asks for a location, not a verdict |
| Any suggestions? | Name three things to cut. | Forces subtraction, the hard direction |
| Is the character working? | What does this character want that they never say? | Diagnostic, not evaluative |
| Is the prose too much? | Which sentence is at a different altitude from its neighbours? | Comparative, checkable |
| Is it ready? | Score it on the nine axes and justify every score under 4 | Removes the yes/no entirely |

The pattern: **presuppose the fault, ask for its location, forbid the summary.**

## The Four Standing Prompts

Copy verbatim. Vagueness re-enters the moment you paraphrase.

**1. The Saturated Judge**
> Read only the first 200 words. You are a Commonwealth Prize judge on story 140 of 200 today. State the exact sentence at which you would stop reading and why. Do not list strengths. Do not encourage me.

**2. The Weakest Line**
> Quote the single weakest line in this scene and explain the specific mechanism of its failure — not "it's vague," but what it does to the reader's attention. Then quote the second weakest.

**3. The Three Cuts**
> Name three things in this scene to cut, ranked by how much the scene improves. For each, tell me what is genuinely lost. If cutting loses nothing, say so plainly.

**4. The Unearned Claim**
> Find every sentence that asserts something the story has not yet bought the right to assert. Quote each and name the scene that would have to exist to earn it.

## Receiving It

Three rules, in order of how often they are broken.

**Separate the diagnosis from the prescription.** A reader saying *"I got bored here"* is almost always right. The same reader saying *"you should add a flashback"* is usually wrong. Take every diagnosis seriously; take no prescription on trust — including mine.

**Do not defend.** The explanation you are about to give is not available to the judge. If a scene needs defending, the scene needs rewriting.

**Sort by altitude before acting.** A hard critique arrives as an undifferentiated pile. Route each item to its pass in [[The Five Passes]] before touching anything. Most despair after a brutal read is not caused by the severity — it is caused by trying to fix nine things at five different altitudes simultaneously.

## A Warning About Me

I will drift warm across a long session. If you have been working with me for an hour and my feedback has gradually become more encouraging, that is not the draft improving — it is conversational momentum. **Re-issue prompt 1 verbatim to reset.** Treat any assessment of mine that contains no specific quoted line as noise.

I am also structurally unable to give you [[The Five Passes|Pass 5]]. Pass 5 is seven days of not looking, and I have no memory of the draft between sessions and no attention to lose. I can simulate a saturated judge; I cannot be a tired one.

---

## For Kalemie

The draft already contains a working version of this protocol — and it is better than most writers ever build.

The `> [!AI]` callouts in [[KALEMIE-Draft_with_AI_Questions|the master draft]] are genuine cold-read questions. *"What single line in this scene is the weakest and why?"* (opening) is prompt 2 almost exactly. *"Is this too neat?"* (birthday scene) and *"Does it earn its weight or does it front-load too much?"* (first line) presuppose the fault correctly and refuse the yes/no.

Three of them are worth noting as unusually good, because they name the risk in the writer's own terms and so cannot be answered with reassurance:

- *"Is withholding Djamela's name effective dread, or does it feel like a writer's trick?"*
- *"How do we handle this line without making Djamela feel like a prophecy rather than a person?"*
- *"The draft cuts here — what is being avoided, and should it be faced?"*

That last one is the single best question in the vault. It is aimed at Scene 7's thin envelope, and it is the exact question [[Kalemie — Standing Diagnosis|the diagnosis]] arrives at independently for Scene 6.

**Two gaps in the current setup:**

1. **The questions are per-scene; nothing is per-story.** Every callout asks about the scene it sits under, so no question can catch a fault that only exists *between* scenes — which is precisely where the double start, the age contradiction and the missing ending live. The Structural Notes block at the end is the right instinct, but its eight questions are thematic ("how much colonial history should be explicit?") rather than diagnostic. **Add prompt 1 and prompt 4 at story level.**
2. **No question asks anything to be cut.** Across roughly forty questions in the draft, not one is *"what should go?"* They ask whether things land, whether they earn their weight, whether they are too subtle — all questions about improving what exists. This is why the draft has two openings: the apparatus was never pointed at subtraction. **Prompt 3 is the missing one**, and it is the one that unblocks [[The Five Passes|Pass 1]].

## Questions for AI

1. Apply prompt 1 to the current opening. Then apply it again to the draft as it would read with Scene 1 deleted, and tell me which version survives longer.
2. Apply prompt 3 (three cuts, ranked) to every scene in turn. Collect the results into a single ranked cut list for the whole story.
3. Apply prompt 4 at story level: which claims does Kalemie make that it has not yet bought the right to make?
4. Review my `[!AI]` callouts and rewrite any that can be answered with reassurance so that they presuppose a fault instead.
5. Tell me when my feedback has drifted warm — quote a specific assessment of yours from this session that contained no quoted line as evidence.
