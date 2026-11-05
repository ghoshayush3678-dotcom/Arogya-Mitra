// Review by a native speaker before real-world use.
import type { TranslationDictionary } from "./types";

const hi: TranslationDictionary = {
  meta: {
    code: "hi",
    nativeName: "हिन्दी",
    englishName: "Hindi",
  },
  nav: {
    brandSubtitle: "शांत स्वास्थ्य साथी",
    explainReport: "रिपोर्ट समझें",
    askSpecialist: "विशेषज्ञ से पूछें",
    sampleReport: "उदाहरण रिपोर्ट",
    howItWorks: "यह कैसे काम करता है",
    faq: "सामान्य प्रश्न",
    settings: "सेटिंग्स",
    snapPhoto: "फ़ोटो लें",
    commonQA: "सामान्य प्रश्न",
    quietDark: "शांत डार्क",
    warmIvory: "हल्का आइवरी",
  },
  languageSelector: {
    label: "भाषा",
    searchPlaceholder: "15 भाषाओं में खोजें (हिन्दी, English, தமிழ்…)",
    noResults: "कोई मिलती-जुलती भाषा नहीं मिली।",
    betaBadge: "बीटा",
    betaNote:
      "हमारा AI अभी यह भाषा सीख रहा है। कृपया ज़रूरी जानकारी डॉक्टर से ज़रूर जाँच लें।",
    languageChangedNotice:
      "भाषा बदल दी गई है। अब से आपके विशेषज्ञ {language} में उत्तर देंगे।",
    close: "बंद करें",
    selectLanguageTitle: "अपनी भाषा चुनें",
    allLanguages: "15 भारतीय और अंग्रेज़ी भाषाएँ",
  },
  hero: {
    kicker: "गहरी साँस लें। आइए इसे मिलकर आसान भाषा में समझें।",
    headlinePrefix: "आपकी स्वास्थ्य रिपोर्ट, समझाई गई",
    headlineEmphasis: "बिल्कुल एक दोस्त की तरह",
    subheadline:
      "अपनी लैब रिपोर्ट या डॉक्टर की पर्ची यहाँ पेस्ट करें—या फ़ोटो/PDF अपलोड करें—ताकि हर जाँच का शांत, सरल भाषा में अर्थ, सामान्य सीमा और डॉक्टर से पूछने योग्य सवाल समझ सकें।",
    explainMyReportBtn: "मेरी रिपोर्ट समझाएं",
    snapPhotoMobileBtn: "मेरी रिपोर्ट की फ़ोटो लें",
    trySampleLink: "या पहले एक उदाहरण रिपोर्ट देखें",
    trustNothingStored: "कुछ भी सेव नहीं होता",
    trustClarityScore: "AI स्पष्टता स्कोर / 100",
    trustLanguagesCount: "15 भाषाओं में उपलब्ध",
    sampleCardTitle: "उदाहरण लैब कार्ड",
    clarityBadge: "स्पष्टता: 98 / 100",
    sampleTestName: "Fasting Blood Glucose (खाली पेट ब्लड शुगर)",
    sampleTypicalRange: "सामान्य वयस्क सीमा: 70 – 99 mg/dL",
    slightlyHigh: "थोड़ा अधिक",
    lower: "कम",
    typicalRange: "सामान्य सीमा",
    higher: "अधिक",
    sampleExplanation:
      "यह रात भर खाली पेट रहने के बाद रक्त में शुगर (glucose) की मात्रा मापता है। 99 mg/dL से थोड़ा ऊपर का मान कभी-कभी खान-पान या शरीर की पाचन प्रक्रिया से जुड़ा हो सकता है, जिस पर अपने डॉक्टर से आराम से चर्चा करें।",
    reassuranceFloatingNote: "यहाँ कुछ भी डरावना नहीं है। आइए इसे स्पष्ट करें।",
    sanctuaryCaption: "तुलसी, अश्वगंधा और शांत स्पष्टता",
    sanctuaryBadge: "आयुर्वेदिक शांति",
    sanctuaryKicker: "आयुर्वेदिक सहजता से प्रेरित",
    sanctuaryTitlePrefix: "जहाँ प्राचीन शांत देखभाल मिलती है",
    sanctuaryTitleEmphasis: "आधुनिक मेडिकल स्पष्टता से",
    sanctuaryBody:
      "आयुर्वेद में सच्चा स्वास्थ्य (स्वास्थ्य) तब शुरू होता है जब मन शांत और भयमुक्त हो। मेडिकल नंबर और कठिन शब्द उलझन पैदा कर सकते हैं—इसलिए आरोग्य मित्र उन्हें धैर्य और सरल शब्दों में समझाता है।",
    pillar1Title: "शांत साँस लें",
    pillar1Desc: "किसी भी नंबर से पहले भरोसा और सरल शब्द।",
    pillar2Title: "पूरी स्पष्टता",
    pillar2Desc: "हर जाँच का आसान और सच्चा अर्थ।",
    pillar3Title: "भरोसेमंद मित्र",
    pillar3Desc: "डॉक्टर की मुलाक़ात के लिए उपयोगी प्रश्न।",
  },
  workspace: {
    tabLab: "लैब रिपोर्ट",
    tabLabMobile: "लैब रिपोर्ट",
    tabPrescription: "दवा की पर्ची",
    tabPrescriptionMobile: "पर्ची",
    tabUpload: "फ़ोटो या PDF अपलोड करें",
    tabUploadMobile: "फ़ोटो / PDF",
    uploadLabel: "अपनी लैब रिपोर्ट या पर्ची की साफ़ फ़ोटो या PDF अपलोड करें",
    uploadFormats: "JPG, PNG, WebP, या PDF · अधिकतम 10 MB",
    uploadDropTitle: "फ़ोन कैमरे से फ़ोटो लें या फ़ाइल चुनें",
    uploadDropSub:
      "आपको सरल भाषा में पूरी जानकारी और 100 में से AI स्पष्टता स्कोर मिलेगा।",
    takePhotoBtn: "कैमरे से फ़ोटो लें",
    chooseFileBtn: "फ़ोटो या PDF चुनें",
    readyToExplain: "समझने के लिए तैयार",
    retakeBtn: "दोबारा लें",
    changeFileBtn: "फ़ाइल बदलें",
    optionalNoteLabel: 'वैकल्पिक नोट (उदाहरण: "थायरॉइड नंबरों पर ध्यान दें")',
    optionalNotePlaceholder: "यदि कोई अतिरिक्त बात बतानी हो तो यहाँ लिखें…",
    trySampleReportBtn: "उदाहरण रिपोर्ट देखें",
    trySamplePrescriptionBtn: "उदाहरण पर्ची देखें",
    pasteLabLabel: "अपनी लैब रिपोर्ट के शब्द या नंबर यहाँ पेस्ट करें या बोलें",
    pastePrescriptionLabel: "अपनी पर्ची की दवाइयों और निर्देशों को यहाँ पेस्ट करें या बोलें",
    dictateByVoice: "बोलकर लिखें",
    stopDictation: "बोलना रोकें",
    transcribingVoice: "आवाज़ लिखी जा रही है…",
    clearText: "टेक्स्ट हटाएं",
    labPlaceholder:
      "उदाहरण:\nHemoglobin: 11.3 g/dL (Ref: 12.0 - 15.5)\nTotal Cholesterol: 216 mg/dL (Desirable < 200)\nFasting Blood Glucose: 105 mg/dL (Normal: 70 - 99)\nTSH: 2.4 mIU/L (0.45 - 4.50)",
    prescriptionPlaceholder:
      "उदाहरण:\n1. Tab Metformin 500mg — 1 गोली दिन में दो बार भोजन के साथ\n2. Tab Atorvastatin 10mg — 1 गोली रात में\n3. Cap Vitamin D3 60,000 IU — हफ्ते में एक बार 8 हफ्तों तक",
    listeningIn: "{language} में सुना जा रहा है…",
    speakClearlyHint: "अपनी जाँच के नाम, नंबर या दवाइयाँ साफ़ बोलें",
    transcribingStatus: "आपकी बोली गई रिपोर्ट को टेक्स्ट में बदला जा रहा है…",
    mobileVoiceHint: "बोलने के लिए माइक दबाएं या फ़ोटो के लिए कैमरा टैब चुनें",
    desktopVoiceHint: "आराम से कुछ लाइनें पेस्ट करें या बोलकर लिखने के लिए माइक दबाएं",
    tryAgainBtn: "पुनः प्रयास करें",
    sessionPrivacyNote:
      "आपकी रिपोर्ट केवल इसी सेशन के लिए प्रोसेस होती है और कहीं सेव नहीं की जाती।",
    readingCarefullyBtn: "ध्यान से पढ़ा जा रहा है…",
    explainInPlainWordsBtn: "सरल शब्दों में समझाएं",
  },
  profile: {
    sectionTitle: "व्यक्तिगत स्वास्थ्य प्रोफ़ाइल",
    sessionOnlyNote: "केवल इस सेशन के लिए (कभी सेव नहीं होता)",
    unlocksSpecialist: "विशेषज्ञ चैट अनलॉक करता है",
    fieldsCountLabel: "फ़ील्ड",
    fillSampleProfile: "उदाहरण प्रोफ़ाइल भरें",
    clearProfile: "प्रोफ़ाइल साफ़ करें",
    nameLabel: "आपका नाम",
    namePlaceholder: "जैसे, रिया सेन",
    ageLabel: "उम्र",
    agePlaceholder: "जैसे, 42",
    sexLabel: "लिंग (Sex)",
    sexSelectPlaceholder: "चुनें",
    sexFemale: "महिला (Female)",
    sexMale: "पुरुष (Male)",
    sexOther: "अन्य (Non-binary / Other)",
    sexPreferNot: "बताना नहीं चाहते",
    bloodTypeLabel: "ब्लड ग्रुप (Blood Type)",
    bloodTypeSelectPlaceholder: "ब्लड ग्रुप चुनें",
    bloodTypeUnknown: "पता नहीं / अनिश्चित",
    sugarLabel: "डायबिटीज़ / ब्लड शुगर स्थिति",
    sugarPlaceholder: "जैसे, नहीं, प्री-डायबिटीज़, टाइप 2 डायबिटीज़",
    allergyLabel: "एलर्जी (Allergies)",
    allergyPlaceholder: "जैसे, कोई नहीं, पेनिसिलिन, मूंगफली",
    bpLabel: "ब्लड प्रेशर / सूजन संबंधी समस्या",
    bpPlaceholder: "जैसे, सामान्य BP, हाई BP, कोई नहीं",
    conditionsLabel: "मौजूदा स्वास्थ्य स्थितियाँ",
    conditionsPlaceholder: "जैसे, कोई नहीं, थायरॉइड, अस्थमा, PCOS",
    heightLabel: "लंबाई (Height)",
    heightPlaceholder: "168 cm / 5'6\"",
    weightLabel: "वज़न (Weight)",
    weightPlaceholder: "65 kg / 143 lb",
    otherLabel: "अन्य जानकारी",
    otherPlaceholder: "जैसे, शाकाहारी, रोज़ टहलना, कोई नहीं",
    completeBanner:
      "स्वास्थ्य प्रोफ़ाइल पूर्ण ({summary}) — 'विशेषज्ञ से पूछें' चैट अब खुली है और रिपोर्ट का विवरण आपके अनुसार होगा।",
    activeForReports: "रिपोर्ट के लिए सक्रिय:",
    completeRemainingPrefix: "कृपया",
    completeRemainingSuffix:
      'पूरा करें (यदि लागू न हो तो "None" लिखें) ताकि विशेषज्ञ चैट खुल सके।',
    optionalAllFieldsNote:
      "रिपोर्ट समझने के लिए सभी फ़ील्ड वैकल्पिक हैं, लेकिन 'विशेषज्ञ से पूछें' चैट शुरू करने के लिए ऊपर के सभी फ़ील्ड भरें (लागू न होने पर 'None' लिखें)।",
    openSpecialistLink: "विशेषज्ञ चैट खोलें",
    goToSpecialistLink: "विशेषज्ञ चैट पर जाएं",
  },
  history: {
    title: "सेशन इतिहास (History)",
    subtitle:
      "आपकी पिछली 3 व्याख्याएँ केवल इसी ब्राउज़र में निजी रूप से रहती हैं ताकि आप उन्हें दोबारा देख सकें।",
    searchPlaceholder: "कीवर्ड से खोजें…",
    clearHistory: "इतिहास मिटाएं",
    emptyTitle: "आपकी शांत पढ़ने की शेल्फ तैयार है",
    emptyBody:
      "अभी इस ब्राउज़र में कोई हालिया रिपोर्ट सेव नहीं है। जब आप कोई रिपोर्ट या पर्ची समझेंगे, तो पिछली 3 रिपोर्ट यहाँ दिखेंगी।",
    noMatchesPrefix: "कोई सेव की गई रिपोर्ट इससे मेल नहीं खाती:",
    resetFilter: "फ़िल्टर हटाएं",
    modeLab: "लैब रिपोर्ट",
    modePrescription: "दवा की पर्ची",
    modeUpload: "अपलोड की गई फ़ाइल",
    itemsLabel: "मदें",
    scoreLabel: "स्कोर",
  },
  loading: {
    messages: [
      "आपकी रिपोर्ट ध्यान से पढ़ी जा रही है…",
      "यहाँ कुछ भी डरावना नहीं है। आइए इसे आसान बनाएं…",
      "सामान्य वयस्क संदर्भ सीमाओं से तुलना की जा रही है…",
      "कठिन मेडिकल शब्दों को सरल और शांत भाषा में बदला जा रहा है…",
      "आपके डॉक्टर से पूछने के लिए उपयोगी सवाल तैयार किए जा रहे हैं…",
    ],
    preparingInLanguage: "{language} में आपकी सरल व्याख्या तैयार हो रही है…",
  },
  results: {
    urgentBannerTitle: "जल्द ही अपने डॉक्टर से दिखाना उचित होगा",
    urgentBannerBody:
      "एक या अधिक मानों पर शीघ्र ध्यान देने की आवश्यकता हो सकती है। कृपया जल्द अपने डॉक्टर से संपर्क करें।",
    atAGlance: "एक नज़र में",
    languageLabel: "भाषा",
    reassuranceHeaderWithName:
      "{name}, यहाँ कुछ भी डरावना नहीं है। आइए इसे स्पष्ट करें।",
    reassuranceHeaderDefault: "यहाँ कुछ भी डरावना नहीं है। आइए इसे स्पष्ट करें।",
    shareReady: "साझा करने के लिए तैयार",
    shareWithFamily: "परिवार के साथ सारांश साझा करें",
    seeDoctorQuestionsCount: "डॉक्टर के लिए {count} प्रश्न देखें",
    clarityScoreTitle: "AI स्पष्टता स्कोर",
    verifiedBadge: "सत्यापित",
    clarityHigh: "उच्च पठन स्पष्टता",
    clarityGood: "अच्छी स्पष्टता · मानक सीमाएँ लागू",
    clarityPartial: "आंशिक स्पष्टता · मूल रिपोर्ट से मिलान करें",
    defaultConfidenceNote:
      "आपके दस्तावेज़ की प्रत्येक जाँच, इकाई और संदर्भ सीमा का मानक मेडिकल बेंचमार्क से स्पष्ट मिलान किया गया है।",
    itemByItemTitle: "एक-एक जाँच का सरल विवरण",
    showingItemsCount: "{count} मदें दिखाई जा रही हैं",
    rangesVaryNote: "लैब, उम्र और लिंग के अनुसार संदर्भ सीमाएँ भिन्न हो सकती हैं",
    filterAll: "सभी",
    filterOutsideRange: "सीमा से बाहर",
    filterTypical: "सामान्य",
    statusNormal: "सामान्य सीमा में",
    statusSlightlyHigh: "थोड़ा अधिक",
    statusSlightlyLow: "थोड़ा कम",
    statusDiscussSoon: "डॉक्टर से जल्द चर्चा करें",
    statusPrescribedMedicine: "निर्धारित दवा",
    typicalRefRange: "सामान्य संदर्भ सीमा",
    checkLabPrintout: "लैब प्रिंटआउट देखें",
    generallyUsedFor: "आमतौर पर किसलिए उपयोग होती है:",
    howItIsWritten: "पर्ची पर कैसे लिखा है:",
    medicineSafetyFooter:
      "हमेशा अपने डॉक्टर के सटीक निर्देशों का पालन करें, और उनसे पूछे बिना कभी भी कोई दवा शुरू, बंद या खुराक में बदलाव न करें।",
    everydayWellbeingKicker: "दैनिक स्वास्थ्य",
    lifestyleTipsTitle: "3 सरल, गैर-चिकित्सीय जीवनशैली सुझाव",
    gentleDailyHabitsNote: "सहज दैनिक आदतें · यह डॉक्टरी सलाह नहीं है",
    defaultLifestyleTips: [
      "भोजन के बाद रोज़ 10 मिनट धीरे-धीरे टहलने की आदत डालें।",
      "दिन भर पर्याप्त पानी पीने के लिए अपने पास पानी की बोतल या गिलास रखें।",
      "हर रात लगभग एक ही समय पर शांत और आरामदायक नींद लेने का प्रयास करें।",
    ],
    lifestyleDisclaimer:
      "ये आपकी रिपोर्ट से प्रेरित सामान्य दैनिक स्वास्थ्य विचार हैं। अपने खान-पान या दिनचर्या में बड़ा बदलाव करने से पहले हमेशा डॉक्टर से पूछें।",
    visitChecklistKicker: "डॉक्टर विज़िट चेकलिस्ट",
    questionsForDoctorTitle: "अपने डॉक्टर से पूछने के लिए प्रश्न",
    questionsSubtitle:
      "अपॉइंटमेंट के दौरान किसी भी सवाल पर टैप करके निशान लगाएं, या सूची कॉपी और साझा करें।",
    copiedBtn: "कॉपी हो गया",
    copyQuestionsBtn: "प्रश्न कॉपी करें",
    printSavePdfBtn: "प्रिंट / PDF सेव करें",
    importantDisclaimerLabel: "महत्वपूर्ण अस्वीकरण:",
    resultsDisclaimerLine1:
      "आरोग्य मित्र केवल समझने के लिए है। यह डॉक्टरी सलाह, निदान (diagnosis), या किसी योग्य डॉक्टर का विकल्प नहीं है।",
    resultsDisclaimerLine2:
      "यदि आपकी तबीयत खराब लग रही है या यह आपातकालीन स्थिति है, तो तुरंत डॉक्टर या आपातकालीन सेवा से संपर्क करें।",
  },
  chat: {
    sectionKicker: "व्यक्तिगत स्वास्थ्य मार्गदर्शक",
    sectionTitle: "विशेषज्ञ से पूछें",
    sectionSubtitle:
      "अपनी स्वास्थ्य प्रोफ़ाइल के आधार पर शांत AI विशेषज्ञ गाइड से अपने लक्षणों और स्वास्थ्य प्रश्नों पर सरल भाषा में बात करें।",
    lockedTitle:
      "अपनी स्वास्थ्य प्रोफ़ाइल पूरी करें ताकि आपके विशेषज्ञ आपको बेहतर समझ सकें।",
    lockedBody:
      'आपके लक्षणों को सही संदर्भ में समझने के लिए कृपया सभी 11 प्रोफ़ाइल फ़ील्ड भरें (यदि कोई बीमारी या एलर्जी लागू न हो तो "None" लिखें)। आपकी प्रोफ़ाइल केवल इसी सेशन में रहती है और कभी सेव नहीं होती।',
    profileProgressLabel: "प्रोफ़ाइल प्रगति",
    completedCountLabel: "पूर्ण",
    stillNeededLabel: "अभी बाकी है:",
    goToProfileBtn: "स्वास्थ्य प्रोफ़ाइल फ़ॉर्म पर जाएं",
    fillSampleProfileBtn: "अभी आज़माने के लिए उदाहरण प्रोफ़ाइल भरें",
    consentLine:
      "आपकी प्रोफ़ाइल का उपयोग केवल इस बातचीत को आपके अनुकूल बनाने के लिए किया जाता है और इसे कभी सेव नहीं किया जाता।",
    sessionPrivacyActive: "केवल सेशन गोपनीयता सक्रिय",
    bloodChipPrefix: "ब्लड:",
    sugarChipPrefix: "शुगर:",
    conditionsChipPrefix: "स्थितियाँ:",
    allergiesChipPrefix: "एलर्जी:",
    editProfileBtn: "प्रोफ़ाइल बदलें",
    copySummaryBtn: "डॉक्टर के लिए सारांश कॉपी करें",
    copiedSummaryBtn: "सारांश कॉपी हो गया",
    newChatBtn: "नई चैट",
    clearChatBtn: "चैट साफ़ करें",
    clearConfirmTitle: "क्या इस सेशन के सभी विशेषज्ञ चैट संदेश हटाएं?",
    clearConfirmDesc:
      "इससे वर्तमान बातचीत के सभी संदेश हट जाएंगे। आपकी स्वास्थ्य प्रोफ़ाइल सुरक्षित रहेगी।",
    cancelBtn: "रद्द करें",
    confirmClearBtn: "हाँ, चैट साफ़ करें",
    emergencyBannerTitle: "कृपया अभी तुरंत चिकित्सा सहायता लें।",
    emergencyBannerBody:
      "तुरंत आपातकालीन सेवा (112) पर कॉल करें या नज़दीकी अस्पताल के इमरजेंसी विभाग में जाएं।",
    call112Btn: "112 पर कॉल करें",
    emptyClearedTitle: "इस सेशन के चैट संदेश साफ़ कर दिए गए हैं",
    emptyClearedBody:
      "आपकी बातचीत का इतिहास हटा दिया गया है। नीचे नया सवाल लिखें, सुझाए गए विकल्प चुनें या नया अभिवादन शुरू करें।",
    restoreGreetingBtn: "विशेषज्ञ का स्वागत संदेश वापस लाएं",
    guideSuffix: "गाइड",
    youLabel: "आप",
    routineGuidanceBadge: "सामान्य मार्गदर्शन",
    suggestedCheckInPrefix: "सुझाए गए डॉक्टर:",
    firstBotDisclaimer:
      "यह AI गाइड केवल समझने के लिए है। यह डॉक्टर, निदान या चिकित्सीय सलाह नहीं है। आपातकाल में 112 पर कॉल करें या नज़दीकी अस्पताल जाएं।",
    seeADoctorLabel: "डॉक्टर को दिखाएं",
    suggestedSpecialistPrefix: "सुझाए गए विशेषज्ञ:",
    findDoctorNearMeBtn: "मेरे पास डॉक्टर खोजें",
    thinkingStatus: "{specialty} गाइड सोच रहे हैं…",
    retryBtn: "पुनः प्रयास करें",
    inputPlaceholder:
      "अपने विशेषज्ञ गाइड को बताएं कि आपको क्या महसूस हो रहा है… (भेजने के लिए Enter, नई लाइन के लिए Shift+Enter)",
    sendBtn: "भेजें",
    persistentDisclaimer:
      "यह AI गाइड केवल समझने के लिए है। यह डॉक्टर, निदान या चिकित्सीय सलाह नहीं है। आपातकाल में 112 पर कॉल करें या नज़दीकी अस्पताल जाएं।",
    firstBotGreeting:
      "नमस्ते {name}, मैंने आपकी प्रोफ़ाइल पढ़ ली है — जिसमें {highlight} शामिल है। मुझे बताएं कि आपको क्या तकलीफ़ हो रही है, हम इसे आराम से एक साथ समझेंगे।",
    suggestionChips: [
      "मुझे सिरदर्द हो रहा है",
      "मुझे हर समय थकान लगती है",
      "मेरे लक्षणों का मतलब समझाएं",
      "क्या यह कोई गंभीर बात है?",
    ],
    urgencyLabels: {
      emergency: "आपातकाल — तुरंत चिकित्सा सहायता लें",
      urgent: "अत्यावश्यक — 24 घंटे के भीतर डॉक्टर को दिखाएं",
      soon: "कुछ दिनों के भीतर डॉक्टर से मिलें",
      routine: "सामान्य — नियमित अपॉइंटमेंट में चर्चा करें",
    },
    specialists: {
      "General Physician": {
        label: "जनरल फ़िज़िशियन (General Physician)",
        shortDesc: "दैनिक लक्षण, बुखार, थकान, बदन दर्द और सामान्य स्वास्थ्य",
      },
      Cardiologist: {
        label: "हृदय रोग विशेषज्ञ (Cardiologist)",
        shortDesc: "दिल की धड़कन, ब्लड प्रेशर, रक्त संचार और सीने का आराम",
      },
      "Endocrinologist/Diabetes": {
        label: "एंडोक्रिनोलॉजिस्ट / डायबिटीज़ (Endocrinologist)",
        shortDesc: "ब्लड शुगर, डायबिटीज़, थायरॉइड, हार्मोन और मेटाबॉलिज़्म",
      },
      Dermatologist: {
        label: "त्वचा विशेषज्ञ (Dermatologist)",
        shortDesc: "त्वचा पर चकत्ते, खुजली, एलर्जी, बाल और नाखून की समस्याएं",
      },
      Neurologist: {
        label: "न्यूरोलॉजिस्ट (Neurologist)",
        shortDesc: "सिरदर्द, माइग्रेन, चक्कर आना, झुनझुनी और नींद",
      },
      Gastroenterologist: {
        label: "पेट रोग विशेषज्ञ (Gastroenterologist)",
        shortDesc: "पाचन, एसिडिटी, पेट फूलना और आंतों का स्वास्थ्य",
      },
      "Women's Health": {
        label: "महिला स्वास्थ्य (Women's Health)",
        shortDesc: "मासिक धर्म, PCOS, प्रेग्नेंसी देखभाल, आयरन और हार्मोन",
      },
      Pediatrician: {
        label: "बाल रोग विशेषज्ञ (Pediatrician)",
        shortDesc: "बच्चों का विकास, पोषण, बुखार और कोमल देखभाल",
      },
      "Mental Wellbeing": {
        label: "मानसिक स्वास्थ्य (Mental Wellbeing)",
        shortDesc: "तनाव, घबराहट, उदास मन, नींद और मानसिक शांति",
      },
    },
    doctorSummaryHeader: "आरोग्य मित्र — डॉक्टर से मुलाक़ात के लिए सरल सारांश",
    doctorSummaryPreparedOn: "तैयार करने की तिथि",
    doctorSummaryProfileSection: "1. मरीज़ की स्वास्थ्य प्रोफ़ाइल:",
    doctorSummarySymptomsSection: "2. मरीज़ द्वारा बताए गए लक्षण और चिंताएं:",
    doctorSummaryNoSymptoms: "(अभी कोई विशेष लक्षण नहीं लिखे गए हैं)",
    doctorSummaryGuideNoteSection: "3. AI हेल्थ गाइड नोट और सुझाए गए विशेषज्ञ:",
    doctorSummaryLatestDiscussion: "4. बातचीत का मुख्य सारांश:",
    doctorSummaryQuestionsSection: "5. डॉक्टर से पूछने के लिए प्रश्न:",
    doctorSummaryDefaultQuestions: [
      "मेरी स्वास्थ्य प्रोफ़ाइल को देखते हुए इन लक्षणों का सबसे संभावित कारण क्या हो सकता है?",
      "क्या आप अभी कोई विशेष जाँच या टेस्ट कराने की सलाह देते हैं?",
      "किन चेतावनी संकेतों के दिखने पर मुझे तुरंत दोबारा दिखाना चाहिए?",
    ],
  },
  safetyFixed: {
    emergencyMessage:
      "ये लक्षण एक गंभीर चिकित्सीय आपातकाल (medical emergency) के संकेत हो सकते हैं। कृपया तुरंत 112 पर कॉल करें या सबसे नज़दीकी अस्पताल के इमरजेंसी विभाग में जाएं। कृपया देरी न करें और यदि संभव हो तो किसी की मदद लें।",
    medicineRefusalMessage:
      "आपकी सुरक्षा सबसे ज़रूरी है, इसलिए मैं किसी भी दवा, टैबलेट, सप्लीमेंट या घरेलू नुस्खे का नाम, सलाह या खुराक नहीं बता सकता। आपकी स्वास्थ्य प्रोफ़ाइल और पूरे मेडिकल इतिहास को देखते हुए केवल एक योग्य डॉक्टर या फ़ार्मासिस्ट ही सही दवा बता सकते हैं। मैं आपके लक्षणों को नोट करने, किन बातों पर नज़र रखें, और डॉक्टर से क्या पूछें—इसमें आपकी पूरी मदद कर सकता हूँ।",
  },
  howItWorks: {
    kicker: "आरोग्य मित्र कैसे काम करता है",
    title: "उलझन से स्पष्टता तक के तीन आसान कदम।",
    step1Title: "अपना दस्तावेज़ साझा करें",
    step1Desc:
      "अपनी लैब रिपोर्ट या पर्ची का टेक्स्ट पेस्ट करें, बोलकर लिखें, या फ़ोटो/PDF अपलोड करें। सब कुछ केवल आपके वर्तमान ब्राउज़र सेशन में रहता है।",
    step2Title: "सरल शब्दों में पढ़ें",
    step2Desc:
      "जानें कि हर टेस्ट क्या मापता है, 100 में से आपका AI स्पष्टता स्कोर क्या है, और मान सामान्य सीमा की तुलना में कैसे हैं—15 भाषाओं में।",
    step3Title: "डॉक्टर की मुलाक़ात की तैयारी करें",
    step3Desc:
      "3 आसान जीवनशैली सुझाव पढ़ें और अपने डॉक्टर से शांत बातचीत के लिए प्रश्नों की सूची कॉपी या प्रिंट करें।",
  },
  faq: {
    kicker: "जानना ज़रूरी है",
    title: "सामान्य प्रश्न",
    subtitle:
      "गोपनीयता, स्पष्टता स्कोर और आरोग्य मित्र आपके स्वास्थ्य दस्तावेज़ों को कैसे पढ़ता है—इसके सीधे उत्तर।",
    items: [
      {
        question: "क्या मेरी स्वास्थ्य रिपोर्ट कहीं सेव की जाती है?",
        answer:
          "कभी नहीं। आपकी रिपोर्ट केवल इसी सेशन के लिए प्रोसेस होती है और किसी भी सर्वर या खाते में सेव नहीं होती। आपके ब्राउज़र में केवल पिछली 3 रिपोर्ट आपकी सुविधा के लिए रहती हैं, जिन्हें आप एक टैप में कभी भी हटा सकते हैं।",
      },
      {
        question: "100 में से AI स्पष्टता स्कोर का क्या मतलब है?",
        answer:
          "जब आप कोई लैब रिपोर्ट या पर्ची अपलोड या पेस्ट करते हैं, तो आरोग्य मित्र यह जांचता है कि प्रत्येक टेस्ट का नाम, संख्या, इकाई और संदर्भ सीमा कितनी स्पष्टता से पढ़ी गई है। उच्च स्कोर (90–100) का अर्थ है कि रिपोर्ट एकदम साफ़ थी।",
      },
      {
        question: "क्या यह मेरे डॉक्टर की जगह ले सकता है?",
        answer:
          "नहीं। आरोग्य मित्र केवल शांत स्वास्थ्य समझ के लिए बनाया गया है। किसी भी रिपोर्ट का पूरा अर्थ आपके डॉक्टर द्वारा आपकी शारीरिक जाँच और मेडिकल इतिहास के साथ देखने पर ही निकलता है।",
      },
      {
        question: "अलग-अलग लैब में संदर्भ सीमाएँ अलग क्यों होती हैं?",
        answer:
          "विभिन्न प्रयोगशालाएँ अलग-अलग मशीनों और रसायनों का उपयोग करती हैं। इसके अलावा उम्र, लिंग और समय के अनुसार भी सामान्य सीमाएँ बदलती हैं।",
      },
    ],
  },
  footer: {
    disclaimerLine1:
      "आरोग्य मित्र केवल समझने के लिए है। यह डॉक्टरी सलाह, निदान या किसी योग्य डॉक्टर का विकल्प नहीं है।",
    disclaimerLine2:
      "यदि आपकी तबीयत खराब है या यह आपातकालीन स्थिति है, तो तुरंत डॉक्टर या आपातकालीन सेवा से संपर्क करें।",
    sessionOnlyNote:
      "आपकी रिपोर्ट केवल इसी सेशन के लिए प्रोसेस होती है और कभी सेव नहीं होती।",
    madeWithCare: "शांत और संवेदनशील स्वास्थ्य साक्षरता के लिए स्नेहपूर्वक निर्मित।",
  },
  mobileDock: {
    newReport: "नई रिपोर्ट",
    items: "जाँचें",
    doctorQs: "डॉक्टर प्रश्न",
    share: "साझा करें",
    shared: "साझा किया",
    snapPhoto: "फ़ोटो लें",
    voice: "बोलें",
    stop: "रोकें",
    reading: "पढ़ रहे हैं…",
    explainNow: "अभी समझें",
    pasteOrUpload: "पेस्ट / अपलोड",
  },
  settingsModal: {
    title: "सेटिंग्स",
    appearanceLabel: "दिखावट (Appearance)",
    appearanceDesc:
      "दिन के समय पढ़ने के लिए हल्का आइवरी या शाम के लिए शांत डार्क मोड चुनें।",
    warmIvory: "हल्का आइवरी",
    quietDark: "शांत डार्क",
    textSizeLabel: "अक्षरों का आकार",
    standardText: "सामान्य (17.5px)",
    largerText: "बड़े अक्षर (18.5px)",
    languageLabel: "समझने की भाषा",
    doneBtn: "हो गया",
  },
  errors: {
    selectPhotoOrPdf:
      "आगे बढ़ने से पहले कृपया अपनी लैब रिपोर्ट या पर्ची की फ़ोटो या PDF चुनें।",
    pastePrescriptionFirst:
      "कृपया पहले अपनी पर्ची से दवाइयों के नाम और निर्देश पेस्ट करें, या 'उदाहरण पर्ची देखें' पर क्लिक करें।",
    pasteLabFirst:
      "कृपया पहले अपनी लैब रिपोर्ट की लाइनें पेस्ट करें, या उदाहरण देखने के लिए 'उदाहरण रिपोर्ट देखें' पर क्लिक करें।",
    fileTooLarge:
      "यह फ़ाइल 10 MB से बड़ी है। कृपया छोटी फ़ोटो या कम साइज का PDF चुनें।",
    invalidFileType: "कृपया साफ़ फ़ोटो (JPG, PNG, WebP) या PDF दस्तावेज़ अपलोड करें।",
    fileReadError:
      "हम आपके डिवाइस से वह फ़ाइल नहीं पढ़ सके। कृपया उसे दोबारा चुनें।",
    messageTooLong:
      "कृपया अपना संदेश 1,000 अक्षरों से कम रखें ताकि हम इसे स्पष्ट रूप से समझ सकें।",
    genericAnalyzeError:
      "अभी हम व्याख्या पूरी नहीं कर सके। कृपया अपना इनपुट जांचें और पुनः प्रयास करें।",
    genericChatError:
      "अभी आपके विशेषज्ञ गाइड से संपर्क नहीं हो सका। कृपया थोड़ा रुककर पुनः प्रयास करें।",
  },
};

export default hi;
