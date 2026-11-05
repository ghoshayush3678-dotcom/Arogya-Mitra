// Review by a native speaker before real-world use.
import type { TranslationDictionary } from "./types";

const en: TranslationDictionary = {
  meta: {
    code: "en",
    nativeName: "English",
    englishName: "English",
  },
  nav: {
    brandSubtitle: "Calm Health Companion",
    explainReport: "Explain Report",
    askSpecialist: "Ask a Specialist",
    sampleReport: "Sample Report",
    howItWorks: "How It Works",
    faq: "FAQ",
    settings: "Settings",
    snapPhoto: "Snap Photo",
    commonQA: "Common Q&A",
    quietDark: "Quiet Dark",
    warmIvory: "Warm Ivory",
  },
  languageSelector: {
    label: "Language",
    searchPlaceholder: "Search 15 languages (English, हिन्दी, தமிழ்…)",
    noResults: "No matching language found.",
    betaBadge: "Beta",
    betaNote:
      "Our AI is still learning this language. Please double-check important details with a doctor.",
    languageChangedNotice:
      "Language changed. Your specialist will reply in {language} from now on.",
    close: "Close",
    selectLanguageTitle: "Choose your language",
    allLanguages: "15 Indian & English languages",
  },
  hero: {
    kicker: "Take a breath. Let's go through this together.",
    headlinePrefix: "Your health report, explained",
    headlineEmphasis: "like a friend would",
    subheadline:
      "Paste your lab results or prescription—or upload a photo or PDF—for a calm, plain-language explanation of every item, what falls outside the typical range, and thoughtful questions for your doctor.",
    explainMyReportBtn: "Explain my report",
    snapPhotoMobileBtn: "Snap a photo of my report",
    trySampleLink: "Or try a sample report first",
    trustNothingStored: "Nothing is stored",
    trustClarityScore: "AI Clarity Score / 100",
    trustLanguagesCount: "15 languages supported",
    sampleCardTitle: "Sample Lab Card",
    clarityBadge: "Clarity: 98 / 100",
    sampleTestName: "Fasting Blood Glucose",
    sampleTypicalRange: "Typical adult range: 70 – 99 mg/dL",
    slightlyHigh: "Slightly high",
    lower: "Lower",
    typicalRange: "Typical range",
    higher: "Higher",
    sampleExplanation:
      "Measures blood sugar after an overnight fast. A reading just above 99 mg/dL can sometimes be linked to how your body processes meals and is a helpful, routine topic to discuss with your doctor.",
    reassuranceFloatingNote: "Nothing here is scary. Let's make it clear.",
    sanctuaryCaption: "Tulsi, Ashwagandha & Calm Clarity",
    sanctuaryBadge: "Ayurvedic Sanctuary",
    sanctuaryKicker: "Inspired by Ayurvedic Stillness",
    sanctuaryTitlePrefix: "Where ancient healing calm meets",
    sanctuaryTitleEmphasis: "modern clinical clarity",
    sanctuaryBody:
      "In Ayurveda, true wellbeing (Swasthya) begins when the mind is unhurried and free from fear. Medical numbers and dense lab abbreviations can feel overwhelming—so Arogya Mitra translates them with the warmth, patience, and grounding care of a quiet sanctuary.",
    pillar1Title: "Slow Your Breath",
    pillar1Desc: "Warm, reassuring words before any numbers.",
    pillar2Title: "Pure Clarity",
    pillar2Desc: "Every marker explained in plain, honest language.",
    pillar3Title: "Trusted Friend",
    pillar3Desc: "Thoughtful questions ready for your doctor visit.",
  },
  workspace: {
    tabLab: "Lab report",
    tabLabMobile: "Lab report",
    tabPrescription: "Prescription",
    tabPrescriptionMobile: "Prescription",
    tabUpload: "Upload photo or PDF",
    tabUploadMobile: "Photo / PDF",
    uploadLabel:
      "Snap a photo or upload a PDF of your lab report or prescription",
    uploadFormats: "JPG, PNG, WebP, or PDF · Max 10 MB",
    uploadDropTitle:
      "Take a photo with your phone camera, or choose a file",
    uploadDropSub:
      "You'll receive a calm plain-language breakdown plus an AI Reading Clarity Score out of 100.",
    takePhotoBtn: "Take photo with camera",
    chooseFileBtn: "Choose photo or PDF",
    readyToExplain: "Ready to explain & score",
    retakeBtn: "Retake",
    changeFileBtn: "Change file",
    optionalNoteLabel:
      'Optional note (for example: "Focus on the thyroid numbers")',
    optionalNotePlaceholder: "Add any context if you'd like…",
    trySampleReportBtn: "Try a sample report",
    trySamplePrescriptionBtn: "Try a sample prescription",
    pasteLabLabel:
      "Paste or dictate the text or numbers from your lab report",
    pastePrescriptionLabel:
      "Paste or dictate the medicines and directions from your prescription",
    dictateByVoice: "Dictate by voice",
    stopDictation: "Stop dictation",
    transcribingVoice: "Transcribing voice…",
    clearText: "Clear text",
    labPlaceholder:
      "Example:\nHemoglobin: 11.3 g/dL (Ref: 12.0 - 15.5)\nTotal Cholesterol: 216 mg/dL (Desirable < 200)\nFasting Blood Glucose: 105 mg/dL (Normal: 70 - 99)\nTSH: 2.4 mIU/L (0.45 - 4.50)",
    prescriptionPlaceholder:
      "Example:\n1. Tab Metformin 500mg — 1 tablet twice daily with meals\n2. Tab Atorvastatin 10mg — 1 tablet at night\n3. Cap Vitamin D3 60,000 IU — once weekly for 8 weeks",
    listeningIn: "Listening in {language}…",
    speakClearlyHint: "Speak your test names, numbers, or medicines clearly",
    transcribingStatus: "Transcribing your spoken report into text…",
    mobileVoiceHint: "Tap mic to dictate or camera tab for photo",
    desktopVoiceHint:
      "Take your time—paste a few lines or tap the microphone to read aloud",
    tryAgainBtn: "Try again",
    sessionPrivacyNote:
      "Your report is processed for this session only and never saved.",
    readingCarefullyBtn: "Reading carefully…",
    explainInPlainWordsBtn: "Explain in plain words",
  },
  profile: {
    sectionTitle: "Personal Health Profile",
    sessionOnlyNote: "Session only (never stored or logged)",
    unlocksSpecialist: "Unlocks Ask a Specialist",
    fieldsCountLabel: "fields",
    fillSampleProfile: "Fill sample profile",
    clearProfile: "Clear profile",
    nameLabel: "Your Name",
    namePlaceholder: "e.g., Riya Sen",
    ageLabel: "Age",
    agePlaceholder: "e.g., 42",
    sexLabel: "Sex",
    sexSelectPlaceholder: "Select sex",
    sexFemale: "Female",
    sexMale: "Male",
    sexOther: "Non-binary / Other",
    sexPreferNot: "Prefer not to say",
    bloodTypeLabel: "Blood Type",
    bloodTypeSelectPlaceholder: "Select blood type",
    bloodTypeUnknown: "Unknown / Not sure",
    sugarLabel: "Diabetes / Blood Sugar Status",
    sugarPlaceholder: "e.g., None, Pre-diabetes, Type 2 Diabetes",
    allergyLabel: "Allergies",
    allergyPlaceholder: "e.g., None known, Penicillin, Peanuts",
    bpLabel: "Blood Pressure / Fluid Conditions",
    bpPlaceholder: "e.g., Normal BP, Hypertension, None",
    conditionsLabel: "Existing Conditions",
    conditionsPlaceholder: "e.g., None, Thyroid, Asthma, PCOS",
    heightLabel: "Height",
    heightPlaceholder: "168 cm / 5'6\"",
    weightLabel: "Weight",
    weightPlaceholder: "65 kg / 143 lb",
    otherLabel: "Other Details",
    otherPlaceholder: "e.g., Vegetarian, active lifestyle, None",
    completeBanner:
      "Health profile complete ({summary}) — Ask a Specialist chat is unlocked and report explanations are personalised.",
    activeForReports: "Active for reports:",
    completeRemainingPrefix: "Complete",
    completeRemainingSuffix:
      '(type "None" if not applicable) to unlock Ask a Specialist.',
    optionalAllFieldsNote:
      "All fields are optional for report explanations, or complete every field above (use 'None' if not applicable) to unlock the personalised Ask a Specialist chat.",
    openSpecialistLink: "Open Ask a Specialist",
    goToSpecialistLink: "Go to Ask a Specialist",
  },
  history: {
    title: "Session History",
    subtitle:
      "Keeps your last 3 explanations privately in this browser so you can revisit them anytime.",
    searchPlaceholder: "Filter history by keyword…",
    clearHistory: "Clear history",
    emptyTitle: "Your quiet reading shelf is waiting",
    emptyBody:
      "No recent explanations saved in this browser yet. Once you explain a lab report or prescription, your last 3 results will rest here so you can revisit them anytime.",
    noMatchesPrefix: "No saved explanations match",
    resetFilter: "Reset filter",
    modeLab: "Lab report",
    modePrescription: "Prescription",
    modeUpload: "Uploaded file",
    itemsLabel: "items",
    scoreLabel: "Score",
  },
  loading: {
    messages: [
      "Reading your report carefully…",
      "Nothing here is scary. Let's make it clear…",
      "Comparing values against typical adult reference ranges…",
      "Translating medical terms into plain, kind words…",
      "Preparing thoughtful questions for your next doctor visit…",
    ],
    preparingInLanguage:
      "Preparing your plain-language explanation in {language}…",
  },
  results: {
    urgentBannerTitle: "Worth checking in with your doctor soon",
    urgentBannerBody:
      "One or more values may need prompt attention. Please contact your doctor soon.",
    atAGlance: "At a glance",
    languageLabel: "Language",
    reassuranceHeaderWithName:
      "{name}, nothing here is scary. Let's make it clear.",
    reassuranceHeaderDefault: "Nothing here is scary. Let's make it clear.",
    shareReady: "Summary ready to share",
    shareWithFamily: "Share summary with family",
    seeDoctorQuestionsCount: "See {count} doctor questions",
    clarityScoreTitle: "AI Clarity Score",
    verifiedBadge: "Verified",
    clarityHigh: "High reading clarity",
    clarityGood: "Good clarity · Standard ranges applied",
    clarityPartial: "Partial clarity · Verify with original report",
    defaultConfidenceNote:
      "Every item, unit, and reference range in your document was clearly matched against standard clinical benchmarks.",
    itemByItemTitle: "Item-by-item breakdown",
    showingItemsCount: "Showing {count} items",
    rangesVaryNote: "Reference ranges vary by lab, age, and sex",
    filterAll: "All",
    filterOutsideRange: "Outside range",
    filterTypical: "Typical",
    statusNormal: "In range",
    statusSlightlyHigh: "Slightly high",
    statusSlightlyLow: "Slightly low",
    statusDiscussSoon: "Worth discussing soon",
    statusPrescribedMedicine: "Prescribed medicine",
    typicalRefRange: "Typical reference range",
    checkLabPrintout: "Check lab printout",
    generallyUsedFor: "Generally used for:",
    howItIsWritten: "How it is written:",
    medicineSafetyFooter:
      "Always follow your prescribing doctor's exact instructions, and never start, stop, or change a dose without talking to them first.",
    everydayWellbeingKicker: "Everyday Wellbeing",
    lifestyleTipsTitle: "3 simple, non-medical lifestyle tips",
    gentleDailyHabitsNote: "Gentle daily habits · Not medical advice",
    defaultLifestyleTips: [
      "Try adding a gentle 10-minute walk after one of your daily meals.",
      "Keep a glass or bottle of water nearby to stay comfortably hydrated through the day.",
      "Aim for a steady, restful wind-down routine at roughly the same time each evening.",
    ],
    lifestyleDisclaimer:
      "These are general everyday wellness ideas inspired by your report. Always check with your doctor before making big changes to your diet or activity routine.",
    visitChecklistKicker: "Your Visit Checklist",
    questionsForDoctorTitle: "Questions to ask your doctor",
    questionsSubtitle:
      "Tap any question to check it off during your appointment, or copy and share the list.",
    copiedBtn: "Copied",
    copyQuestionsBtn: "Copy questions",
    printSavePdfBtn: "Print / Save PDF",
    importantDisclaimerLabel: "Important disclaimer:",
    resultsDisclaimerLine1:
      "Arogya Mitra is for understanding only. It is not medical advice, a diagnosis, or a substitute for a qualified doctor.",
    resultsDisclaimerLine2:
      "If you feel unwell or this is an emergency, contact a doctor or emergency services immediately.",
  },
  chat: {
    sectionKicker: "Personalised Health Guide",
    sectionTitle: "Ask a Specialist",
    sectionSubtitle:
      "Talk through your symptoms and health questions with a calm AI specialist guide tailored to the health profile you filled in for this session.",
    lockedTitle:
      "Complete your health profile so your specialist can understand you better.",
    lockedBody:
      'To give safe, relevant context for your symptoms, please fill in all 11 profile fields (you can enter "None" for any condition or allergy that doesn\'t apply). Your profile stays in this session only and is never stored or logged.',
    profileProgressLabel: "Profile progress",
    completedCountLabel: "completed",
    stillNeededLabel: "Still needed:",
    goToProfileBtn: "Go to health profile form",
    fillSampleProfileBtn: "Fill sample profile to try now",
    consentLine:
      "Your profile is used only to personalise this conversation and is never saved.",
    sessionPrivacyActive: "Session-only privacy active",
    bloodChipPrefix: "Blood:",
    sugarChipPrefix: "Sugar:",
    conditionsChipPrefix: "Conditions:",
    allergiesChipPrefix: "Allergies:",
    editProfileBtn: "Edit profile",
    copySummaryBtn: "Copy summary for my doctor",
    copiedSummaryBtn: "Copied summary",
    newChatBtn: "New chat",
    clearChatBtn: "Clear chat",
    clearConfirmTitle: "Clear all specialist chat messages for this session?",
    clearConfirmDesc:
      "This will permanently delete all messages in your current conversation. Your health profile will stay intact.",
    cancelBtn: "Cancel",
    confirmClearBtn: "Yes, clear chat",
    emergencyBannerTitle: "Please seek medical help right now.",
    emergencyBannerBody:
      "Contact emergency services immediately or go to the nearest hospital emergency department.",
    call112Btn: "Call 112",
    emptyClearedTitle: "Chat messages cleared for this session",
    emptyClearedBody:
      "Your conversation history has been removed. Type a question below, tap a prompt, or start a fresh specialist greeting.",
    restoreGreetingBtn: "Restore specialist welcome greeting",
    guideSuffix: "Guide",
    youLabel: "You",
    routineGuidanceBadge: "Routine guidance",
    suggestedCheckInPrefix: "Suggested check-in:",
    firstBotDisclaimer:
      "This AI guide is for understanding only. It is not a doctor, a diagnosis, or medical advice. In an emergency, call 112 or go to the nearest hospital.",
    seeADoctorLabel: "See a doctor",
    suggestedSpecialistPrefix: "Suggested Specialist:",
    findDoctorNearMeBtn: "Find a doctor near me",
    thinkingStatus: "{specialty} Guide is thinking…",
    retryBtn: "Retry",
    inputPlaceholder:
      "Tell your specialist guide what you're feeling… (Enter to send, Shift+Enter for new line)",
    sendBtn: "Send",
    persistentDisclaimer:
      "This AI guide is for understanding only. It is not a doctor, a diagnosis, or medical advice. In an emergency, call 112 or go to the nearest hospital.",
    firstBotGreeting:
      "Hi {name}, I've read your profile — including {highlight}. Tell me what's been bothering you, and we'll go through it together.",
    suggestionChips: [
      "I have a headache",
      "I feel tired all the time",
      "Explain my symptoms",
      "Is this serious?",
    ],
    urgencyLabels: {
      emergency: "Emergency — Seek Immediate Care",
      urgent: "Urgent — See a Doctor Within 24 Hours",
      soon: "See a Doctor Within a Few Days",
      routine: "Routine — Discuss at a Normal Appointment",
    },
    specialists: {
      "General Physician": {
        label: "General Physician",
        shortDesc: "Everyday symptoms, fever, fatigue, aches & whole-body guidance",
      },
      Cardiologist: {
        label: "Cardiologist",
        shortDesc: "Heart rhythm, blood pressure, circulation & chest comfort",
      },
      "Endocrinologist/Diabetes": {
        label: "Endocrinologist/Diabetes",
        shortDesc: "Blood sugar, diabetes, thyroid, hormones & metabolism",
      },
      Dermatologist: {
        label: "Dermatologist",
        shortDesc: "Skin rashes, itching, allergies, hair & nail concerns",
      },
      Neurologist: {
        label: "Neurologist",
        shortDesc: "Headaches, migraines, dizziness, tingling & sleep",
      },
      Gastroenterologist: {
        label: "Gastroenterologist",
        shortDesc: "Digestion, acidity, bloating, stomach & gut comfort",
      },
      "Women's Health": {
        label: "Women's Health",
        shortDesc: "Cycles, PCOS, pregnancy wellness, iron & hormonal care",
      },
      Pediatrician: {
        label: "Pediatrician",
        shortDesc: "Child & family growth, nutrition, fevers & gentle care",
      },
      "Mental Wellbeing": {
        label: "Mental Wellbeing",
        shortDesc: "Stress, anxious thoughts, low mood, rest & emotional calm",
      },
    },
    doctorSummaryHeader: "Arogya Mitra — Plain Summary for My Doctor Visit",
    doctorSummaryPreparedOn: "Prepared on",
    doctorSummaryProfileSection: "1. Patient Health Profile:",
    doctorSummarySymptomsSection: "2. Symptoms & Concerns Shared by Patient:",
    doctorSummaryNoSymptoms: "(No specific symptoms typed yet)",
    doctorSummaryGuideNoteSection: "3. AI Health Guide Note & Suggested Referral:",
    doctorSummaryLatestDiscussion: "4. Latest Discussion Summary:",
    doctorSummaryQuestionsSection: "5. Questions to Ask My Doctor:",
    doctorSummaryDefaultQuestions: [
      "What is the most likely cause of these symptoms given my health profile?",
      "Are there any specific tests or checks you recommend right now?",
      "What warning signs should prompt me to seek earlier care?",
    ],
  },
  safetyFixed: {
    emergencyMessage:
      "These symptoms could be a medical emergency. Please call emergency services (112 in India) or go to the nearest hospital emergency room right away. Do not wait or travel alone if someone can help you.",
    medicineRefusalMessage:
      "I care about your safety, and I cannot suggest, name, compare, or give doses for any medicines, tablets, supplements, or home remedies. Because your health profile and full medical history matter, a qualified doctor or pharmacist who can examine you should advise on the right medicine. Meanwhile, I can help you note your symptoms, what to monitor, and questions to ask your doctor.",
  },
  howItWorks: {
    kicker: "How Arogya Mitra Works",
    title: "Three unhurried steps from confusion to clarity.",
    step1Title: "Share your document",
    step1Desc:
      "Paste or dictate text from your lab report or prescription, or upload a photo or PDF. Everything stays inside your active browser session.",
    step2Title: "Read in plain words",
    step2Desc:
      "See what each test measures, your AI Clarity Score out of 100, and how values compare to typical adult ranges—in any of 15 supported languages.",
    step3Title: "Prepare for your visit",
    step3Desc:
      "Review 3 gentle lifestyle ideas and copy or print a personalized checklist of questions for a calm conversation with your doctor.",
  },
  faq: {
    kicker: "Good to Know",
    title: "Common questions",
    subtitle:
      "Straightforward answers about privacy, clarity scoring, and how Arogya Mitra reads your health documents.",
    items: [
      {
        question: "Is my health report saved anywhere?",
        answer:
          "Never. Your report is processed for this session only and never saved to any server or account. If you use this browser, your last 3 explanations stay privately in your own browser storage so you can revisit them, and you can clear them with one tap anytime.",
      },
      {
        question: "What does the AI Clarity Score out of 100 mean?",
        answer:
          "When you paste or upload a lab report or prescription, Arogya Mitra evaluates how clearly and completely every test name, number, unit, and reference range was read and matched against clinical benchmarks. A high score (90–100) means the document was crisp and complete; a lower score reminds you to double-check any blurry or missing lines on your original paper.",
      },
      {
        question: "Can this replace my doctor?",
        answer:
          "No. Arogya Mitra is built strictly for calm health literacy and understanding. A lab value or prescription only makes full sense alongside your personal medical history, symptoms, and physical exam by a qualified clinician.",
      },
      {
        question: "Why do reference ranges vary between labs?",
        answer:
          "Different laboratories use slightly different testing instruments, chemical reagents, and local population baselines. Reference ranges also shift naturally based on age, biological sex, pregnancy, and time of day.",
      },
    ],
  },
  footer: {
    disclaimerLine1:
      "Arogya Mitra is for understanding only. It is not medical advice, a diagnosis, or a substitute for a qualified doctor.",
    disclaimerLine2:
      "If you feel unwell or this is an emergency, contact a doctor or emergency services immediately.",
    sessionOnlyNote:
      "Your report is processed for this session only and never saved.",
    madeWithCare: "Made with care for calm, compassionate health literacy.",
  },
  mobileDock: {
    newReport: "New Report",
    items: "Items",
    doctorQs: "Doctor Qs",
    share: "Share",
    shared: "Shared",
    snapPhoto: "Snap Photo",
    voice: "Voice",
    stop: "Stop",
    reading: "Reading…",
    explainNow: "Explain now",
    pasteOrUpload: "Paste or upload",
  },
  settingsModal: {
    title: "Settings",
    appearanceLabel: "Appearance",
    appearanceDesc:
      "Choose warm ivory paper for daytime or a quiet pine mode for evening reading.",
    warmIvory: "Warm Ivory",
    quietDark: "Quiet Dark",
    textSizeLabel: "Reading text size",
    standardText: "Standard (17.5px)",
    largerText: "Larger Text (18.5px)",
    languageLabel: "Explanation language",
    doneBtn: "Done",
  },
  errors: {
    selectPhotoOrPdf:
      "Please select a photo or PDF of your lab report or prescription before continuing.",
    pastePrescriptionFirst:
      "Please paste the medicine names and instructions from your prescription first, or click 'Try a sample prescription'.",
    pasteLabFirst:
      "Please paste the lines from your lab report first, or click 'Try a sample report' to see an example.",
    fileTooLarge:
      "That file is over 10 MB. Please choose a smaller photo or a compressed PDF so we can read it smoothly.",
    invalidFileType:
      "Please upload a clear photo (JPG, PNG, WebP) or a PDF document.",
    fileReadError:
      "We couldn't read that file from your device. Please try selecting it again.",
    messageTooLong:
      "Please keep your message under 1,000 characters so we can go through it clearly.",
    genericAnalyzeError:
      "We couldn't complete the explanation right now. Please check your input and try again.",
    genericChatError:
      "We couldn't reach your specialist guide right now. Please take a breath and tap Retry.",
  },
};

export default en;
