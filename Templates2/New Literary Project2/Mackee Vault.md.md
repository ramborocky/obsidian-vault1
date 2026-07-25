
## 1. INCITING INCIDENT
> The INCITING INCIDENT radically upsets the balance of forces in the protagonist's life.

**For ${storyName}:** 

## 2. PROGRESSIVE COMPLICATIONS
> A progression of conflict that builds to the end of the line.

**For ${storyName}:** 

## 3. CRISIS
> The ultimate decision the protagonist must make.

**For ${storyName}:** 

## 4. CLIMAX
> The final action that creates absolute and irreversible change.

**For ${storyName}:** 

## 5. RESOLUTION
> The material after Climax.

**For ${storyName}:** 

## Three-Act Template
| Act | Percentage | Purpose |
|-----|------------|---------|
| Act 1 | 25% | Setup, Inciting Incident |
| Act 2 | 55% | Progressive Complications |
| Act 3 | 20% | Crisis, Climax, Resolution |

## Questions for AI
1. What is my Inciting Incident?
2. How do I build Progressive Complications?
3. What is my protagonist's Crisis Decision?
4. What is the Climax action?
`);

// 21. Create McKee - Scene Design Files
await createFile(`${projectPath}/08 McKee - Scene Design/McKee - Scene Analysis Method.md`, `---
tags: [mckee, scene-design]
---

# MCKEE — SCENE ANALYSIS METHOD

## Five-Step Process

### Step 1: Define Conflict
- Who drives the scene?
- What does the protagonist want? (Infinitive: "to do X")
- What forces of antagonism block this?

### Step 2: Note Opening Value
- Identify the value at stake
- Note its charge (positive/negative)

### Step 3: Break the Scene into Beats
- A beat = exchange of action/reaction
- Name the subtextural action with an active gerund phrase
- Example: "Begging" / "Ignoring"

### Step 4: Note Closing Value
- Compare to opening value
- If the same, nothing happened
- If different, scene turned

### Step 5: Locate Turning Point
- Where did the gap open?
- What changed?

## For ${storyName}
### Scene Analysis Template
| Beat | Action | Reaction | Subtext |
|------|--------|----------|---------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

## Questions for AI
1. Is the conflict in this scene clear?
2. Does the value change by the end?
3. What are the beats?
4. Where is the Turning Point?
`);

// 22. Create McKee - Exposition Files
await createFile(`${projectPath}/09 McKee - Exposition/McKee - Show Don't Tell.md`, `---
tags: [mckee, exposition]
---

# MCKEE — SHOW, DON'T TELL

## The Principle
> **Dramatize exposition.**

## The Rule
> **Convert exposition to ammunition.**

## The Warning
> **California scenes:** Two characters who hardly know each other sit down and immediately discuss their deep, dark secrets. Forced and false.

## The Key Question
> **Reveal only that exposition the audience absolutely needs and wants to know and no more.**

## Two Principles
1. Never include anything the audience can reasonably assume
2. Never pass on exposition unless confusion would result

## The Pacing Rule
- Least important facts early
- Next most important later
- Critical facts last

## Secrets are the Critical Pieces
> The painful truths characters do not want known.

## Voice-Over Narration
- Test: "If I stripped the voice-over out, would the story still be well told?"
- If yes → Keep it in

## Questions for AI
1. What exposition is essential?
2. Is it being dramatized or told?
3. What is being saved for later?
4. How can exposition become ammunition?
`);

// 23. Create McKee - Problems Files
await createFile(`${projectPath}/10 McKee - Problems & Solutions/McKee - Mystery vs Suspense vs Dramatic Irony.md`, `---
tags: [mckee, problems]
---

# MCKEE — MYSTERY, SUSPENSE, DRAMATIC IRONY

## Three Ways to Hold Audience Interest

### 1. MYSTERY
> In Mystery the audience knows less than the characters.

- Curiosity alone
- Facts are concealed
- Red herrings mislead

### 2. SUSPENSE
> In Suspense the audience and characters know the same information.

- Curiosity + Concern
- Outcome uncertain
- 90% of films

### 3. DRAMATIC IRONY
> In Dramatic Irony the audience knows more than the characters.

- Concern alone
- Dread/compassion

## For ${storyName}
**Primary Mode:** 

**Where to switch modes:** 

## Questions for AI
1. Does my story use mystery, suspense, or dramatic irony?
2. How can I mix modes for more tension?
3. Where should I reveal information?
`);

// 24. Create McKee - Text Files
await createFile(`${projectPath}/11 McKee - Text/McKee - Dialogue Principles.md`, `---
tags: [mckee, text]
---

# MCKEE — DIALOGUE PRINCIPLES

## Dialogue is Not Conversation
> Screen dialogue must have the swing of everyday talk but content well above normal.

## Three Requirements
1. **Compression:** Maximum in fewest words
2. **Direction:** Each exchange must turn the scene
3. **Purpose:** Each line must execute a step in design

## The Visual Principle
> Write for the eye first. Dialogue is the last layer added.

## Suspense Sentence
> Meaning is delayed until the very last word.

**Example:**
> "If you didn't want me to do it, why'd you give me that..."
> Look? Gun? Kiss?

## The Rule
> Never write a line of dialogue when you can create a visual expression.

