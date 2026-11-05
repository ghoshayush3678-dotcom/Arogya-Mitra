// Review by a native speaker before real-world use.

export type LanguageCode =
  | "en"
  | "hi"
  | "bn"
  | "pa"
  | "mr"
  | "gu"
  | "kn"
  | "ta"
  | "te"
  | "ml"
  | "or"
  | "as"
  | "bho"
  | "raj"
  | "sa";

export type ScriptGroup = "latin" | "tall-north" | "tall-south";

export interface LanguageMeta {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  script: string;
  status: "stable" | "beta";
  scriptGroup: ScriptGroup;
  googleFontFamily: string | null;
  googleSerifFamily: string | null;
  speechLang: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  {
    code: "en",
    nativeName: "English",
    englishName: "English",
    script: "Latin",
    status: "stable",
    scriptGroup: "latin",
    googleFontFamily: null,
    googleSerifFamily: null,
    speechLang: "en-IN",
  },
  {
    code: "hi",
    nativeName: "हिन्दी",
    englishName: "Hindi",
    script: "Devanagari",
    status: "stable",
    scriptGroup: "tall-north",
    googleFontFamily: "Noto Sans Devanagari",
    googleSerifFamily: "Noto Serif Devanagari",
    speechLang: "hi-IN",
  },
  {
    code: "bn",
    nativeName: "বাংলা",
    englishName: "Bengali",
    script: "Bengali",
    status: "stable",
    scriptGroup: "tall-north",
    googleFontFamily: "Noto Sans Bengali",
    googleSerifFamily: "Noto Serif Bengali",
    speechLang: "bn-IN",
  },
  {
    code: "pa",
    nativeName: "ਪੰਜਾਬੀ",
    englishName: "Punjabi",
    script: "Gurmukhi",
    status: "stable",
    scriptGroup: "tall-north",
    googleFontFamily: "Noto Sans Gurmukhi",
    googleSerifFamily: "Noto Serif Gurmukhi",
    speechLang: "pa-IN",
  },
  {
    code: "mr",
    nativeName: "मराठी",
    englishName: "Marathi",
    script: "Devanagari",
    status: "stable",
    scriptGroup: "tall-north",
    googleFontFamily: "Noto Sans Devanagari",
    googleSerifFamily: "Noto Serif Devanagari",
    speechLang: "mr-IN",
  },
  {
    code: "gu",
    nativeName: "ગુજરાતી",
    englishName: "Gujarati",
    script: "Gujarati",
    status: "stable",
    scriptGroup: "tall-north",
    googleFontFamily: "Noto Sans Gujarati",
    googleSerifFamily: "Noto Serif Gujarati",
    speechLang: "gu-IN",
  },
  {
    code: "kn",
    nativeName: "ಕನ್ನಡ",
    englishName: "Kannada",
    script: "Kannada",
    status: "stable",
    scriptGroup: "tall-south",
    googleFontFamily: "Noto Sans Kannada",
    googleSerifFamily: "Noto Serif Kannada",
    speechLang: "kn-IN",
  },
  {
    code: "ta",
    nativeName: "தமிழ்",
    englishName: "Tamil",
    script: "Tamil",
    status: "stable",
    scriptGroup: "tall-south",
    googleFontFamily: "Noto Sans Tamil",
    googleSerifFamily: "Noto Serif Tamil",
    speechLang: "ta-IN",
  },
  {
    code: "te",
    nativeName: "తెలుగు",
    englishName: "Telugu",
    script: "Telugu",
    status: "stable",
    scriptGroup: "tall-south",
    googleFontFamily: "Noto Sans Telugu",
    googleSerifFamily: "Noto Serif Telugu",
    speechLang: "te-IN",
  },
  {
    code: "ml",
    nativeName: "മലയാളം",
    englishName: "Malayalam",
    script: "Malayalam",
    status: "stable",
    scriptGroup: "tall-south",
    googleFontFamily: "Noto Sans Malayalam",
    googleSerifFamily: "Noto Serif Malayalam",
    speechLang: "ml-IN",
  },
  {
    code: "or",
    nativeName: "ଓଡ଼ିଆ",
    englishName: "Odia",
    script: "Odia",
    status: "stable",
    scriptGroup: "tall-north",
    googleFontFamily: "Noto Sans Oriya",
    googleSerifFamily: "Noto Serif Oriya",
    speechLang: "or-IN",
  },
  {
    code: "as",
    nativeName: "অসমীয়া",
    englishName: "Assamese",
    script: "Bengali-Assamese script",
    status: "stable",
    scriptGroup: "tall-north",
    googleFontFamily: "Noto Sans Bengali",
    googleSerifFamily: "Noto Serif Bengali",
    speechLang: "as-IN",
  },
  {
    code: "bho",
    nativeName: "भोजपुरी",
    englishName: "Bhojpuri",
    script: "Devanagari",
    status: "beta",
    scriptGroup: "tall-north",
    googleFontFamily: "Noto Sans Devanagari",
    googleSerifFamily: "Noto Serif Devanagari",
    speechLang: "hi-IN",
  },
  {
    code: "raj",
    nativeName: "राजस्थानी",
    englishName: "Rajasthani",
    script: "Devanagari",
    status: "beta",
    scriptGroup: "tall-north",
    googleFontFamily: "Noto Sans Devanagari",
    googleSerifFamily: "Noto Serif Devanagari",
    speechLang: "hi-IN",
  },
  {
    code: "sa",
    nativeName: "संस्कृतम्",
    englishName: "Sanskrit",
    script: "Devanagari",
    status: "beta",
    scriptGroup: "tall-north",
    googleFontFamily: "Noto Sans Devanagari",
    googleSerifFamily: "Noto Serif Devanagari",
    speechLang: "sa-IN",
  },
];

