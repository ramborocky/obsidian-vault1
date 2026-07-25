<%*
// ============================================
// LITERARY INTELLIGENCE SYSTEM - PROJECT CREATOR
// TEMPLATER VERSION (FULLY COMPATIBLE)
// ============================================

// 1. Get the story name
const storyName = await tp.system.prompt("Enter story name (e.g., Kalemie):", null, false, true);
if (!storyName) {
    new Notice("❌ No story name provided. Operation cancelled.");
    return;
}

// 2. Get the main character
const mainChar = await tp.system.prompt("Enter main character name (e.g., Daudi):", null, false, true);
if (!mainChar) {
    new Notice("❌ No main character provided. Operation cancelled.");
    return;
}

// 3. Get antagonist
const antagonist = await tp.system.prompt("Enter antagonist name (e.g., Jean Luc):", null, false, true);
if (!antagonist) {
    new Notice("❌ No antagonist provided. Operation cancelled.");
    return;
}

// 4. Get supporting characters (comma separated)
const supporting = await tp.system.prompt("Enter supporting characters (comma separated, e.g., Djamela, D'juma, Morisho):", null, false, true);
const supportingList = supporting ? supporting.split(',').map(s => s.trim()).filter(s => s) : [];

// 5. Get project path
const projectPath = `01 Projects/${storyName}`;

// 6. Define folders
const folders = [
    projectPath,
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

// 7. Helper function to check if folder exists
async function folderExists(path) {
    try {
        const adapter = app.vault.adapter;
        return await adapter.exists(path);
    } catch (e) {
        return false;
    }
}

// 8. Helper function to create file with content
async function createFile(path, content) {
    try {
        const exists = await app.vault.adapter.exists(path);
        if (!exists) {
            await app.vault.create(path, content);
            console.log(`✅ Created: ${path}`);
            return true;
        } else {
            console.log(`⏩ Skipped (already exists): ${path}`);
            return false;
        }
    } catch (e) {
        console.error(`❌ Error creating ${path}:`, e);
        return false;
    }
}

// 9. Create folders
new Notice("📁 Creating folders...");
for (const folder of folders) {
    const exists = await folderExists(folder);
    if (!exists) {
        await app.vault.createFolder(folder);
        console.log(`📁 Created folder: ${folder}`);
    }
}

// 10. Create Dashboard
new Notice("📄 Creating Dashboard...");
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

await createFile(`${projectPath}/00 Dashboard/Dashboard.md`, dashboardContent);

// 11. Create Story Brain
new Notice("📄 Creating Story Brain...");
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

await createFile(`${projectPath}/01 Story Brain/Story Brain.md`, storyBrainContent);

// 12. Create Protagonist
new Notice("📄 Creating Protagonist...");
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
- **[[${Antagonist-Jean-luc}]]:** 
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

await createFile(`${projectPath}/02 Characters/Protagonist - ${mainChar}.md`, protagonistContent);

// 13. Create Antagonist
new Notice("📄 Creating Antagonist...");
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

await createFile(`${projectPath}/02 Characters/Antagonist - ${antagonist}.md`, antagonistContent);

// 14. Create Supporting Characters
new Notice("📄 Creating Supporting Characters...");
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
- **[[${Antagonist-Jean-luc}]]:** 

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

    await createFile(`${projectPath}/02 Characters/Supporting - ${char}.md`, supportingContent);
}

// 15. Create Theme Files
new Notice("📄 Creating Theme Files...");
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

    await createFile(`${projectPath}/04 Themes & Symbols/${theme}.md`, themeContent);
}

// 16. Create Scene Template
new Notice("📄 Creating Scene Template...");
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

await createFile(`${projectPath}/06 Scenes/Scene Template.md`, sceneTemplateContent);

// 17. Create Cleland Mechanic Files
new Notice("📄 Creating Cleland Files...");
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

    await createFile(`${projectPath}/05 Plot Engine/${file}.md`, content);
}

// 18. Create AI Laboratory
new Notice("📄 Creating AI Laboratory...");
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

await createFile(`${projectPath}/09 AI Laboratory/Laboratory.md`, aiContent);

// 19. Create Revision Checklist
new Notice("📄 Creating Revision Checklist...");
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

await createFile(`${projectPath}/11 Revision/Revision Checklist.md`, revisionContent);

// 20. Create Submission
new Notice("📄 Creating Submission...");
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

await createFile(`${projectPath}/12 Submission/Submission.md`, submissionContent);

// 21. Create Writing Constitution
new Notice("📄 Creating Writing Constitution...");
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

await createFile(`${projectPath}/07 Narrative Craft/Writing Constitution.md`, constitutionContent);

// 22. Create Research
new Notice("📄 Creating Research...");
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

await createFile(`${projectPath}/10 Research/Research.md`, researchContent);

// 23. Create Language Lexicon
new Notice("📄 Creating Language Lexicon...");
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

await createFile(`${projectPath}/08 Language/Language Lexicon.md`, languageContent);

// 24. Count everything
const totalFolders = folders.length;
const totalFiles = 15 + supportingList.length + themes.length + clelandFiles.length;

// 25. Success Message
new Notice(`✅ PROJECT "${storyName}" CREATED!`);

const message = `
╔═══════════════════════════════════════════════════╗
║  ✨ LITERARY INTELLIGENCE SYSTEM ✨              ║
║  Project Created Successfully!                   ║
╚═══════════════════════════════════════════════════╝

📖 STORY: ${storyName}
👤 Main: ${mainChar}
👹 Antagonist: ${antagonist}
👥 Supporting: ${supportingList.length ? supportingList.join(', ') : 'None'}

📁 Created: ${totalFolders} folders, ${totalFiles} files

🎯 NEXT STEPS:
1. Open the Dashboard
   [[${projectPath}/00 Dashboard/Dashboard]]
2. Fill in story details
3. Start writing Scene 01
4. Read the Writing Constitution daily

📚 QUICK LINKS:
- [[${projectPath}/01 Story Brain/Story Brain]]
- [[${projectPath}/02 Characters/Protagonist - ${mainChar}]]
- [[${projectPath}/06 Scenes/Scene Template]]

🧠 Remember: The system serves you. Write first. Organize second.
`;

console.log(message);
%>