## Questions for AI
1. Is this dialogue necessary, or can it be visual?
2. Does each line turn the scene?
3. Is it compressed?
4. Does it sound like the character?
`);

// 25. Create McKee - Writer's Method
await createFile(`${projectPath}/12 McKee - Writer's Method/McKee - Inside Out Method.md`, `---
tags: [mckee, method]
---

# MCKEE — WRITING FROM THE INSIDE OUT

## The Method
1. **Research:** Memory, imagination, fact
2. **Step-Outline:** One- or two-sentence descriptions of each scene
3. **Pitch:** Tell the story to friends and watch their reactions
4. **Treatment:** Expand each scene to a paragraph (60-90 pages)
5. **Screenplay:** Add dialogue and description

## The Rule
> The premature writing of dialogue chokes creativity.

## The Key
> Work from the inside out: start with the story, then add the words.

## For ${storyName}
### Step-Outline
1. [Scene 1]
2. [Scene 2]
3. [Scene 3]

### Treatment Notes
[Expand scenes here]

## Questions for AI
1. Is my story working at the step-outline level?
2. What scenes are weak?
3. What needs to be added or cut?
`);

// 26. Create Revision Files
await createFile(`${projectPath}/13 Revision/Revision Checklist.md`, `---
tags: [revision, checklist]
---

# REVISION CHECKLIST

## McKee Structure
- [ ] Inciting Incident is effective
- [ ] Progressive complications build
- [ ] Crisis is a true dilemma
- [ ] Climax is absolute and irreversible
- [ ] Resolution wraps up

## McKee Character
- [ ] Protagonist has clear desire
- [ ] Forces of antagonism are powerful
- [ ] True character is revealed through choice
- [ ] Character arc is complete

## McKee Meaning
- [ ] Controlling Idea is clear
- [ ] Idea and Counter-Idea are balanced
- [ ] Didacticism is avoided

## McKee Scene Design
- [ ] Every scene turns
- [ ] Gaps are present and progressive
- [ ] Text and subtext are distinct

## McKee Text
- [ ] Dialogue is compressed and directed
- [ ] Visual before verbal
- [ ] Suspense sentences used

## Language
- [ ] Average sentence length < 20
- [ ] Labeling words eliminated
- [ ] Verb "to be" minimized
- [ ] Sensory references included
- [ ] Metaphors earned

## Ending
- [ ] Ending is surprising but inevitable
- [ ] All questions answered
- [ ] Global reflection

## Questions for AI
1. What is the weakest part of this story?
2. What is the strongest?
3. What am I missing?
4. What would McKee say?
`);

// 27. Create AI Prompts
await createFile(`${projectPath}/14 AI Prompts/AI - Scene Generation.md`, `---
tags: [ai, prompt]
---

# AI — SCENE GENERATION PROMPT

## Story Context
- **Story:** ${storyName}
- **Characters:** 
- **Setting:** 
- **Time:** 

## Scene Goal
[What needs to happen?]

## McKee Requirements
- **TRD Type:** 
- **Gap Element:** 
- **Value at Stake:** 
- **Conflict Level:** 
- **Turning Point:** 

## Desired Outcome
[What changes by the end?]

## Generate Scene
[Write the scene here.]

## Checklist
- [ ] McKee's gap is present
- [ ] Scene turns (value changes)
- [ ] True character revealed through choice
- [ ] Sensory references included
- [ ] Voice consistent
- [ ] Average sentence length < 20
`);

await createFile(`${projectPath}/14 AI Prompts/AI - Scene Analysis.md`, `---
tags: [ai, prompt]
---

# AI — SCENE ANALYSIS PROMPT

## Scene Text
[Paste your scene here]

## McKee Analysis

### 1. Structure
- What is the Inciting Incident?
- What is the Turning Point?
- Does the scene turn?

### 2. Gap
- What does the character expect?
- What actually happens?
- What is the gap?

### 3. Conflict
- What level(s) of conflict?
- Is it progressive?

### 4. Character
- What is revealed about true character?
- What choices are made under pressure?

### 5. Meaning
- What value changes?
- Is the controlling idea advanced?

## Recommendations
[List revisions needed]

## Questions for AI
1. Is the gap clear?
2. Does the scene turn?
3. What is revealed about character?
4. How can the scene be improved?
`);

// 28. Create Writing Constitution
await createFile(`${projectPath}/00 Dashboard/Writing Constitution.md`, `# THE WRITING CONSTITUTION (McKee)

We write scenes, not explanations.

Conflict is to story what sound is to music.

Meaning produces emotion.

Every scene must turn.

Show, don't tell.

Save the best for last.

The gap is where story lives.

True character is revealed through choice under pressure.

The more powerful the antagonism, the more powerful the protagonist.

Write from the inside out: story first, words second.

---

*Read before every writing session.*
`);

// 29. Success Message
new Notice(`✅ MCKEE VAULT CREATED!

Story: ${storyName}
Genre: ${genre}
Structure: ${structure}
Characters: ${mainChar}, ${antagonist}${supportingList.length ? ', ' + supportingList.join(', ') : ''}

📁 Created: ${folders.length} folders, 25+ files

🎯 Next Steps:
1. Open the Dashboard
2. Fill in your story details
3. Read the Writing Constitution
4. Start writing!`);
`);

// ============================================
// END OF TEMPLATE
// ============================================