export const LANGUAGE_META_MAP: Record<LanguageCode, LanguageMeta> =
  SUPPORTED_LANGUAGES.reduce((acc, lang) => {
    acc[lang.code] = lang;
    return acc;
  }, {} as Record<LanguageCode, LanguageMeta>);

export interface TranslationDictionary {
  meta: {
    code: LanguageCode;
    nativeName: string;
    englishName: string;
  };
  nav: {
    brandSubtitle: string;
    explainReport: string;
    askSpecialist: string;
    sampleReport: string;
    howItWorks: string;
    faq: string;
    settings: string;
    snapPhoto: string;
    commonQA: string;
    quietDark: string;
    warmIvory: string;
  };
  languageSelector: {
    label: string;
    searchPlaceholder: string;
    noResults: string;
    betaBadge: string;
    betaNote: string;
    languageChangedNotice: string; // Use {language} placeholder
    close: string;
    selectLanguageTitle: string;
    allLanguages: string;
  };
  hero: {
    kicker: string;
    headlinePrefix: string;
    headlineEmphasis: string;
    subheadline: string;
    explainMyReportBtn: string;
    snapPhotoMobileBtn: string;
    trySampleLink: string;
    trustNothingStored: string;
    trustClarityScore: string;
    trustLanguagesCount: string;
    sampleCardTitle: string;
    clarityBadge: string;
    sampleTestName: string;
    sampleTypicalRange: string;
    slightlyHigh: string;
    lower: string;
    typicalRange: string;
    higher: string;
    sampleExplanation: string;
    reassuranceFloatingNote: string;
    sanctuaryCaption: string;
    sanctuaryBadge: string;
    sanctuaryKicker: string;
    sanctuaryTitlePrefix: string;
    sanctuaryTitleEmphasis: string;
    sanctuaryBody: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
  };
  workspace: {
    tabLab: string;
    tabLabMobile: string;
    tabPrescription: string;
    tabPrescriptionMobile: string;
    tabUpload: string;
    tabUploadMobile: string;
    uploadLabel: string;
    uploadFormats: string;
    uploadDropTitle: string;
    uploadDropSub: string;
    takePhotoBtn: string;
    chooseFileBtn: string;
    readyToExplain: string;
    retakeBtn: string;
    changeFileBtn: string;
    optionalNoteLabel: string;
    optionalNotePlaceholder: string;
    trySampleReportBtn: string;
    trySamplePrescriptionBtn: string;
    pasteLabLabel: string;
    pastePrescriptionLabel: string;
    dictateByVoice: string;
    stopDictation: string;
    transcribingVoice: string;
    clearText: string;
    labPlaceholder: string;
    prescriptionPlaceholder: string;
    listeningIn: string;
    speakClearlyHint: string;
    transcribingStatus: string;
    mobileVoiceHint: string;
    desktopVoiceHint: string;
    tryAgainBtn: string;
    sessionPrivacyNote: string;
    readingCarefullyBtn: string;
    explainInPlainWordsBtn: string;
  };
  profile: {
    sectionTitle: string;
    sessionOnlyNote: string;
    unlocksSpecialist: string;
    fieldsCountLabel: string;
    fillSampleProfile: string;
    clearProfile: string;
    nameLabel: string;
    namePlaceholder: string;
    ageLabel: string;
    agePlaceholder: string;
    sexLabel: string;
    sexSelectPlaceholder: string;
    sexFemale: string;
    sexMale: string;
    sexOther: string;
    sexPreferNot: string;
    bloodTypeLabel: string;
    bloodTypeSelectPlaceholder: string;
    bloodTypeUnknown: string;
    sugarLabel: string;
    sugarPlaceholder: string;
    allergyLabel: string;
    allergyPlaceholder: string;
    bpLabel: string;
    bpPlaceholder: string;
    conditionsLabel: string;
    conditionsPlaceholder: string;
    heightLabel: string;
    heightPlaceholder: string;
    weightLabel: string;
    weightPlaceholder: string;
    otherLabel: string;
    otherPlaceholder: string;
    completeBanner: string;
    activeForReports: string;
    completeRemainingPrefix: string;
    completeRemainingSuffix: string;
    optionalAllFieldsNote: string;
    openSpecialistLink: string;
    goToSpecialistLink: string;
  };
  history: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    clearHistory: string;
    emptyTitle: string;
    emptyBody: string;
    noMatchesPrefix: string;
    resetFilter: string;
    modeLab: string;
    modePrescription: string;
    modeUpload: string;
    itemsLabel: string;
    scoreLabel: string;
  };
  loading: {
    messages: string[];
    preparingInLanguage: string; // uses {language}
  };
  results: {
    urgentBannerTitle: string;
    urgentBannerBody: string;
    atAGlance: string;
    languageLabel: string;
    reassuranceHeaderWithName: string; // uses {name}
    reassuranceHeaderDefault: string;
    shareReady: string;
    shareWithFamily: string;
    seeDoctorQuestionsCount: string; // uses {count}
    clarityScoreTitle: string;
    verifiedBadge: string;
    clarityHigh: string;
    clarityGood: string;
    clarityPartial: string;
    defaultConfidenceNote: string;
    itemByItemTitle: string;
    showingItemsCount: string; // uses {count}
    rangesVaryNote: string;
    filterAll: string;
    filterOutsideRange: string;
    filterTypical: string;
    statusNormal: string;
    statusSlightlyHigh: string;
    statusSlightlyLow: string;
    statusDiscussSoon: string;
    statusPrescribedMedicine: string;
    typicalRefRange: string;
    checkLabPrintout: string;
    generallyUsedFor: string;
    howItIsWritten: string;
    medicineSafetyFooter: string;
    everydayWellbeingKicker: string;
    lifestyleTipsTitle: string;
    gentleDailyHabitsNote: string;
    defaultLifestyleTips: string[];
    lifestyleDisclaimer: string;
    visitChecklistKicker: string;
    questionsForDoctorTitle: string;
    questionsSubtitle: string;
    copiedBtn: string;
    copyQuestionsBtn: string;
    printSavePdfBtn: string;
    importantDisclaimerLabel: string;
    resultsDisclaimerLine1: string;
    resultsDisclaimerLine2: string;
  };
  chat: {
    sectionKicker: string;
    sectionTitle: string;
    sectionSubtitle: string;
    lockedTitle: string;
    lockedBody: string;
    profileProgressLabel: string;
    completedCountLabel: string;
    stillNeededLabel: string;
    goToProfileBtn: string;
    fillSampleProfileBtn: string;
    consentLine: string;
    sessionPrivacyActive: string;
    bloodChipPrefix: string;
    sugarChipPrefix: string;
    conditionsChipPrefix: string;
    allergiesChipPrefix: string;
    editProfileBtn: string;
    copySummaryBtn: string;
    copiedSummaryBtn: string;
    newChatBtn: string;
    clearChatBtn: string;
    clearConfirmTitle: string;
    clearConfirmDesc: string;
    cancelBtn: string;
    confirmClearBtn: string;
    emergencyBannerTitle: string;
    emergencyBannerBody: string;
    call112Btn: string;
    emptyClearedTitle: string;
    emptyClearedBody: string;
    restoreGreetingBtn: string;
    guideSuffix: string;
    youLabel: string;
    routineGuidanceBadge: string;
    suggestedCheckInPrefix: string;
    firstBotDisclaimer: string;
    seeADoctorLabel: string;
    suggestedSpecialistPrefix: string;
    findDoctorNearMeBtn: string;
    thinkingStatus: string; // uses {specialty}
    retryBtn: string;
    inputPlaceholder: string;
    sendBtn: string;
    persistentDisclaimer: string;
    firstBotGreeting: string; // uses {name} and {highlight}
    suggestionChips: string[];
    urgencyLabels: {
      emergency: string;
      urgent: string;
      soon: string;
      routine: string;
    };
    specialists: Record<
      | "General Physician"
      | "Cardiologist"
      | "Endocrinologist/Diabetes"
      | "Dermatologist"
      | "Neurologist"
      | "Gastroenterologist"
      | "Women's Health"
      | "Pediatrician"
      | "Mental Wellbeing",
      { label: string; shortDesc: string }
    >;
    doctorSummaryHeader: string;
    doctorSummaryPreparedOn: string;
    doctorSummaryProfileSection: string;
    doctorSummarySymptomsSection: string;
    doctorSummaryNoSymptoms: string;
    doctorSummaryGuideNoteSection: string;
    doctorSummaryLatestDiscussion: string;
    doctorSummaryQuestionsSection: string;
    doctorSummaryDefaultQuestions: string[];
  };
  safetyFixed: {
    emergencyMessage: string;
    medicineRefusalMessage: string;
  };
  howItWorks: {
    kicker: string;
    title: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  faq: {
    kicker: string;
    title: string;
    subtitle: string;
    items: Array<{ question: string; answer: string }>;
  };
  footer: {
    disclaimerLine1: string;
    disclaimerLine2: string;
    sessionOnlyNote: string;
    madeWithCare: string;
  };
  mobileDock: {
    newReport: string;
    items: string;
    doctorQs: string;
    share: string;
    shared: string;
    snapPhoto: string;
    voice: string;
    stop: string;
    reading: string;
    explainNow: string;
    pasteOrUpload: string;
  };
  settingsModal: {
    title: string;
    appearanceLabel: string;
    appearanceDesc: string;
    warmIvory: string;
    quietDark: string;
    textSizeLabel: string;
    standardText: string;
    largerText: string;
    languageLabel: string;
    doneBtn: string;
  };
  errors: {
    selectPhotoOrPdf: string;
    pastePrescriptionFirst: string;
    pasteLabFirst: string;
    fileTooLarge: string;
    invalidFileType: string;
    fileReadError: string;
    messageTooLong: string;
    genericAnalyzeError: string;
    genericChatError: string;
  };
}
