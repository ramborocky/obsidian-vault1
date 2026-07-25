// ============================================
// LITERARY INTELLIGENCE SYSTEM - PROJECT CREATOR
// ============================================

// 1. Get the story name
const storyName = await tp.system.prompt("Enter story name (e.g., Kalemie):");
if (!storyName) return;

// 2. Get the main character
const mainChar = await tp.system.prompt("Enter main character name (e.g., Daudi):");
if (!mainChar) return;

// 3. Get antagonist
const antagonist = await tp.system.prompt("Enter antagonist name (e.g., Jean Luc):");
if (!antagonist) return;

// 4. Get supporting characters (comma separated)
const supporting = await tp.system.prompt("Enter supporting characters (comma separated, e.g., Djamela, D'juma, Morisho):");

// 5. Split supporting characters
const supportingList = supporting ? supporting.split(',').map(s => s.trim()) : [];

// 6. Define the project structure
const projectPath = `01 Projects/${storyName}`;

// 7. Define folders
const folders = [
    `${projectPath}`,
    `${projectPath}/00 Dashboard`,
    `${projectPath}/01 Story Brain`,
    `${projectPath}/02 Characters`,
    `${projectPath}/03 World`,
    `${projectPath}/04 Themes & Symbols`,
    `${projectPath}/05 Plot Engine`,
    `${projectPath}/06 Scenes`,
    `${projectPath}/07 Narrative Craft`,
    `${projectPath}/08 Language`,
    `${projectPath}/09 AI Laboratory`,
    `${projectPath}/10 Research`,
    `${projectPath}/11 Revision`,
    `${projectPath}/12 Submission`
];

// 8. Create folders
for (const folder of folders) {
    const exists = await app.vault.adapter.exists(folder);
    if (!exists) {
        await app.vault.createFolder(folder);
    }
}

// 9. Create Dashboard
const dashboardContent = `---
tags: [dashboard, ${storyName.toLowerCase()}]
story: ${storyName}
---

# 🎯 DASHBOARD: ${storyName}

## Current Status
- **Draft:** [Not Started/First Draft/Revising/Final]
- **Word Count:** 0
- **Target Competition:** Commonwealth Short Story Prize
- **Deadline:** 
- **Revision Number:** 0

## Today's Goals
- [ ] Write 500 words
- [ ] Revise Scene 1
- [ ] Check character arcs

## Recent Activity
- **Last Session:** 
- **Next Session:** 

## Quick Links
- [[01 Story Brain]]
- [[02 Characters]]
- [[06 Scenes]]

## Characters
\`\`\`dataview
TABLE role as "Role", status as "Status"
FROM "${projectPath}/02 Characters"
WHERE file.name != "00 Dashboard"
SORT file.name ASC
\`\`\`

## Scenes
\`\`\`dataview
TABLE status as "Status", words as "Words"
FROM "${projectPath}/06 Scenes"
WHERE file.name != "00 Dashboard"
SORT file.name ASC
\`\`\`

## Revision Checklist
- [ ] Narrative question answered?
- [ ] All character arcs complete?
- [ ] All subplots resolved?
- [ ] Red herrings accounted for?
- [ ] Confusion and betrayal integrated?
- [ ] Slow reveals in place?
- [ ] Average sentence length < 20?
- [ ] Sensory references checked?

## Writing Constitution
*We write scenes, not explanations. Objects carry emotion. Dialogue reveals class. Every page must surprise. Every scene changes somebody. Readers infer more than they are told. The setting is a character. Local language is never italicized. Every symbol evolves. Beauty emerges from specificity. Cut abstractions. Trust the reader. Earn every metaphor.*
`;

await app.vault.create(`${projectPath}/00 Dashboard/Dashboard.md`, dashboardContent);

