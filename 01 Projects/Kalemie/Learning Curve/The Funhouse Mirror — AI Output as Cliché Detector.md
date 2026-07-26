---
tags: [learning-curve, ai, cliche, revision, clark]
aliases: [The Funhouse Mirror, Cliché Detector, AI as Analyst]
---

# THE FUNHOUSE MIRROR — AI OUTPUT AS CLICHÉ DETECTOR

> Source: Lynda Clark, *Towards "Creativity Amplification"* (NAWE, *Writing in Practice* vol. 7) — [InGAME, University of Dundee](https://github.com/IngameDundee/CreativityAmplification)

**The most useful idea in the entire Dundee repository, and it takes one sentence: whatever the machine produces without being pushed is, by definition, the cliché.**

## Where It Comes From

Oscar Sharp and Ross Goodwin trained a neural network on science-fiction screenplays and filmed the result as the short *Sunspring* (2016). The interesting finding was not that a machine wrote a script. It was what the actors did with it: given a nonsensical text, they spontaneously performed it as a love triangle. Sharp's explanation — that the pattern came from the corpus of films everyone in the room had absorbed — gives the technique its name. Running material through a generative system holds a **funhouse mirror** up to a body of cultural content and shows you what is actually in it.

Clark then ran the experiment on her own novel, feeding its opening lines to GPT-2. What came back was unremarkable — except for one thing she noticed across three separate generated texts from two different systems: a recurring dialogue shape in which a line is answered by its own inversion. *You'd better be good* answered by *I'm not bad*. Statement, then negated mirror-image, producing the surface impression of wit.

Her observation about it is the valuable part: this was a cliché **nobody had ever warned her about** in her training as a writer, and having seen it once she could not stop noticing it.

## Why It Works

A language model has no taste and no intention. It returns the highest-probability continuation of your text. High probability *is* the operational definition of cliché — the thing most likely to follow, the move the corpus has made ten thousand times.

This makes generative output nearly worthless as prose and unusually valuable as a **diagnostic instrument**. It is the only tool that will reliably tell you what the average version of your sentence looks like.

## The Technique

1. Feed the model your setup — a scene's opening, a character in a situation, the first half of a line of dialogue.
2. Ask for continuations. Several.
3. **Read them as a list of moves to avoid.** Not as drafts, not as inspiration.
4. Anything the model reaches for unprompted is the default. Your version must not be it.

The inversion is the whole method: the standard use of AI in writing is to generate text and keep the good parts. This is the opposite — generate text and **delete every part of your own draft that resembles it.**

## The Companion Warning

Clark's honest account of her own reaction matters as much as the technique. Her first response to the generated text was that the machine had captured something true about her protagonist. On reflection she recognised this as a feeling, not an observation — the same effect Sharp's actors had when they found a love triangle in noise. See [[The ELIZA Effect and the Vestments of Plausibility]].

So: the mirror is useful, and you will be inclined to see more in it than is there. Use it to find your defaults. Do not use it to find out whether your writing is good.

---

## For Kalemie

Kalemie is a story about a boy in Kalemie, DRC, written in a register built from physics vocabulary and unitalicised Swahili, French and Lingala. A language model's defaults for "African short story about a girl who dies" are going to be lurid, and that is exactly what makes the mirror worth running here. **What comes back is a map of everything a Commonwealth judge has already read this year.**

Three specific places to run it, chosen because each is where the draft is most at risk of arriving at a default without noticing:

**1. D'juma's lake speech.** *Some women resemble the lake — cold, deep, swallows things, keeps secrets.* This is the story's governing metaphor and it is also, structurally, the wise-elder-delivers-the-theme move. Feed a model *"an old man by Lake Tanganyika tells a boy what women are like"* and see how close what returns is to what is on the page. If it is close, that is the strongest possible argument for [[Kalemie — Standing Diagnosis|the cut the diagnosis already calls for]] — and the argument arrives as evidence rather than opinion.

**2. Jean Luc's dialogue.** *Je m'appelle Jean Luc. Tu es d'où, ma belle?* The predator-in-the-luxury-car is one of the most heavily rehearsed figures in contemporary fiction. The draft's own callout asks whether he is a "credible threat, not cartoon villain" — the mirror answers that question empirically. Note that the draft's best Jean Luc moment, where he completes Daudi's Sunday-school line about not talking to strangers, is precisely the moment **no model would generate**, because it inverts the expected move. That is the register the whole character should be held to.

**3. Djamela's dialogue in Scene 4.** *I want to control things; I want to conquer like the Europeans* and *we can beat them at their own game — just followers*. The draft's own question — "is this too explicit for her character?" — is a cliché question wearing a character-motivation costume. Run the mirror. A thirteen-year-old girl stating her thesis about postcolonial aspiration is a highly probable continuation; what she would actually say is not.

Note the pattern across all three: **the mirror is most useful exactly where the draft is most explicit about its own themes.** That is not a coincidence. Explicitness and probability are the same failure seen from two angles, which is why Gardner's [[Show, Don't Tell — Needless Explanation|warning about explanation]] and this technique arrive at the same sentences.

## Questions for AI

1. Generate three continuations of D'juma's lake speech without reading the draft's version. Then show me the draft's version beside them and tell me honestly how far apart they are.
2. Do the same for Jean Luc's first three lines of dialogue, and for Djamela's Scene 4 speech about conquering.
3. Across the whole draft, identify every passage you would have generated by default given the setup. Those are the candidate clichés — list them with line numbers, no softening.
4. Identify the passages you would **not** have generated. Those are the story's actual signature — what do they have in common, and how do I get more of it?
5. Watch for the inversion-cliché Clark found (a line answered by its own negation) — does it appear anywhere in Kalemie's dialogue?
