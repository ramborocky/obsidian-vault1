<%*
// Ask what tasks to show
const tasks = await tp.system.suggester(
  ["🎯 All Tasks", "📋 Priority 1 Only", "📝 Writing Focus"],
  ["all", "priority1", "writing"]
);

// Generate the dashboard
const today = tp.date.now("YYYY-MM-DD");

let output = `---
tags: [daily, check-in]
date: ${today}
---

# 🌅 MORNING CHECK-IN — ${today}

> *"The lake remembers everything."*

`;

if (tasks === "all") {
  output += `## 📋 ALL TASKS\n\n`;
  output += `| Task | Status | Priority |\n`;
  output += `|------|--------|----------|\n`;
  output += `| Fix opening | ⬜ | 🔴 High |\n`;
  output += `| Write ending | ⬜ | 🔴 High |\n`;
  output += `| Fix police station | ⬜ | 🟡 Medium |\n`;
  output += `| 500 words | ⬜ | 🟡 Medium |\n`;
} else if (tasks === "priority1") {
  output += `## 🚨 PRIORITY 1 TASKS\n\n`;
  output += `- [ ] Fix opening (motherboard first)\n`;
  output += `- [ ] Write cyclical ending\n`;
} else {
  output += `## 📝 WRITING FOCUS\n\n`;
  output += `**Goal:** 500 words on the ending\n\n`;
  output += `- [ ] 0 / 500 words\n`;
  output += `- [ ] Read aloud\n`;
  output += `- [ ] Revise\n`;
}

output += `\n## 📊 STATUS\n\n`;
output += `| Metric | Value |\n`;
output += `|--------|-------|\n`;
output += `| Draft Status | 🔴 First Draft |\n`;
output += `| Word Count | 3,247 / 5,000 |\n`;
output += `| Days Left | [Insert] |\n`;

%>