// 10. Create Story Brain
const storyBrainContent = `---
tags: [story-brain, ${storyName.toLowerCase()}]
story: ${storyName}
---

# 🧠 STORY BRAIN: ${storyName}

## One Sentence
[Summarize the story in one sentence]

## One Paragraph
[Summarize in one paragraph]

## One Page
[Summarize in one page]

## Core Elements
- **Genre:** Literary Fiction / Posthumanist Existential Satire
- **Narrative Question:** 
- **Theme:** 
- **Time Span:** 
- **Setting:** 

## Characters
- [[02 Characters/Protagonist - ${mainChar}]]
- [[02 Characters/Antagonist - ${antagonist}]]
${supportingList.map(c => `- [[02 Characters/Supporting - ${c}]]`).join('\n')}

## Structure
- **Beginning:** 
- **Middle:** 
- **End:** 

## Themes
- [[04 Themes & Symbols/Entropy]]
- [[04 Themes & Symbols/Water]]
- [[04 Themes & Symbols/Memory]]

## Symbols
- [[04 Themes & Symbols/Rust]]
- [[04 Themes & Symbols/Luxury]]
- [[04 Themes & Symbols/Mirrors]]

## Plot Points
- **TRD 1:** 
- **TRD 2:** 
- **TRD 3:** 
- **TRD 4:** 
- **TRD 5:** 

## Questions for AI
1. What is the strongest image in this story?
2. What contradictions does the protagonist have?
3. What scene best reveals the theme?
4. What symbol can return at the end?
5. How can I increase immersion?
6. What emotion is missing?
`;

await app.vault.create(`${projectPath}/01 Story Brain/Story Brain.md`, storyBrainContent);

// 11. Create Character Files

// Protagonist
const protagonistContent = `---
tags: [character, protagonist, ${storyName.toLowerCase()}]
story: ${storyName}
role: Protagonist
---

# CHARACTER: ${mainChar}

## Identity
- **Name:** ${mainChar}
- **Role:** Protagonist
- **Age:** 
- **Occupation:** 

## Core Wound
[What trauma shaped them?]

## Lie They Believe
[What false belief drives them?]

## Need
[What do they truly need?]

## Want
[What do they think they want?]

## Contradiction
[What makes them complex?]

## Fear
[What terrifies them?]

## Secret
[What do they hide?]

## Speech
[How do they talk?]

## Habits
[What do they do repeatedly?]

## Objects
[What objects define them?]

## Color
[What color represents them?]

## Smell
[What do they smell like?]

## Religion
[What do they believe?]

## Dream
[What is their deepest desire?]

## Shadow
[What is their dark side?]

## Arc
[How do they change?]

## Relationship Web
- **[[${antagonist}]]:** 
${supportingList.map(c => `- **[[${c}]]:** `).join('\n')}

## Scene Tracker
[Which scenes are they in?]

## Quotes
[Key lines they say]

## Questions for AI
1. What contradictions does this character have?
2. What scene best reveals their core wound?
3. What secret have I forgotten?
4. How do they change by the end?
5. What object should return later?
6. Does their dialogue sound authentic?
`;

await app.vault.create(`${projectPath}/02 Characters/Protagonist - ${mainChar}.md`, protagonistContent);

// Antagonist
const antagonistContent = `---
tags: [character, antagonist, ${storyName.toLowerCase()}]
story: ${storyName}
role: Antagonist
---

# CHARACTER: ${antagonist}

## Identity
- **Name:** ${antagonist}
- **Role:** Antagonist
- **Age:** 
- **Occupation:** 

## Core Wound
[What trauma shaped them?]

## Lie They Believe
[What false belief drives them?]

## Need
[What do they truly need?]

## Want
[What do they think they want?]

## Contradiction
[What makes them complex?]

## Fear
[What terrifies them?]

## Secret
[What do they hide?]

## Speech
[How do they talk?]

## Habits
[What do they do repeatedly?]

## Objects
[What objects define them?]

## Color
[What color represents them?]

## Smell
[What do they smell like?]

## Religion
[What do they believe?]

## Dream
[What is their deepest desire?]

## Shadow
[What is their dark side?]

## Arc
[How do they change?]

## Relationship Web
- **[[${mainChar}]]:** 
${supportingList.map(c => `- **[[${c}]]:** `).join('\n')}

## Scene Tracker
[Which scenes are they in?]

## Quotes
[Key lines they say]

## Questions for AI
1. What makes this antagonist sympathetic?
2. What scene best reveals their motivations?
3. What secret do they hide?
4. How do they change by the end?
5. What object defines them?
`;

