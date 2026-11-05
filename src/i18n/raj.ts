// Review by a native speaker before real-world use.
import type { TranslationDictionary } from "./types";

const raj: TranslationDictionary = {
  meta: {
    code: "raj",
    nativeName: "राजस्थानी",
    englishName: "Rajasthani",
  },
  nav: {
    brandSubtitle: "शांत स्वास्थ्य साथी",
    explainReport: "रिपोर्ट समझो",
    askSpecialist: "विशेषज्ञ सूं पूछो",
    sampleReport: "नमूना रिपोर्ट",
    howItWorks: "ओ कियां काम करै",
    faq: "आम सवाल",
    settings: "सेटिंग्स",
    snapPhoto: "फोटो खींचो",
    commonQA: "सवाल-जवाब",
    quietDark: "शांत डार्क",
    warmIvory: "गरम आइवरी",
  },
  languageSelector: {
    label: "भासा",
    searchPlaceholder: "15 भासा खोजो (राजस्थानी, हिन्दी, English…)",
    noResults: "कोई मिलती-जुलती भासा कोनी मिली।",
    betaBadge: "बीटा (Beta)",
    betaNote:
      "म्हारो AI अबार आ भासा सीख रह्यो है। जरूरी बातां डॉक्टर सूं जरूर पक्की कर ल्यो।",
    languageChangedNotice:
      "भासा बदल गई है। अबै सूं थारा विशेषज्ञ {language} में जवाब देसी।",
    close: "बंद करो",
    selectLanguageTitle: "आपाणी भासा चुणो",
    allLanguages: "15 भारतीय अर अंग्रेजी भासावां",
  },
  hero: {
    kicker: "एक लम्बो साँस ल्यो। चालो इण नै आराम सूं सागै मिल'र समझां।",
    headlinePrefix: "थारी हेल्थ रिपोर्ट, एकदम सरल भासा में",
    headlineEmphasis: "जियां कोई आपरो दोस्त समझावै",
    subheadline:
      "आपणी लैब रिपोर्ट या डॉक्टर री पर्ची पेस्ट करो — या फोटो/PDF अपलोड करो — हर जांच रो सीधो मतलब, कुणसो नंबर सामान्य रेंज सूं बारै है, अर डॉक्टर सूं पूछण जोग जरूरी सवाल जाणबा सारू।",
    explainMyReportBtn: "म्हारी रिपोर्ट समझाओ",
    snapPhotoMobileBtn: "रिपोर्ट री फोटो खींचो",
    trySampleLink: "या पैली एक नमूना रिपोर्ट देख ल्यो",
    trustNothingStored: "कीं भी सेव कोनी व्है",
    trustClarityScore: "AI स्पष्टता स्कोर / 100",
    trustLanguagesCount: "15 भासावां में उपलब्ध",
    sampleCardTitle: "नमूना लैब कार्ड",
    clarityBadge: "स्पष्टता: 98 / 100",
    sampleTestName: "Fasting Blood Glucose (भूखै पेट शुगर जांच)",
    sampleTypicalRange: "सामान्य वयस्क रेंज: 70 – 99 mg/dL",
    slightlyHigh: "थोड़ो सो ज्यादा",
    lower: "कम",
    typicalRange: "सामान्य रेंज",
    higher: "ज्यादा",
    sampleExplanation:
      "आ रात भर भूखै पेट रैया पछै खून में शुगर (blood sugar) नापै। 99 mg/dL सूं थोड़ो ऊपर होवणो शरीर में खाणो पचण रै तरीकै सूं जुड़्यो हो सकै अर डॉक्टर सूं आराम सूं बात करण जोग बात है।",
    reassuranceFloatingNote: "इण में डरबा री कोई बात कोनी। चालो साफ-साफ समझां।",
    sanctuaryCaption: "तुलसी, अश्वगंधा अर शांत समझ",
    sanctuaryBadge: "आयुर्वेदिक सुकून",
    sanctuaryKicker: "आयुर्वेदिक शांति सूं प्रेरित",
    sanctuaryTitlePrefix: "जठै पुराणी आरोग्य शांति मिलै",
    sanctuaryTitleEmphasis: "आज री साफ डॉक्टरी समझ सूं",
    sanctuaryBody:
      "आयुर्वेद में सांचो स्वास्थ्य जणा ही शुरू व्है जद मन शांत अर भय सूं मुक्त रवै। डॉक्टरी नंबर अर कठिन शब्द देख'र घबराहट हो सकै — इण वास्तै आरोग्य मित्र उणां नै धीरज अर सरल बोलचाल री भासा में समझावै।",
    pillar1Title: "शांत साँस ल्यो",
    pillar1Desc: "कोई भी नंबर देखण सूं पैली हिम्मत देवण वाळी सरल बातां।",
    pillar2Title: "साफ समझ",
    pillar2Desc: "हर जांच रो मतलब सीधी अर सांची भासा में।",
    pillar3Title: "भरोसेमंद साथी",
    pillar3Desc: "डॉक्टर सूं मिलण सारू तैयार जरूरी सवाल।",
  },
  workspace: {
    tabLab: "लैब रिपोर्ट",
    tabLabMobile: "लैब रिपोर्ट",
    tabPrescription: "डॉक्टर री पर्ची",
    tabPrescriptionMobile: "पर्ची",
    tabUpload: "फोटो या PDF अपलोड",
    tabUploadMobile: "फोटो / PDF",
    uploadLabel: "आपणी लैब रिपोर्ट या डॉक्टर री पर्ची री फोटो खींचो या PDF अपलोड करो",
    uploadFormats: "JPG, PNG, WebP, या PDF · अधिकतम 10 MB",
    uploadDropTitle: "फोन कैमरा सूं फोटो खींचो, या फाइल चुणो",
    uploadDropSub:
      "थानै सरल भासा में पूरी जाणकारी अर 100 में सूं AI स्पष्टता स्कोर मिलसी।",
    takePhotoBtn: "कैमरा सूं फोटो खींचो",
    chooseFileBtn: "फोटो या PDF चुणो",
    readyToExplain: "समझावण सारू तैयार",
    retakeBtn: "पाछी खींचो",
    changeFileBtn: "फाइल बदलो",
    optionalNoteLabel:
      'कोई खास बात (जियां: "थायरॉइड रा नंबरां पर ध्यान देवो")',
    optionalNotePlaceholder: "अगर कीं और बतावणो चाहो तो लिखो…",
    trySampleReportBtn: "नमूना रिपोर्ट देखो",
    trySamplePrescriptionBtn: "नमूना पर्ची देखो",
    pasteLabLabel:
      "आपणी लैब रिपोर्ट रा शब्द या नंबर पेस्ट करो या बोल'र लिखो",
    pastePrescriptionLabel:
      "पर्ची री दवाई रा नाम अर तरीको पेस्ट करो या बोल'र लिखो",
    dictateByVoice: "बोल'र लिखो",
    stopDictation: "बोलणो रोको",
    transcribingVoice: "थारी आवाज लिखी जा री है…",
    clearText: "साफ करो",
    labPlaceholder:
      "उदाहरण:\nHemoglobin: 11.3 g/dL (Ref: 12.0 - 15.5)\nTotal Cholesterol: 216 mg/dL (Desirable < 200)\nFasting Blood Glucose: 105 mg/dL (Normal: 70 - 99)\nTSH: 2.4 mIU/L (0.45 - 4.50)",
    prescriptionPlaceholder:
      "उदाहरण:\n1. Tab Metformin 500mg — दिन में 2 बार खाणै रै सागै 1 गोळी\n2. Tab Atorvastatin 10mg — रात नै 1 गोळी\n3. Cap Vitamin D3 60,000 IU — हफ्तै में एक बार 8 हफ्ता तांई",
    listeningIn: "{language} में सुण्यो जा रह्यो है…",
    speakClearlyHint: "आपणी जांच रा नाम, नंबर या दवाई साफ-साफ बोलो",
    transcribingStatus: "थारी बोली बात लिखावट में बदली जा री है…",
    mobileVoiceHint: "बोलण सारू माइक दबाओ या फोटो सारू कैमरा टैब चुणो",
    desktopVoiceHint:
      "आराम सूं कुछ लाइन पेस्ट करो या बोल'र पढ़ण सारू माइक दबाओ",
    tryAgainBtn: "पाछी कोसिस करो",
    sessionPrivacyNote:
      "थारी रिपोर्ट सिर्फ इण सेशन सारू ही काम में आवै अर कठेई सेव कोनी व्है।",
    readingCarefullyBtn: "ध्यान सूं पढ़ी जा री है…",
    explainInPlainWordsBtn: "सरल शब्दां में समझाओ",
  },
  profile: {
    sectionTitle: "निजी स्वास्थ्य प्रोफाइल",
    sessionOnlyNote: "सिर्फ इण सेशन सारू (कठेई सेव कोनी व्है)",
    unlocksSpecialist: "विशेषज्ञ चैट अनलॉक करै",
    fieldsCountLabel: "जाणकारी",
    fillSampleProfile: "नमूना प्रोफाइल भरो",
    clearProfile: "प्रोफाइल साफ करो",
    nameLabel: "थारो नाम",
    namePlaceholder: "जियां: रिया सेन",
    ageLabel: "उमर (Age)",
    agePlaceholder: "जियां: 42",
    sexLabel: "लिंग (Sex)",
    sexSelectPlaceholder: "चुणो",
    sexFemale: "महिला",
    sexMale: "पुरुष",
    sexOther: "अन्य",
    sexPreferNot: "कोनी बतावणो चावां",
    bloodTypeLabel: "ब्लड ग्रुप (Blood Type)",
    bloodTypeSelectPlaceholder: "ब्लड ग्रुप चुणो",
    bloodTypeUnknown: "पतो कोनी",
    sugarLabel: "शुगर / डायबिटीज री स्थिति",
    sugarPlaceholder: "जियां: कोनी, प्री-डायबिटीज, टाइप 2 डायबिटीज",
    allergyLabel: "एलर्जी (Allergies)",
    allergyPlaceholder: "जियां: कोई कोनी, पेनिसिलिन, मूंगफली",
    bpLabel: "ब्लड प्रेशर (BP) / सूजन री समस्या",
    bpPlaceholder: "जियां: सामान्य BP, हाई BP, कोनी",
    conditionsLabel: "पैली सूं कोई बीमारी",
    conditionsPlaceholder: "जियां: कोनी, थायरॉइड, अस्थमा, PCOS",
    heightLabel: "लंबाई (Height)",
    heightPlaceholder: "168 cm / 5'6\"",
    weightLabel: "वजन (Weight)",
    weightPlaceholder: "65 kg",
    otherLabel: "और कोई जाणकारी",
    otherPlaceholder: "जियां: शाकाहारी, रोज घूमणो, कोनी",
    completeBanner:
      "स्वास्थ्य प्रोफाइल पूरी हो गई ({summary}) — अबै 'विशेषज्ञ सूं पूछो' चैट खुल गई है अर रिपोर्ट री समझ भी थारै हिसाब सूं मिलसी।",
    activeForReports: "रिपोर्ट सारू चालू:",
    completeRemainingPrefix: "विशेषज्ञ चैट खोलण सारू बाकी",
    completeRemainingSuffix:
      'भरो (लागू कोनी व्है तो "कोनी" या "None" लिखो)।',
    optionalAllFieldsNote:
      "रिपोर्ट समझण सारू आं सगल़ा नै भरणो जरूरी कोनी, पण 'विशेषज्ञ सूं पूछो' चैट चलावण सारू ऊपर री सगल़ी जाणकारी भरो (लागू कोनी व्है तो 'None' लिखो)।",
    openSpecialistLink: "विशेषज्ञ चैट खोलो",
    goToSpecialistLink: "विशेषज्ञ चैट पर जाओ",
  },
  history: {
    title: "सेशन इतिहास",
    subtitle:
      "थारी पिछली 3 रिपोर्टां री समझ सिर्फ इण ब्राउज़र में सुरक्षित रवै ताकि थे पाछी देख सको।",
    searchPlaceholder: "शब्द सूं खोजो…",
    clearHistory: "इतिहास साफ करो",
    emptyTitle: "थारी पढ़ण री जगहां खाली है",
    emptyBody:
      "अबार इण ब्राउज़र में कोई रिपोर्ट सेव कोनी है। जद थे कोई रिपोर्ट या पर्ची समझसो, तो पिछला 3 रिजल्ट अठै दिखसी।",
    noMatchesPrefix: "कोई सेव व्ही रिपोर्ट कोनी मिली",
    resetFilter: "फिल्टर हटाओ",
    modeLab: "लैब रिपोर्ट",
    modePrescription: "पर्ची",
    modeUpload: "अपलोड व्ही फाइल",
    itemsLabel: "जांच",
    scoreLabel: "स्कोर",
  },
  loading: {
    messages: [
      "थारी रिपोर्ट ध्यान सूं पढ़ी जा री है…",
      "इण में डरबा री कोई बात कोनी। चालो साफ-साफ समझां…",
      "सामान्य वयस्क रेंज सूं नंबर मिलाया जा रैया है…",
      "कठिन डॉक्टरी शब्दां नै सरल बोलचाल में बदल्या जा रैया है…",
      "डॉक्टर सूं पूछण सारू काम रा सवाल तैयार कर्या जा रैया है…",
    ],
    preparingInLanguage:
      "{language} में थारी सरल जाणकारी तैयार करी जा री है…",
  },
  results: {
    urgentBannerTitle: "जल्दी ही आपणा डॉक्टर सूं मिल'र दिखावणो ठीक रैसी",
    urgentBannerBody:
      "एक या एक सूं ज्यादा नंबरां पर तुरंत ध्यान देवण री जरूरत हो सकै। कृपया आपणा डॉक्टर सूं जल्दी संपर्क करो।",
    atAGlance: "संक्षेप में मुख्य बात",
    languageLabel: "भासा",
    reassuranceHeaderWithName:
      "{name}, इण में डरबा री कोई बात कोनी। चालो साफ-साफ समझां।",
    reassuranceHeaderDefault:
      "इण में डरबा री कोई बात कोनी। चालो साफ-साफ समझां।",
    shareReady: "परिवार सूं शेयर करण सारू तैयार",
    shareWithFamily: "परिवार रै सागै सारांश शेयर करो",
    seeDoctorQuestionsCount: "डॉक्टर सारू {count} सवाल देखो",
    clarityScoreTitle: "AI स्पष्टता स्कोर",
    verifiedBadge: "जांच्यो गयो",
    clarityHigh: "घणो साफ पढ़्यो गयो",
    clarityGood: "अच्छी स्पष्टता · सामान्य रेंज लागू",
    clarityPartial: "आंशिक स्पष्टता · असली रिपोर्ट सूं मिला ल्यो",
    defaultConfidenceNote:
      "थारी रिपोर्ट री हर जांच, यूनिट अर रेंज नै मानक डॉक्टरी पैमानै सूं साफ-साफ मिलायो गयो है।",
    itemByItemTitle: "एक-एक जांच रो पूरो मतलब",
    showingItemsCount: "{count} आइटम दिख रैया है",
    rangesVaryNote: "लैब, उमर अर लिंग रै हिसाब सूं सामान्य रेंज थोड़ी अलग हो सकै",
    filterAll: "सगल़ा",
    filterOutsideRange: "रेंज सूं बारै",
    filterTypical: "सामान्य",
    statusNormal: "सामान्य रेंज में",
    statusSlightlyHigh: "थोड़ो सो ज्यादा",
    statusSlightlyLow: "थोड़ो सो कम",
    statusDiscussSoon: "डॉक्टर सूं जल्दी बात करो",
    statusPrescribedMedicine: "लिखी व्ही दवाई",
    typicalRefRange: "सामान्य संदर्भ रेंज",
    checkLabPrintout: "लैब रो कागज देखो",
    generallyUsedFor: "आमतौर पर किस काम आवै:",
    howItIsWritten: "कियां लेवण सारू लिख्यो है:",
    medicineSafetyFooter:
      "हमेशा आपणा डॉक्टर रा बताया निर्देश मानो, अर बिना डॉक्टर सूं पूछ्या कोई दवाई शुरू, बंद या उणरी खुराक मत बदलो।",
    everydayWellbeingKicker: "रोजमर्रा री सेहत",
    lifestyleTipsTitle: "3 सरल रोज री सेहतमंद आदतां",
    gentleDailyHabitsNote: "सरल आदतां · ओ डॉक्टरी इलाज कोनी है",
    defaultLifestyleTips: [
      "दिन रै कोई एक खाणै पछै 10 मिनट आराम सूं टहलण री कोसिस करो।",
      "दिन भर शरीर में पाणी री कमी ना व्है इण वास्तै कनै पाणी री बोतल राखो।",
      "रोज रात में लगभग एक ही बगत पर आराम करण अर सोवण री आदत बणाओ।",
    ],
    lifestyleDisclaimer:
      "आ थारी रिपोर्ट देख'र बताई आम सेहतमंद आदतां है। खान-पान या कसरत में कोई बड़ो बदलाव करण सूं पैली आपणा डॉक्टर सूं जरूर पूछो।",
    visitChecklistKicker: "डॉक्टर सूं मुलाकात री तैयारी",
    questionsForDoctorTitle: "आपणा डॉक्टर सूं पूछण सारू सवाल",
    questionsSubtitle:
      "डॉक्टर सूं बात करतां बगत सवाल पर टैप कर'र टिक लगाओ, या पूरी लिस्ट कॉपी कर ल्यो।",
    copiedBtn: "कॉपी हो गयो",
    copyQuestionsBtn: "सवाल कॉपी करो",
    printSavePdfBtn: "प्रिंट / PDF सेव करो",
    importantDisclaimerLabel: "जरूरी सूचना:",
    resultsDisclaimerLine1:
      "आरोग्य मित्र सिर्फ समझण सारू है। ओ डॉक्टरी सलाह, बीमारी री पक्की जांच (diagnosis) या डॉक्टर रो विकल्प कोनी है।",
    resultsDisclaimerLine2:
      "अगर थारी तबीयत खराब लाग री है या कोई इमरजेंसी है, तो तुरंत डॉक्टर या इमरजेंसी सेवा (112) सूं संपर्क करो।",
  },
  chat: {
    sectionKicker: "थारो निजी स्वास्थ्य गाइड",
    sectionTitle: "विशेषज्ञ सूं पूछो",
    sectionSubtitle:
      "इण सेशन में थे जो स्वास्थ्य प्रोफाइल भरी है उणरै हिसाब सूं शांत AI विशेषज्ञ गाइड सूं आपणा लक्षण अर सेहत रा सवालात पर बात करो।",
    lockedTitle:
      "आपणी स्वास्थ्य प्रोफाइल पूरी करो ताकि विशेषज्ञ थानै बढ़िया सूं समझ सकै।",
    lockedBody:
      'थारा लक्षणां सारू सुरक्षित अर सही जाणकारी देवण वास्तै कृपया सगल़ी 11 प्रोफाइल जाणकारी भरो (जो बीमारी या एलर्जी कोनी है उण में "None" या "कोनी" लिख सको)। थारी जाणकारी सिर्फ इण सेशन में ही रवै अर कठेई सेव कोनी व्है।',
    profileProgressLabel: "प्रोफाइल री स्थिति",
    completedCountLabel: "पूरी व्ही",
    stillNeededLabel: "अबार बाकी है:",
    goToProfileBtn: "स्वास्थ्य प्रोफाइल फॉर्म पर जाओ",
    fillSampleProfileBtn: "अबार चेक करण सारू नमूना प्रोफाइल भरो",
    consentLine:
      "थारी प्रोफाइल सिर्फ इण बातचीत नै थारै हिसाब सूं बणावण सारू काम आवै अर कठेई सेव कोनी व्है।",
    sessionPrivacyActive: "सेशन गोपनीयता चालू है",
    bloodChipPrefix: "ब्लड:",
    sugarChipPrefix: "शुगर:",
    conditionsChipPrefix: "बीमारी:",
    allergiesChipPrefix: "एलर्जी:",
    editProfileBtn: "प्रोफाइल बदलो",
    copySummaryBtn: "डॉक्टर सारू सारांश कॉपी करो",
    copiedSummaryBtn: "सारांश कॉपी हो गयो",
    newChatBtn: "नयो चैट",
    clearChatBtn: "चैट साफ करो",
    clearConfirmTitle: "कांई थे इण सेशन रा सगल़ा चैट मैसेज मिटावणो चाहो?",
    clearConfirmDesc:
      "इण सूं अबार री बातचीत रा सगल़ा मैसेज हट जासी। थारी स्वास्थ्य प्रोफाइल सुरक्षित रैसी।",
    cancelBtn: "रैवण द्यो",
    confirmClearBtn: "हां, चैट साफ करो",
    emergencyBannerTitle: "कृपया अबार तुरंत डॉक्टरी मदद ल्यो।",
    emergencyBannerBody:
      "तुरंत इमरजेंसी सेवा नै फोन करो या सबसूं नजदीकी अस्पताल रै इमरजेंसी वार्ड में जाओ।",
    call112Btn: "112 पर कॉल करो",
    emptyClearedTitle: "इण सेशन रा चैट मैसेज साफ हो ग्या है",
    emptyClearedBody:
      "थारी बातचीत हटा दी गई है। नीचै नयो सवाल लिखो या स्वागत संदेश पाछो ले आवो।",
    restoreGreetingBtn: "विशेषज्ञ रो स्वागत संदेश पाछो लाओ",
    guideSuffix: "गाइड",
    youLabel: "थे",
    routineGuidanceBadge: "सामान्य जाणकारी",
    suggestedCheckInPrefix: "डॉक्टर सूं मिलण री सलाह:",
    firstBotDisclaimer:
      "ओ AI गाइड सिर्फ समझण सारू है। ओ डॉक्टर, बीमारी री पक्की जांच या डॉक्टरी इलाज कोनी है। इमरजेंसी में 112 पर कॉल करो या नजदीकी अस्पताल जाओ।",
    seeADoctorLabel: "डॉक्टर नै दिखाओ",
    suggestedSpecialistPrefix: "सुझायोड़ा विशेषज्ञ:",
    findDoctorNearMeBtn: "आस-पास डॉक्टर खोजो",
    thinkingStatus: "{specialty} गाइड सोच रैया है…",
    retryBtn: "पाछी कोसिस करो",
    inputPlaceholder:
      "थानै कांई तकलीफ है, आपणा विशेषज्ञ गाइड नै बताओ… (भेजण सारू Enter, नई लाइन सारू Shift+Enter)",
    sendBtn: "भेजो",
    persistentDisclaimer:
      "ओ AI गाइड सिर्फ समझण सारू है। ओ डॉक्टर, बीमारी री पक्की जांच या डॉक्टरी इलाज कोनी है। इमरजेंसी में 112 पर कॉल करो या नजदीकी अस्पताल जाओ।",
    firstBotGreeting:
      "राम-राम {name}, म्हैं थारी प्रोफाइल पढ़ ली है — जण में {highlight} भी लिख्यो है। बताओ थानै कांई तकलीफ लाग री है, आपां सागै मिल'र इण नै समझसां।",
    suggestionChips: [
      "म्हारो माथो दुख रह्यो है",
      "म्हानै हर बगत थकान लागै",
      "म्हारा लक्षणां रो मतलब समझाओ",
      "कांई आ कोई गंभीर बात है?",
    ],
    urgencyLabels: {
      emergency: "इमरजेंसी — तुरंत अस्पताल जाओ",
      urgent: "जरूरी — 24 घंटा रै मांय डॉक्टर नै दिखाओ",
      soon: "कुछ दिनां में डॉक्टर सूं मिल ल्यो",
      routine: "सामान्य — अगली बार डॉक्टर सूं मिलो जणा पूछ ल्यो",
    },
    specialists: {
      "General Physician": {
        label: "जनरल फिजिशियन (सामान्य डॉक्टर)",
        shortDesc: "बुखार, थकान, शरीर में दर्द अर रोजमर्रा री सेहत री समस्या",
      },
      Cardiologist: {
        label: "दिल रा विशेषज्ञ (Cardiologist)",
        shortDesc: "दिल री धड़कन, ब्लड प्रेशर (BP), नस अर छाती री देखभाल",
      },
      "Endocrinologist/Diabetes": {
        label: "शुगर अर हार्मोन विशेषज्ञ (Endocrinologist)",
        shortDesc: "ब्लड शुगर, डायबिटीज, थायरॉइड अर हार्मोन",
      },
      Dermatologist: {
        label: "चमड़ी रा विशेषज्ञ (Dermatologist)",
        shortDesc: "दाणा, खाज-खुजली, एलर्जी, बाळ अर नख री समस्या",
      },
      Neurologist: {
        label: "नस अर दिमाग रा विशेषज्ञ (Neurologist)",
        shortDesc: "माथै रो दर्द, माइग्रेन, चक्कर, झुनझुनी अर नींद",
      },
      Gastroenterologist: {
        label: "पेट अर पाचन विशेषज्ञ (Gastroenterologist)",
        shortDesc: "पाचन, गैस, एसिडिटी, पेट फूलणो अर पेट रो आराम",
      },
      "Women's Health": {
        label: "महिला स्वास्थ्य (Women's Health)",
        shortDesc: "पीरियड्स, PCOS, गर्भावस्था री देखभाल, आयरन अर हार्मोन",
      },
      Pediatrician: {
        label: "टाबरां रा डॉक्टर (Pediatrician)",
        shortDesc: "बच्चां री बढ़त, खान-पान, बुखार अर देखभाल",
      },
      "Mental Wellbeing": {
        label: "मानसिक शांति अर सेहत (Mental Wellbeing)",
        shortDesc: "तनाव, चिंता, मन उदास रैवणो, नींद अर मन री शांति",
      },
    },
    doctorSummaryHeader: "आरोग्य मित्र — डॉक्टर नै दिखावण सारू सरल सारांश",
    doctorSummaryPreparedOn: "तैयार व्ही तारीख",
    doctorSummaryProfileSection: "1. मरीज री स्वास्थ्य प्रोफाइल:",
    doctorSummarySymptomsSection: "2. मरीज रा बताया लक्षण अर तकलीफ:",
    doctorSummaryNoSymptoms: "(अबार कोई खास लक्षण कोनी लिख्यो गयो)",
    doctorSummaryGuideNoteSection: "3. AI गाइड रो नोट अर सुझायोड़ा विशेषज्ञ:",
    doctorSummaryLatestDiscussion: "4. बातचीत री मुख्य बात:",
    doctorSummaryQuestionsSection: "5. डॉक्टर सूं पूछण सारू सवाल:",
    doctorSummaryDefaultQuestions: [
      "म्हारी प्रोफाइल देख'र इण लक्षणां रो सबसूं बड़ो कारण कांई हो सकै?",
      "कांई अबार कोई खास जांच (test) करावणी जरूरी है?",
      "कुणसा लक्षण दिखण पर म्हानै तुरंत अस्पताल आवणो चाहिजै?",
    ],
  },
  safetyFixed: {
    emergencyMessage:
      "आ लक्षण गंभीर डॉक्टरी इमरजेंसी (medical emergency) हो सकै। कृपया तुरंत इमरजेंसी सेवा (भारत में 112) पर फोन करो या सबसूं नजदीकी अस्पताल रै इमरजेंसी रूम में जाओ। देरी मत करो अर हो सकै तो कोई नै सागै ले'र जाओ।",
    medicineRefusalMessage:
      "थारी सुरक्षा म्हारै सारू सबसूं जरूरी है, इण वास्तै म्हैं कोई भी दवाई, गोळी, सप्लीमेंट या घरेलू नुस्खै रो नाम या खुराक (dose) कोनी बता सकूं। थारी पूरी स्वास्थ्य प्रोफाइल अर जांच देख'र कोई काबिल डॉक्टर ही सही दवाई बता सकै। पण म्हैं थारा लक्षण समझण अर डॉक्टर सूं कांई सवाल पूछणा चाहिजै, उण में थारी मदद कर सकूं।",
  },
  howItWorks: {
    kicker: "आरोग्य मित्र कियां काम करै",
    title: "उलझन सूं साफ समझ तांई 3 सरल कदम।",
    step1Title: "आपणी रिपोर्ट साझा करो",
    step1Desc:
      "आपणी लैब रिपोर्ट या पर्ची री लिखावट पेस्ट करो, बोल'र लिखो, या फोटो/PDF अपलोड करो। सगल़ी जाणकारी सिर्फ थारै इण ब्राउज़र सेशन में रवै।",
    step2Title: "सरल शब्दां में पढ़ो",
    step2Desc:
      "हर जांच कांई बतावै, 100 में सूं AI स्पष्टता स्कोर, अर सामान्य रेंज सूं तुलना — 15 भासावां में पढ़ो।",
    step3Title: "डॉक्टर सूं मिलण री तैयारी करो",
    step3Desc:
      "3 सरल सेहतमंद आदतां देखो अर डॉक्टर सूं आराम सूं बात करण सारू सवालां री लिस्ट कॉपी या प्रिंट कर ल्यो।",
  },
  faq: {
    kicker: "जाणनो जरूरी है",
    title: "आम सवाल",
    subtitle:
      "गोपनीयता, स्पष्टता स्कोर अर आरोग्य मित्र थारी रिपोर्ट कियां पढ़ै, इण बारै में सीधा जवाब।",
    items: [
      {
        question: "कांई म्हारी हेल्थ रिपोर्ट कठेई सेव व्है?",
        answer:
          "कदेई कोनी। थारी रिपोर्ट सिर्फ इण सेशन सारू पढ़ी जावै अर कोई सर्वर या अकाउंट पर सेव कोनी व्है। पिछली 3 रिपोर्टां सिर्फ थारै आपणा ब्राउज़र में रवै जणां नै थे जद चाहो एक बटन दबा'र मिटा सको।",
      },
      {
        question: "100 में सूं AI स्पष्टता स्कोर रो कांई मतलब है?",
        answer:
          "जद थे रिपोर्ट पेस्ट या अपलोड करो, तो आरोग्य मित्र देखै कि जांच रा नाम, नंबर, यूनिट अर रेंज कित्ता साफ पढ़्या ग्या है। 90–100 स्कोर रो मतलब है कि कागज एकदम साफ है; कम स्कोर रैवण पर असली कागज सूं एक बार मिला लेवणो चाहिजै।",
      },
      {
        question: "कांई ओ डॉक्टर री जगहां ले सकै?",
        answer:
          "ना। आरोग्य मित्र सिर्फ सेहत री बात सरल भासा में समझण सारू बण्यो है। कोई भी रिपोर्ट या दवाई रो पूरो मतलब डॉक्टर थानै देख'र अर जांच कर'र ही बता सकै।",
      },
      {
        question: "अलग-अलग लैब में सामान्य रेंज अलग क्यूं व्है?",
        answer:
          "अलग-अलग लैब में जांच री मशीन अर तरीको थोड़ो अलग हो सकै। सागै ही उमर, महिला/पुरुष अर बगत रै हिसाब सूं भी रेंज थोड़ी बदल जावै।",
      },
    ],
  },
  footer: {
    disclaimerLine1:
      "आरोग्य मित्र सिर्फ समझण सारू है। ओ डॉक्टरी सलाह, बीमारी री पहचान या डॉक्टर रो विकल्प कोनी है।",
    disclaimerLine2:
      "अगर थारी तबीयत खराब है या इमरजेंसी है, तो तुरंत डॉक्टर या इमरजेंसी सेवा सूं संपर्क करो।",
    sessionOnlyNote:
      "थारी रिपोर्ट सिर्फ इण सेशन सारू काम में आवै अर कठेई सेव कोनी व्है।",
    madeWithCare: "शांत अर सरल स्वास्थ्य समझ सारू आदर अर सेवा भाव सूं बण्योड़ो।",
  },
  mobileDock: {
    newReport: "नई रिपोर्ट",
    items: "जांच",
    doctorQs: "डॉक्टर सवाल",
    share: "शेयर",
    shared: "शेयर व्ही",
    snapPhoto: "फोटो खींचो",
    voice: "आवाज",
    stop: "रोको",
    reading: "पढ़ी जा री है…",
    explainNow: "अबार समझाओ",
    pasteOrUpload: "पेस्ट या अपलोड",
  },
  settingsModal: {
    title: "सेटिंग्स",
    appearanceLabel: "रंग-रूप (Appearance)",
    appearanceDesc:
      "दिन में पढ़ण सारू गरम आइवरी या रात सारू शांत डार्क मोड चुणो।",
    warmIvory: "गरम आइवरी",
    quietDark: "शांत डार्क",
    textSizeLabel: "अक्षर रो साइज",
    standardText: "सामान्य (17.5px)",
    largerText: "बड़ा अक्षर (18.5px)",
    languageLabel: "समझण री भासा",
    doneBtn: "हो गयो",
  },
  errors: {
    selectPhotoOrPdf:
      "आगै बढ़ण सूं पैली कृपया आपणी लैब रिपोर्ट या पर्ची री फोटो या PDF चुणो।",
    pastePrescriptionFirst:
      "कृपया पैली पर्ची सूं दवाई रा नाम पेस्ट करो, या 'नमूना पर्ची देखो' पर क्लिक करो।",
    pasteLabFirst:
      "कृपया पैली लैब रिपोर्ट री लाइन पेस्ट करो, या उदाहरण सारू 'नमूना रिपोर्ट देखो' पर क्लिक करो।",
    fileTooLarge:
      "आ फाइल 10 MB सूं बड़ी है। कृपया छोटी फोटो या कंप्रेस व्ही PDF चुणो।",
    invalidFileType:
      "कृपया साफ फोटो (JPG, PNG, WebP) या PDF फाइल अपलोड करो।",
    fileReadError:
      "थारै फोन या कंप्यूटर सूं फाइल पढ़ी कोनी जा सकी। कृपया पाछी चुणो।",
    messageTooLong:
      "कृपया आपणो मैसेज 1,000 अक्षरां रै मांय राखो ताकि साफ-साफ समझ्यो जा सकै।",
    genericAnalyzeError:
      "अबार रिपोर्ट री जाणकारी पूरी कोनी हो सकी। कृपया एक बार चेक कर'र पाछी कोसिस करो।",
    genericChatError:
      "अबार विशेषज्ञ गाइड सूं संपर्क कोनी हो सक्यो। कृपया थोड़ो रुक'र 'पाछी कोसिस करो' दबाओ।",
  },
};

export default raj;
