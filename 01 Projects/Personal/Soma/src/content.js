/* Soma — seed content. Everything here is data: the engine never hard-codes a book,
   a slot or a method. Edit freely; the app copies seeds into its own state on first run,
   after which the user's library lives in local storage. */
(function (root) {
  "use strict";

  const books = [
    // MAF core
    { id: "saunders-rm", title: "Research Methods for Business Students", author: "Saunders, Lewis & Thornhill", module: "Research Methods", area: "maf", priority: 3 },
    { id: "brooks-econ", title: "Introductory Econometrics for Finance", author: "Chris Brooks", module: "Quantitative Techniques", area: "maf", priority: 3 },
    { id: "bma-cf", title: "Principles of Corporate Finance", author: "Brealey, Myers & Allen", module: "Financial Management", area: "maf", priority: 2 },
    { id: "elliott-far", title: "Financial Accounting and Reporting", author: "Elliott & Elliott", module: "Financial Reporting", area: "maf", priority: 2 },
    { id: "drury-mca", title: "Management and Cost Accounting", author: "Colin Drury", module: "Management Accounting", area: "maf", priority: 2 },
    // Behavioural shelf
    { id: "thaler-misbehaving", title: "Misbehaving", author: "Richard Thaler", module: "Behavioral Investments", area: "maf", priority: 2 },
    { id: "kahneman-tfs", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", module: "Behavioral Investments", area: "maf", priority: 1 },
    // Writing and life (from The Rhythm)
    { id: "saunders-swim", title: "A Swim in a Pond in the Rain", author: "George Saunders", module: "Craft", area: "writing", priority: 3 },
    { id: "housel-psych", title: "The Psychology of Money", author: "Morgan Housel", module: "Money", area: "maf", priority: 1 },
  ];

  // Online materials: they need a connection (or a download made beforehand).
  const materials = [
    { id: "ot-fr", title: "OpenTuition — Financial Reporting (FR)", module: "Financial Reporting", area: "maf", url: "https://opentuition.com" },
    { id: "ot-sbr", title: "OpenTuition — Strategic Business Reporting (SBR)", module: "Corporate Reporting", area: "maf", url: "https://opentuition.com" },
    { id: "ot-fm", title: "OpenTuition — Financial Management (FM)", module: "Financial Management", area: "maf", url: "https://opentuition.com" },
    { id: "ot-aa", title: "OpenTuition — Audit and Assurance (AA)", module: "Auditing and Assurance", area: "maf", url: "https://opentuition.com" },
    { id: "mit-15401", title: "MIT OCW 15.401 Finance Theory I (Andrew Lo)", module: "Investments", area: "maf", url: "https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008" },
    { id: "damodaran", title: "Damodaran — corporate finance and valuation lectures", module: "Financial Management", area: "maf", url: "https://pages.stern.nyu.edu/~adamodar/" },
    { id: "shiller-fm", title: "Yale — Financial Markets (Robert Shiller)", module: "Behavioral Investments", area: "maf", url: "https://www.coursera.org/learn/financial-markets-global" },
    { id: "r4ds", title: "R for Data Science (free book)", module: "Dissertation", area: "maf", url: "https://r4ds.hadley.nz" },
  ];

  const writing = [
    { id: "chantal", title: "Chantal — the final pass", note: "Commonwealth window opens 1 Jan 2027. Prose control, the open calls on Home.", minutes: 25 },
    { id: "mihogoni", title: "The next Mihogoni story", note: "New pages. Scenes, not explanations.", minutes: 25 },
    { id: "impromptu", title: "The Impromptu", note: "One page, 15 minutes, never finished, never revised.", minutes: 15 },
  ];

  const essay = { id: "essay", title: "This month's money essay", note: "Scene first, finance after, shorter than the scene. Pick a row from Money and Motive.", minutes: 25 };

  const exposureIdeas = [
    "Post the month's money essay",
    "Email one lecturer one question you couldn't answer",
    "Send a draft page to one reader and ask what they skimmed",
    "Pitch one small firm on bookkeeping or reporting work",
    "Ask an ACPA/FCPA member to be a referee",
    "Share one reading takeaway with your study group",
  ];

  const modules = [
    "Financial Reporting", "Financial Management", "Management Accounting", "Auditing and Assurance",
    "Quantitative Techniques", "Research Methods", "Investments", "Multinational Finance",
    "Corporate Reporting", "Behavioral Investments",
  ];

  // Timetable slots, local time. days: 0 = Sunday … 6 = Saturday.
  // `fits` lists the card kinds that belong in the slot; `routine` names the routine card it opens.
  const W = [1, 2, 3, 4, 5], ALL = [0, 1, 2, 3, 4, 5, 6];
  const slots = [
    { id: "dawn", days: ALL, from: "05:00", to: "05:50", fits: ["routine"], routine: "walk" },
    { id: "dawn-study", days: [1, 3, 5], from: "05:50", to: "06:45", fits: ["read", "flash", "exam"] },
    { id: "dawn-write", days: [2, 4], from: "05:50", to: "06:45", fits: ["write"] },
    { id: "sun-write", days: [0], from: "07:00", to: "08:30", fits: ["write", "essay"] },
    { id: "sat-deep", days: [6], from: "08:30", to: "12:30", fits: ["read", "exam", "task", "watch"] },
    { id: "pre-read", days: W, from: "16:20", to: "17:00", fits: ["routine"], routine: "preread" },
    { id: "class", days: W, from: "17:00", to: "19:00", fits: ["routine"], routine: "class" },
    { id: "notes", days: [1, 2, 4], from: "19:30", to: "20:45", fits: ["routine", "flash"], routine: "notes" },
    { id: "group", days: [3], from: "19:30", to: "20:45", fits: ["routine", "flash"], routine: "group" },
    { id: "log", days: ALL, from: "20:45", to: "21:30", fits: ["routine"], routine: "log" },
    { id: "review", days: [0], from: "15:30", to: "17:00", fits: ["routine", "flash"], routine: "review" },
  ];

  // Routine cards. `sets` is the daily-note property the card fills when done.
  const routines = [
    { id: "walk", title: "Fajr, then 20 minutes outside", note: "Morning light, phone in pocket. This is the meditation.", minutes: 20, area: "life", sets: { walk: true } },
    { id: "tablets", title: "Morning tablets", note: "Take them now, tick it, done.", minutes: 1, area: "life", sets: { tablets: true }, window: ["05:00", "10:00"] },
    { id: "preread", title: "Pre-read for tonight's class", note: "Skim the slides or chapter headings. Walk in with one question.", minutes: 20, area: "maf", study: true },
    { id: "class", title: "Class, 17:00–19:00", note: "Be there, in person or on Zoom. Phone face down.", minutes: 120, area: "maf", sets: { class: true }, noTimer: true },
    { id: "notes", title: "One-page notes from tonight", note: "Cornell page: main points, your questions, a 3-line summary. Then 3–5 flashcards.", minutes: 45, area: "maf", study: true },
    { id: "group", title: "Study group", note: "Explain one topic to the other two. Listen to theirs.", minutes: 45, area: "maf", study: true },
    { id: "log", title: "The five-line evening log", note: "What I did · one exposure · tablets · spend logged · left work on time.", minutes: 5, area: "life", sets: { log: true }, form: "log" },
    { id: "review", title: "Weekly review", note: "Flashcards, this week's quests, and a 30-minute plan for next week.", minutes: 30, area: "maf", study: true },
  ];

  // Methods from the literature. `evidence` is deliberately honest.
  const methods = [
    { id: "deep-work", name: "Deep work", source: "Cal Newport, Deep Work (2016)", evidence: "Practitioner book", idea: "The valuable work is the hard, undistracted kind, and it has to be scheduled, not hoped for.", try: "Block your next 50 minutes now, and name the one thing in it." },
    { id: "shutdown", name: "Shutdown ritual", source: "Cal Newport, Deep Work (2016)", evidence: "Practitioner book", idea: "End the work day with a fixed check: open loops written down, tomorrow's first task named. Then stop thinking about it.", try: "Tonight at 21:00, write tomorrow's first task in the log." },
    { id: "residue", name: "Attention residue", source: "Sophie Leroy (2009), Organizational Behavior and Human Decision Processes", evidence: "Research", idea: "Switching tasks leaves part of your attention on the old one, and you do the new one worse.", try: "For the next block, finish or park the last task in writing before you start." },
    { id: "pomodoro", name: "The Pomodoro Technique", source: "Francesco Cirillo (1980s; book 2006)", evidence: "Practitioner method", idea: "25 minutes on, 5 off. The timer makes starting small and stopping honest.", try: "Start one 25-minute block with the next card." },
    { id: "spacing", name: "Spaced repetition", source: "Ebbinghaus (1885); Cepeda et al. (2006) meta-analysis", evidence: "Strong research", idea: "Reviewing over spread-out days beats cramming the same total time.", try: "Make 3 flashcards from what you read today. The app spaces them for you." },
    { id: "retrieval", name: "Retrieval practice", source: "Roediger & Karpicke (2006), Psychological Science", evidence: "Strong research", idea: "Pulling an idea out of memory strengthens it more than reading it again.", try: "After your next reading block, close the book and write what you remember." },
    { id: "interleave", name: "Interleaving", source: "Rohrer & Taylor (2007), Instructional Science", evidence: "Research, strongest for problem-solving", idea: "Mixing topics in practice feels harder and works better than doing one type at a time.", try: "Today's exam question comes from a module you haven't practised lately." },
    { id: "intentions", name: "Implementation intentions", source: "Gollwitzer (1999); Gollwitzer & Sheeran (2006) meta-analysis", evidence: "Strong research", idea: "\"When X happens, I will do Y\" doubles the odds you act, compared with just intending to.", try: "Write one: When I get home from class, I will…", form: "intention" },
    { id: "bundling", name: "Temptation bundling", source: "Milkman, Minson & Volpp (2014), Management Science", evidence: "Research", idea: "Allow yourself something you enjoy only while doing the thing you avoid.", try: "Pick one treat that only happens during a study block." },
    { id: "fresh-start", name: "The fresh start effect", source: "Dai, Milkman & Riis (2014), Management Science", evidence: "Research", idea: "New beginnings, like a Monday, a new month or a new semester, make people more likely to start.", try: "Name what starts next Monday, and put it in the feed as a task." },
    { id: "never-twice", name: "Never miss twice", source: "James Clear, Atomic Habits (2018)", evidence: "Practitioner book", idea: "One missed day is life. Two is a new habit forming.", try: "If yesterday was empty, do the smallest version today: 10 minutes and the log." },
    { id: "two-minute", name: "The two-minute start", source: "James Clear, Atomic Habits (2018)", evidence: "Practitioner book", idea: "Shrink the habit until starting is easy. Opening the book counts.", try: "Open the next book card and read one page. That's all." },
    { id: "frog", name: "Eat the frog", source: "Brian Tracy, Eat That Frog! (2001)", evidence: "Practitioner book", idea: "Do the task you most want to avoid first, before the day argues you out of it.", try: "Swipe to the card you'd most like to skip, and start it." },
    { id: "parkinson", name: "Parkinson's law", source: "C. Northcote Parkinson (1955), The Economist", evidence: "Observation, not research", idea: "Work expands to fill the time you give it. Give it less.", try: "Set this block 5 minutes shorter than feels comfortable." },
    { id: "stop-mid", name: "Stop when you know what comes next", source: "Hemingway's working habit; related to the Zeigarnik effect (1927)", evidence: "Craft advice; the research is mixed", idea: "End a writing session mid-scene, while you still know the next sentence. Tomorrow starts easily.", try: "Finish today's writing block in the middle of a scene." },
    { id: "flow", name: "Flow", source: "Mihaly Csikszentmihalyi, Flow (1990)", evidence: "Research-based theory", idea: "Absorption comes from clear goals, quick feedback and a challenge just above your skill.", try: "Give the next block one clear goal: three pages, one question, one scene." },
    { id: "feynman", name: "The Feynman technique", source: "Attributed to Richard Feynman; see self-explanation research (Chi et al., 1994)", evidence: "Practitioner method; self-explanation is well supported", idea: "Explain it in plain words as if to a child. Where you stumble is what you don't know yet.", try: "Explain today's topic out loud in 60 seconds. Note where you got stuck." },
    { id: "sq3r", name: "SQ3R reading", source: "Francis P. Robinson, Effective Study (1946)", evidence: "Classic study method", idea: "Survey, Question, Read, Recite, Review. Read with a question in mind, not just eyes on the page.", try: "Before the next chunk, skim the headings and write one question." },
    { id: "cornell", name: "Cornell notes", source: "Walter Pauk, How to Study in College (1962)", evidence: "Practitioner method", idea: "Notes on the right, questions on the left, a summary at the bottom, all on one page.", try: "Use the format for tonight's one-page notes." },
    { id: "phone-away", name: "Phone in another room", source: "Ward et al. (2017), Journal of the Association for Consumer Research", evidence: "Research; replications are mixed", idea: "Having your phone in sight may cost attention, even switched off.", try: "Put the phone out of sight for the next block. (Desktop: close the other tabs.)" },
    { id: "commitment", name: "Commitment devices", source: "Ariely & Wertenbroch (2002), Psychological Science", evidence: "Research", idea: "Deadlines you set for yourself and tell someone about beat vague intentions.", try: "Tell one person the date you'll finish the next chapter." },
  ];

  const levels = [
    [0, "Mwanafunzi", "the student"], [300, "Mwanagenzi", "the apprentice"], [800, "Fundi", "the craftsman"],
    [1600, "Hodari", "the capable one"], [3000, "Mtaalamu", "the expert"], [5000, "Bingwa", "the champion"],
    [8000, "Gwiji", "the master"],
  ];

  const bosses = [
    { name: "Commonwealth Prize: submit Chantal", from: "2027-01-05", to: "2027-01-19", area: "writing" },
    { name: "Semester 1 exams", from: "2027-02-15", to: "2027-02-28", area: "maf" },
    { name: "Proposal defence", from: "2027-05-20", to: "2027-05-30", area: "maf" },
    { name: "Dissertation submission", from: "2027-09-15", to: "2027-10-05", area: "maf" },
  ];

  const reminders = [
    { id: "dawn-study", days: [1, 3, 5], at: "05:50", title: "Study block", body: "Open Soma. The first card is ready." },
    { id: "dawn-write", days: [2, 4], at: "05:50", title: "Writing block", body: "Door shut, timer on." },
    { id: "pre-read", days: [1, 2, 3, 4, 5], at: "16:30", title: "Pre-read, 20 min", body: "Walk into class with one question." },
    { id: "notes", days: [1, 2, 4], at: "19:45", title: "One-page notes", body: "While class is fresh." },
    { id: "log", days: [0, 1, 2, 3, 4, 5, 6], at: "21:00", title: "Evening log", body: "Five lines. Claim your XP." },
    { id: "sat-deep", days: [6], at: "08:30", title: "Deep study", body: "Two blocks of 100 minutes." },
    { id: "sun-write", days: [0], at: "07:00", title: "Sunday writing", body: "90 minutes." },
  ];

  const SomaContent = { books, materials, writing, essay, exposureIdeas, modules, slots, routines, methods, levels, bosses, reminders };
  if (typeof module !== "undefined" && module.exports) module.exports = SomaContent;
  else root.SomaContent = SomaContent;
})(typeof window !== "undefined" ? window : globalThis);