await app.vault.create(`${projectPath}/02 Characters/Antagonist - ${antagonist}.md`, antagonistContent);

// Supporting Characters
for (const char of supportingList) {
    const supportingContent = `---
tags: [character, supporting, ${storyName.toLowerCase()}]
story: ${storyName}
role: Supporting
---

# CHARACTER: ${char}

## Identity
- **Name:** ${char}
- **Role:** Supporting
- **Age:** 
- **Occupation:** 

## Core Wound
[What trauma shaped them?]

## Lie They Believe
[What false belief drives them?]

## Need
[What do they truly need?]

## Want
[What do they think they want?]

## Contradiction
[What makes them complex?]

## Fear
[What terrifies them?]

## Secret
[What do they hide?]

## Speech
[How do they talk?]

## Habits
[What do they do repeatedly?]

## Objects
[What objects define them?]

## Color
[What color represents them?]

## Smell
[What do they smell like?]

## Religion
[What do they believe?]

## Dream
[What is their deepest desire?]

## Shadow
[What is their dark side?]

## Arc
[How do they change?]

## Relationship Web
- **[[${mainChar}]]:** 
- **[[${antagonist}]]:** 

## Scene Tracker
[Which scenes are they in?]

## Quotes
[Key lines they say]

## Questions for AI
1. What purpose does this character serve?
2. What scene best reveals them?
3. How do they change by the end?
4. What object defines them?
`;

    await app.vault.create(`${projectPath}/02 Characters/Supporting - ${char}.md`, supportingContent);
}

// 12. Create Theme Files
const themes = ['Entropy', 'Water', 'Memory', 'Rust', 'Luxury', 'Mirrors', 'Gravity'];

for (const theme of themes) {
    const themeContent = `---
tags: [theme, symbol, ${storyName.toLowerCase()}]
story: ${storyName}
---

# THEME: ${theme}

## Meaning
[What does this represent?]

## First Appearance
[Where does it first appear?]

## Last Appearance
[Where does it last appear?]

## Associated Character
[Who is linked to it?]

## Transformation
[How does it evolve?]

## Images
[What images connect to it?]

## Objects
[What objects carry it?]

## Dialogue
[What dialogue references it?]

## Questions
[What questions does it raise?]

## Questions for AI
1. How can ${theme} be more present?
2. What object best carries ${theme}?
3. How does ${theme} evolve by the end?
4. What character is most associated with ${theme}?
`;

    await app.vault.create(`${projectPath}/04 Themes & Symbols/${theme}.md`, themeContent);
}

// 13. Create Scene Template
const sceneTemplateContent = `---
tags: [scene-template, ${storyName.toLowerCase()}]
story: ${storyName}
---

# SCENE TEMPLATE

## Metadata
- **Scene Number:** 
- **Scene Name:** 
- **Status:** [Draft/Revision/Final]
- **Words:** 

## Purpose
[Why does this scene exist?]

## Conflict
[What is the conflict?]

## Question
[What question does this scene raise?]

## Change
[How does something change?]

## Setting
[Where does it take place?]

## Time
[When does it take place?]

## Characters
[Who is in it?]

## Emotion
[What is the emotional core?]

## Symbol
[What symbol appears?]

## Foreshadowing
[What is hinted?]

## Objects
[What objects matter?]

## Dialogue Goal
[What does dialogue accomplish?]

## Opening Image
[What is the first image?]

## Ending Image
[What is the final image?]

## Questions for AI
1. Is the conflict clear?
2. Does something change?
3. Is the emotion earned?
4. What symbol appears?
5. What is foreshadowed?
6. Is the dialogue effective?
`;

await app.vault.create(`${projectPath}/06 Scenes/Scene Template.md`, sceneTemplateContent);

// 14. Create Cleland Mechanic Files
const clelandFiles = [
    'Narrative Question',
    'Knowledge Gaps',
    'Confusion & Betrayal',
    'Red Herrings',
    'Fear & Dread',
    'Slow Reveals',
    'Sentence Check'
];

for (const file of clelandFiles) {
    const content = `---
tags: [cleland, ${storyName.toLowerCase()}]
story: ${storyName}
---

# ${file}

## The Principle
[Cleland's principle goes here]

## My Story's Application
[How it applies to ${storyName}]

## Specific Elements
[List specific elements from your story]

## Scene Connections
[Which scenes use this?]

## Character Connections
[Which characters are affected?]

## Questions for AI
1. How can ${file} be stronger?
2. What am I missing?
3. How does this connect to the ending?
4. What would Cleland say?
`;

    await app.vault.create(`${projectPath}/05 Plot Engine/${file}.md`, content);
}

// 15. Create AI Laboratory
const aiContent = `---
tags: [ai, laboratory, ${storyName.toLowerCase()}]
story: ${storyName}
---

# AI LABORATORY

## Prompts

### Character Expansion
\`\`\`
Given this character: [[Protagonist - ${mainChar}]]

What are their contradictions?
What scene best reveals their core wound?
What secret have I forgotten?
\`\`\`

### Dialogue Rewrite
\`\`\`
Given this dialogue:
[Paste dialogue]

Rewrite this dialogue to reveal class, power, and subtext.
\`\`\`

### Literary Analysis
\`\`\`
Analyze this passage through:
- Marlon James: the violence of language
- Alice Munro: compression
- Toni Morrison: the weight of history
- Cormac McCarthy: the spare sentence
\`\`\`

### Theme Finder
\`\`\`
What themes are emerging in this story?
What symbols are appearing?
What questions remain unanswered?
\`\`\`

### Ending Generator
\`\`\`
Given this story:
[Summarize story]

Generate three possible endings:
1. Resolved
2. Ambiguous
3. Cyclical
\`\`\`

### Commonwealth Prize Judge
\`\`\`
Read this story:
[Paste story]

Judge it as if you were on the Commonwealth Short Story Prize panel.
Strengths:
Weaknesses:
Recommendations:
\`\`\`
`;

await app.vault.create(`${projectPath}/09 AI Laboratory/Laboratory.md`, aiContent);

// 16. Create Revision Files
const revisionContent = `---
tags: [revision, ${storyName.toLowerCase()}]
story: ${storyName}
---

# REVISION CHECKLIST

## Structure
- [ ] Narrative question answered?
- [ ] All character arcs complete?
- [ ] All subplots resolved?
- [ ] TRDs integrated effectively?
- [ ] Slow reveals in place?

## Characters
- [ ] Protagonist arc complete?
- [ ] Antagonist motivation clear?
- [ ] All supporting characters serve a purpose?
- [ ] Dialogue reveals character?

## Language
- [ ] Average sentence length < 20?
- [ ] Labeling words eliminated?
- [ ] Verb "to be" minimized?
- [ ] Sensory references included?
- [ ] Metaphors earned?

## Suspense
- [ ] Confusion and betrayal integrated?
- [ ] Red herrings planted?
- [ ] Fear and dread built?
- [ ] Slow reveals effective?

## Theme
- [ ] Theme is clear?
- [ ] Symbols evolve?
- [ ] Motifs recur?

## Ending
- [ ] Ending is surprising but inevitable?
- [ ] All questions answered?
- [ ] Global reflection at the end?
`;

await app.vault.create(`${projectPath}/11 Revision/Revision Checklist.md`, revisionContent);

// 17. Create Submission
const submissionContent = `---
tags: [submission, ${storyName.toLowerCase()}]
story: ${storyName}
---

# SUBMISSION: ${storyName}

## Target Competition
**Commonwealth Short Story Prize**

## Requirements
- **Word Count:** 2,000 - 5,000 words
- **Formatting:** 12pt Times New Roman, double-spaced
- **Deadline:** 

## Cover Letter Draft
[Write your cover letter here]

## Bio
[Write your bio here]

## Submission History
| Date | Competition | Status |
|------|-------------|--------|
|      |             |        |

## Results
[Track results here]
`;

await app.vault.create(`${projectPath}/12 Submission/Submission.md`, submissionContent);

// 18. Create Writing Constitution
const constitutionContent = `# THE WRITING CONSTITUTION

We write scenes, not explanations.

Objects carry emotion.

Dialogue reveals class.

Every page must surprise.

Every scene changes somebody.

Readers infer more than they are told.

The setting is a character.

Local language is never italicized unless confusion demands it.

Every symbol evolves.

Beauty emerges from specificity.

Cut abstractions.

Trust the reader.

Earn every metaphor.

Leave questions unanswered until the right moment.

---

*Read before every writing session.*
`;

await app.vault.create(`${projectPath}/07 Narrative Craft/Writing Constitution.md`, constitutionContent);

// 19. Create Research
const researchContent = `---
tags: [research, ${storyName.toLowerCase()}]
story: ${storyName}
---

# RESEARCH: ${storyName}

## Setting
[Research notes about the setting]

## Culture
[Research notes about the culture]

## History
[Research notes about the history]

## Language
[Research notes about local language]

## Geography
[Research notes about geography]

## Maps
[Links to maps]

## Photos
[Links to photos]

## Sources
[Cite your sources]
`;

await app.vault.create(`${projectPath}/10 Research/Research.md`, researchContent);

// 20. Create Language
const languageContent = `---
tags: [language, ${storyName.toLowerCase()}]
story: ${storyName}
---

# LANGUAGE: ${storyName}

## Swahili Lexicon
| Word | Meaning | Usage | Context |
|------|---------|-------|---------|
| pole | sympathy | hospital, funeral | mother speaking |
| | | | |

## French
| Word | Meaning | Usage |
|------|---------|-------|
| | | |

## Congolese Slang
| Word | Meaning | Usage |
|------|---------|-------|
| | | |

## Police Vocabulary
| Word | Meaning |
|------|---------|
| | |

## School Vocabulary
| Word | Meaning |
|------|---------|
| | |
`;

await app.vault.create(`${projectPath}/08 Language/Language Lexicon.md`, languageContent);

// 21. Success Message
const message = `✨ PROJECT CREATED SUCCESSFULLY! ✨

Story: ${storyName}
Main Character: ${mainChar}
Antagonist: ${antagonist}
Supporting Characters: ${supportingList.length ? supportingList.join(', ') : 'None'}

📁 Files created:
- ${folders.length} folders
- ${15 + supportingList.length + themes.length + clelandFiles.length} files

🎯 Next Steps:
1. Open [[${projectPath}/00 Dashboard/Dashboard]]
2. Fill in your story details
3. Start writing Scene 01
4. Check [[${projectPath}/07 Narrative Craft/Writing Constitution]] daily

📚 Quick Links:
- [[${projectPath}/01 Story Brain/Story Brain]]
- [[${projectPath}/02 Characters/Protagonist - ${mainChar}]]
- [[${projectPath}/06 Scenes/Scene Template]]
- [[${projectPath}/11 Revision/Revision Checklist]]

🧠 Remember: The system serves you. Write first. Organize second.
`;

console.log(message);
new Notice(message);