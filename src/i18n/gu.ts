// Review by a native speaker before real-world use.
import type { TranslationDictionary } from "./types";

const gu: TranslationDictionary = {
  meta: {
    code: "gu",
    nativeName: "ગુજરાતી",
    englishName: "Gujarati",
  },
  nav: {
    brandSubtitle: "શાંત સ્વાસ્થ્ય સાથી",
    explainReport: "રિપોર્ટ સમજો",
    askSpecialist: "નિષ્ણાતને પૂછો",
    sampleReport: "નમૂનાનો રિપોર્ટ",
    howItWorks: "આ કેવી રીતે કામ કરે છે",
    faq: "સામાન્ય પ્રશ્નો",
    settings: "સેટિંગ્સ",
    snapPhoto: "ફોટો પાડો",
    commonQA: "સામાન્ય પ્રશ્નોત્તરી",
    quietDark: "શાંત ડાર્ક",
    warmIvory: "હૂંફાળું આઇવરી",
  },
  languageSelector: {
    label: "ભાષા",
    searchPlaceholder: "15 ભાષાઓમાં શોધો (ગુજરાતી, English, हिन्दी…)",
    noResults: "કોઈ મળતી ભાષા મળી નથી.",
    betaBadge: "બીટા",
    betaNote:
      "અમારું AI હજુ આ ભાષા શીખી રહ્યું છે. કૃપા કરીને મહત્વપૂર્ણ વિગતો ડૉક્ટર પાસેથી ચકાસી લો.",
    languageChangedNotice:
      "ભાષા બદલાઈ ગઈ છે. હવેથી તમારા નિષ્ણાત {language} ભાષામાં જવાબ આપશે.",
    close: "બંધ કરો",
    selectLanguageTitle: "તમારી ભાષા પસંદ કરો",
    allLanguages: "15 ભારતીય અને અંગ્રેજી ભાષાઓ",
  },
  hero: {
    kicker: "ઊંડો શ્વાસ લો. ચાલો આને સાથે મળીને સરળ ભાષામાં સમજીએ.",
    headlinePrefix: "તમારો સ્વાસ્થ્ય રિપોર્ટ, સમજાવેલો",
    headlineEmphasis: "બિલકુલ એક મિત્રની જેમ",
    subheadline:
      "તમારા લેબ રિપોર્ટ અથવા ડૉક્ટરનું પ્રિસ્ક્રિપ્શન અહીં પેસ્ટ કરો—અથવા ફોટો કે PDF અપલોડ કરો—દરેક ટેસ્ટનો સરળ ભાષામાં અર્થ, સામાન્ય મર્યાદા અને ડૉક્ટરને પૂછવા જેવા પ્રશ્નો જાણવા માટે.",
    explainMyReportBtn: "મારો રિપોર્ટ સમજાવો",
    snapPhotoMobileBtn: "મારા રિપોર્ટનો ફોટો પાડો",
    trySampleLink: "અથવા પહેલા નમૂનાનો રિપોર્ટ જુઓ",
    trustNothingStored: "કંઈપણ સેવ થતું નથી",
    trustClarityScore: "AI સ્પષ્ટતા સ્કોર / 100",
    trustLanguagesCount: "15 ભાષાઓમાં ઉપલબ્ધ",
    sampleCardTitle: "નમૂનાનું લેબ કાર્ડ",
    clarityBadge: "સ્પષ્ટતા: 98 / 100",
    sampleTestName: "Fasting Blood Glucose (ભૂખ્યા પેટે બ્લડ સુગર)",
    sampleTypicalRange: "સામાન્ય પુખ્ત મર્યાદા: 70 – 99 mg/dL",
    slightlyHigh: "થોડું વધારે",
    lower: "ઓછું",
    typicalRange: "સામાન્ય મર્યાદા",
    higher: "વધારે",
    sampleExplanation:
      "આ ટેસ્ટ રાતભર ભૂખ્યા રહ્યા પછી લોહીમાં સુગર (glucose) માપે છે. 99 mg/dL થી થોડું વધારે પ્રમાણ ક્યારેક ખોરાકના પાચન સાથે જોડાયેલું હોઈ શકે છે અને ડૉક્ટર સાથે ચર્ચા કરવાનો સામાન્ય વિષય છે.",
    reassuranceFloatingNote: "અહીં ડરવા જેવું કંઈ નથી. ચાલો તેને સ્પષ્ટ કરીએ.",
    sanctuaryCaption: "તુલસી, અશ્વગંધા અને શાંત સ્પષ્ટતા",
    sanctuaryBadge: "આયુર્વેદિક શાંતિ",
    sanctuaryKicker: "આયુર્વેદિક સ્થિરતાથી પ્રેરિત",
    sanctuaryTitlePrefix: "જ્યાં પ્રાચીન શાંત સંભાળ મળે છે",
    sanctuaryTitleEmphasis: "આધુનિક તબીબી સ્પષ્ટતાને",
    sanctuaryBody:
      "આયુર્વેદમાં સાચું સ્વાસ્થ્ય ત્યારે શરૂ થાય છે જ્યારે મન શાંત અને ભયમુક્ત હોય. તબીબી આંકડા અને અઘરા શબ્દો મૂંઝવણ ઊભી કરી શકે છે—તેથી આરોગ્ય મિત્ર તેમને ધીરજ અને સરળ શબ્દોમાં સમજાવે છે.",
    pillar1Title: "શાંત શ્વાસ લો",
    pillar1Desc: "કોઈપણ આંકડા પહેલાં હૂંફાળા અને સરળ શબ્દો.",
    pillar2Title: "પૂર્ણ સ્પષ્ટતા",
    pillar2Desc: "દરેક ટેસ્ટનો સરળ અને સાચો અર્થ.",
    pillar3Title: "વિશ્વાસુ મિત્ર",
    pillar3Desc: "ડૉક્ટરની મુલાકાત માટે તૈયાર પ્રશ્નો.",
  },
  workspace: {
    tabLab: "લેબ રિપોર્ટ",
    tabLabMobile: "લેબ રિપોર્ટ",
    tabPrescription: "પ્રિસ્ક્રિપ્શન",
    tabPrescriptionMobile: "દવાની ચિઠ્ઠી",
    tabUpload: "ફોટો કે PDF અપલોડ",
    tabUploadMobile: "ફોટો / PDF",
    uploadLabel: "તમારા લેબ રિપોર્ટ કે પ્રિસ્ક્રિપ્શનનો સ્પષ્ટ ફોટો કે PDF અપલોડ કરો",
    uploadFormats: "JPG, PNG, WebP, કે PDF · મહત્તમ 10 MB",
    uploadDropTitle: "ફોન કેમેરાથી ફોટો પાડો અથવા ફાઇલ પસંદ કરો",
    uploadDropSub:
      "તમને સરળ ભાષામાં સંપૂર્ણ સમજૂતી અને 100 માંથી AI સ્પષ્ટતા સ્કોર મળશે.",
    takePhotoBtn: "કેમેરાથી ફોટો પાડો",
    chooseFileBtn: "ફોટો કે PDF પસંદ કરો",
    readyToExplain: "સમજાવવા માટે તૈયાર",
    retakeBtn: "ફરીથી લો",
    changeFileBtn: "ફાઇલ બદલો",
    optionalNoteLabel: 'વૈકલ્પિક નોંધ (ઉદા.: "થાઇરોઇડના આંકડાઓ પર ધ્યાન આપો")',
    optionalNotePlaceholder: "કોઈ વધારાની માહિતી હોય તો અહીં લખો…",
    trySampleReportBtn: "નમૂનાનો રિપોર્ટ જુઓ",
    trySamplePrescriptionBtn: "નમૂનાનું પ્રિસ્ક્રિપ્શન જુઓ",
    pasteLabLabel: "તમારા લેબ રિપોર્ટનું લખાણ કે આંકડા અહીં પેસ્ટ કરો અથવા બોલો",
    pastePrescriptionLabel: "તમારા પ્રિસ્ક્રિપ્શનની દવાઓ અને સૂચનાઓ અહીં પેસ્ટ કરો અથવા બોલો",
    dictateByVoice: "બોલીને લખો",
    stopDictation: "બોલવાનું રોકો",
    transcribingVoice: "અવાજ લખાઈ રહ્યો છે…",
    clearText: "લખાણ ભૂંસો",
    labPlaceholder:
      "ઉદાહરણ:\nHemoglobin: 11.3 g/dL (Ref: 12.0 - 15.5)\nTotal Cholesterol: 216 mg/dL (Desirable < 200)\nFasting Blood Glucose: 105 mg/dL (Normal: 70 - 99)\nTSH: 2.4 mIU/L (0.45 - 4.50)",
    prescriptionPlaceholder:
      "ઉદાહરણ:\n1. Tab Metformin 500mg — 1 ગોળી દિવસમાં બે વાર જમ્યા સાથે\n2. Tab Atorvastatin 10mg — 1 ગોળી રાત્રે\n3. Cap Vitamin D3 60,000 IU — અઠવાડિયામાં એક વાર 8 અઠવાડિયા",
    listeningIn: "{language} માં સાંભળી રહ્યું છે…",
    speakClearlyHint: "તમારા ટેસ્ટના નામ, આંકડા કે દવાઓ સ્પષ્ટ બોલો",
    transcribingStatus: "તમારા બોલેલા રિપોર્ટને લખાણમાં બદલવામાં આવી રહ્યો છે…",
    mobileVoiceHint: "બોલવા માટે માઇક દબાવો અથવા ફોટો માટે કેમેરા ટેબ પસંદ કરો",
    desktopVoiceHint: "નિરાંતે થોડી લાઇનો પેસ્ટ કરો અથવા બોલીને લખવા માટે માઇક દબાવો",
    tryAgainBtn: "ફરી પ્રયાસ કરો",
    sessionPrivacyNote:
      "તમારો રિપોર્ટ ફક્ત આ સેશન માટે જ વપરાય છે અને ક્યાંય સેવ થતો નથી.",
    readingCarefullyBtn: "ધ્યાનથી વાંચી રહ્યું છે…",
    explainInPlainWordsBtn: "સરળ શબ્દોમાં સમજાવો",
  },
  profile: {
    sectionTitle: "વ્યક્તિગત સ્વાસ્થ્ય પ્રોફાઇલ",
    sessionOnlyNote: "ફક્ત આ સેશન માટે (ક્યારેય સેવ થતું નથી)",
    unlocksSpecialist: "નિષ્ણાત ચેટ અનલૉક કરે છે",
    fieldsCountLabel: "ખાના",
    fillSampleProfile: "નમૂનાની પ્રોફાઇલ ભરો",
    clearProfile: "પ્રોફાઇલ ભૂંસો",
    nameLabel: "તમારું નામ",
    namePlaceholder: "દા.ત., રિયા સેન",
    ageLabel: "ઉંમર",
    agePlaceholder: "દા.ત., 42",
    sexLabel: "જાતિ (Sex)",
    sexSelectPlaceholder: "પસંદ કરો",
    sexFemale: "સ્ત્રી (Female)",
    sexMale: "પુરુષ (Male)",
    sexOther: "અન્ય (Other)",
    sexPreferNot: "જણાવવા માંગતા નથી",
    bloodTypeLabel: "બ્લડ ગ્રુપ (Blood Type)",
    bloodTypeSelectPlaceholder: "બ્લડ ગ્રુપ પસંદ કરો",
    bloodTypeUnknown: "ખબર નથી",
    sugarLabel: "ડાયાબિટીસ / બ્લડ સુગર સ્થિતિ",
    sugarPlaceholder: "દા.ત., નથી, પ્રી-ડાયાબિટીસ, ટાઇપ 2 ડાયાબિટીસ",
    allergyLabel: "એલર્જી (Allergies)",
    allergyPlaceholder: "દા.ત., કોઈ નથી, પેનિસિલિન, સીંગદાણા",
    bpLabel: "બ્લડ પ્રેશર (BP) / સોજાની સમસ્યા",
    bpPlaceholder: "દા.ત., નોર્મલ BP, હાઈ BP, નથી",
    conditionsLabel: "હાલની સ્વાસ્થ્ય સમસ્યાઓ",
    conditionsPlaceholder: "દા.ત., નથી, થાઇરોઇડ, અસ્થમા, PCOS",
    heightLabel: "ઊંચાઈ (Height)",
    heightPlaceholder: "168 cm / 5'6\"",
    weightLabel: "વજન (Weight)",
    weightPlaceholder: "65 kg / 143 lb",
    otherLabel: "અન્ય વિગતો",
    otherPlaceholder: "દા.ત., શાકાહારી, રોજ ચાલવું, નથી",
    completeBanner:
      "સ્વાસ્થ્ય પ્રોફાઇલ પૂર્ણ ({summary}) — 'નિષ્ણાતને પૂછો' ચેટ ખૂલી ગઈ છે અને રિપોર્ટ તમારા મુજબ સમજાવાશે.",
    activeForReports: "રિપોર્ટ માટે સક્રિય:",
    completeRemainingPrefix: "કૃપા કરીને",
    completeRemainingSuffix:
      'પૂર્ણ કરો (લાગુ ન પડે તો "None" લખો) જેથી નિષ્ણાત ચેટ ખૂલી શકે.',
    optionalAllFieldsNote:
      "રિપોર્ટ સમજવા માટે બધા ખાના વૈકલ્પિક છે, પરંતુ 'નિષ્ણાતને પૂછો' ચેટ શરૂ કરવા ઉપરના બધા ખાના ભરો (લાગુ ન પડે તો 'None' લખો).",
    openSpecialistLink: "નિષ્ણાત ચેટ ખોલો",
    goToSpecialistLink: "નિષ્ણાત ચેટ પર જાઓ",
  },
  history: {
    title: "સેશન ઇતિહાસ (History)",
    subtitle:
      "તમારી છેલ્લી 3 સમજૂતીઓ ફક્ત આ બ્રાઉઝરમાં ખાનગી રીતે રહે છે જેથી તમે તેને ફરી જોઈ શકો.",
    searchPlaceholder: "શબ્દથી શોધો…",
    clearHistory: "ઇતિહાસ ભૂંસો",
    emptyTitle: "તમારી શાંત વાંચન જગ્યા તૈયાર છે",
    emptyBody:
      "આ બ્રાઉઝરમાં હજુ કોઈ તાજેતરનો રિપોર્ટ સેવ નથી. જ્યારે તમે કોઈ રિપોર્ટ સમજશો, ત્યારે છેલ્લા 3 પરિણામો અહીં દેખાશે.",
    noMatchesPrefix: "કોઈ સાચવેલી સમજૂતી મળતી નથી:",
    resetFilter: "ફિલ્ટર હટાવો",
    modeLab: "લેબ રિપોર્ટ",
    modePrescription: "પ્રિસ્ક્રિપ્શન",
    modeUpload: "અપલોડ કરેલી ફાઇલ",
    itemsLabel: "બાબતો",
    scoreLabel: "સ્કોર",
  },
  loading: {
    messages: [
      "તમારો રિપોર્ટ ધ્યાનથી વાંચવામાં આવી રહ્યો છે…",
      "અહીં ડરવા જેવું કંઈ નથી. ચાલો તેને સરળ બનાવીએ…",
      "સામાન્ય પુખ્ત સંદર્ભ મર્યાદાઓ સાથે સરખામણી થઈ રહી છે…",
      "અઘરા તબીબી શબ્દોને સરળ અને શાંત ભાષામાં બદલવામાં આવી રહ્યા છે…",
      "તમારા ડૉક્ટરને પૂછવા માટે ઉપયોગી પ્રશ્નો તૈયાર થઈ રહ્યા છે…",
    ],
    preparingInLanguage: "{language} ભાષામાં તમારી સરળ સમજૂતી તૈયાર થઈ રહી છે…",
  },
  results: {
    urgentBannerTitle: "ટૂંક સમયમાં તમારા ડૉક્ટરની સલાહ લેવી યોગ્ય રહેશે",
    urgentBannerBody:
      "એક અથવા વધુ પરિણામો પર તાત્કાલિક ધ્યાન આપવાની જરૂર હોઈ શકે છે. કૃપા કરીને જલ્દી તમારા ડૉક્ટરનો સંપર્ક કરો.",
    atAGlance: "એક નજરમાં",
    languageLabel: "ભાષા",
    reassuranceHeaderWithName:
      "{name}, અહીં ડરવા જેવું કંઈ નથી. ચાલો તેને સ્પષ્ટ કરીએ.",
    reassuranceHeaderDefault: "અહીં ડરવા જેવું કંઈ નથી. ચાલો તેને સ્પષ્ટ કરીએ.",
    shareReady: "શેર કરવા માટે તૈયાર",
    shareWithFamily: "પરિવાર સાથે સારાંશ શેર કરો",
    seeDoctorQuestionsCount: "ડૉક્ટર માટે {count} પ્રશ્નો જુઓ",
    clarityScoreTitle: "AI સ્પષ્ટતા સ્કોર",
    verifiedBadge: "ચકાસાયેલ",
    clarityHigh: "ઉચ્ચ વાંચન સ્પષ્ટતા",
    clarityGood: "સારી સ્પષ્ટતા · પ્રમાણભૂત મર્યાદા લાગુ",
    clarityPartial: "આંશિક સ્પષ્ટતા · મૂળ રિપોર્ટ સાથે ચકાસો",
    defaultConfidenceNote:
      "તમારા દસ્તાવેજની દરેક તપાસ, એકમ અને મર્યાદાને પ્રમાણભૂત તબીબી માપદંડો સાથે સ્પષ્ટ રીતે સરખાવવામાં આવી છે.",
    itemByItemTitle: "દરેક તપાસની સરળ સમજૂતી",
    showingItemsCount: "{count} બાબતો બતાવી રહ્યા છીએ",
    rangesVaryNote: "લેબ, ઉંમર અને જાતિ મુજબ સંદર્ભ મર્યાદા બદલાઈ શકે છે",
    filterAll: "બધા",
    filterOutsideRange: "મર્યાદાની બહાર",
    filterTypical: "સામાન્ય",
    statusNormal: "સામાન્ય મર્યાદામાં",
    statusSlightlyHigh: "થોડું વધારે",
    statusSlightlyLow: "થોડું ઓછું",
    statusDiscussSoon: "ડૉક્ટર સાથે જલ્દી ચર્ચા કરો",
    statusPrescribedMedicine: "લખેલી દવા",
    typicalRefRange: "સામાન્ય સંદર્ભ મર્યાદા",
    checkLabPrintout: "લેબ પ્રિન્ટઆઉટ જુઓ",
    generallyUsedFor: "સામાન્ય રીતે શેના માટે વપરાય છે:",
    howItIsWritten: "પ્રિસ્ક્રિપ્શન પર કેવી રીતે લખ્યું છે:",
    medicineSafetyFooter:
      "હંમેશા તમારા ડૉક્ટરની સૂચનાઓનું પાલન કરો, અને તેમની સલાહ લીધા વિના ક્યારેય કોઈ દવા શરૂ, બંધ કે ડોઝમાં ફેરફાર ન કરો.",
    everydayWellbeingKicker: "રોજિંદું સ્વાસ્થ્ય",
    lifestyleTipsTitle: "3 સરળ, બિન-તબીબી જીવનશૈલી સૂચનો",
    gentleDailyHabitsNote: "સરળ દૈનિક આદતો · તબીબી સલાહ નથી",
    defaultLifestyleTips: [
      "રોજ જમ્યા પછી 10 મિનિટ ધીમે-ધીમે ચાલવાનો પ્રયાસ કરો.",
      "આખો દિવસ પૂરતું પાણી પીવા માટે પાસે પાણીની બોટલ કે ગ્લાસ રાખો.",
      "દરરોજ રાત્રે લગભગ એક જ સમયે શાંત અને પૂરતી ઊંઘ લેવાની ટેવ પાડો.",
    ],
    lifestyleDisclaimer:
      "આ તમારા રિપોર્ટથી પ્રેરિત સામાન્ય દૈનિક સ્વાસ્થ્ય વિચારો છે. ખોરાક કે દિનચર્યામાં મોટો ફેરફાર કરતા પહેલા હંમેશા ડૉક્ટરની સલાહ લો.",
    visitChecklistKicker: "ડૉક્ટર મુલાકાત યાદી",
    questionsForDoctorTitle: "તમારા ડૉક્ટરને પૂછવા માટેના પ્રશ્નો",
    questionsSubtitle:
      "મુલાકાત દરમિયાન કોઈપણ પ્રશ્ન પર ટેપ કરીને ખરાની નિશાની કરો, અથવા યાદી કોપી અને શેર કરો.",
    copiedBtn: "કોપી થયું",
    copyQuestionsBtn: "પ્રશ્નો કોપી કરો",
    printSavePdfBtn: "પ્રિન્ટ / PDF સેવ કરો",
    importantDisclaimerLabel: "મહત્વપૂર્ણ સૂચના:",
    resultsDisclaimerLine1:
      "આરોગ્ય મિત્ર ફક્ત સમજવા માટે છે. આ તબીબી સલાહ, નિદાન કે યોગ્ય ડૉક્ટરનો વિકલ્પ નથી.",
    resultsDisclaimerLine2:
      "જો તમને અસ્વસ્થ લાગે અથવા આ કટોકટીની સ્થિતિ હોય, તો તરત જ ડૉક્ટર અથવા ઇમરજન્સી સેવાનો સંપર્ક કરો.",
  },
  chat: {
    sectionKicker: "વ્યક્તિગત સ્વાસ્થ્ય માર્ગદર્શક",
    sectionTitle: "નિષ્ણાતને પૂછો",
    sectionSubtitle:
      "આ સેશન માટે તમે ભરેલી સ્વાસ્થ્ય પ્રોફાઇલના આધારે શાંત AI નિષ્ણાત માર્ગદર્શક સાથે તમારા લક્ષણો અને સ્વાસ્થ્ય પ્રશ્નો વિશે સરળ ભાષામાં વાત કરો.",
    lockedTitle:
      "તમારી સ્વાસ્થ્ય પ્રોફાઇલ પૂર્ણ કરો જેથી તમારા નિષ્ણાત તમને વધુ સારી રીતે સમજી શકે.",
    lockedBody:
      'તમારા લક્ષણોને યોગ્ય સંદર્ભમાં સમજવા માટે કૃપા કરીને પ્રોફાઇલના બધા 11 ખાના ભરો (જો કોઈ બીમારી કે એલર્જી લાગુ ન પડે તો "None" લખો). તમારી પ્રોફાઇલ ફક્ત આ સેશનમાં જ રહે છે અને ક્યારેય સેવ થતી નથી.',
    profileProgressLabel: "પ્રોફાઇલ પ્રગતિ",
    completedCountLabel: "પૂર્ણ",
    stillNeededLabel: "હજુ બાકી છે:",
    goToProfileBtn: "સ્વાસ્થ્ય પ્રોફાઇલ ફોર્મ પર જાઓ",
    fillSampleProfileBtn: "અત્યારે અજમાવવા નમૂનાની પ્રોફાઇલ ભરો",
    consentLine:
      "તમારી પ્રોફાઇલ ફક્ત આ વાતચીતને તમારા મુજબ બનાવવા માટે વપરાય છે અને ક્યારેય સેવ થતી નથી.",
    sessionPrivacyActive: "સેશન ગોપનીયતા સક્રિય",
    bloodChipPrefix: "બ્લડ:",
    sugarChipPrefix: "સુગર:",
    conditionsChipPrefix: "સમસ્યા:",
    allergiesChipPrefix: "એલર્જી:",
    editProfileBtn: "પ્રોફાઇલ બદલો",
    copySummaryBtn: "ડૉક્ટર માટે સારાંશ કોપી કરો",
    copiedSummaryBtn: "સારાંશ કોપી થયો",
    newChatBtn: "નવી ચેટ",
    clearChatBtn: "ચેટ ભૂંસો",
    clearConfirmTitle: "આ સેશનના બધા નિષ્ણાત ચેટ સંદેશા ભૂંસી નાખવા છે?",
    clearConfirmDesc:
      "આનાથી હાલની વાતચીતના બધા સંદેશા કાયમ માટે ભૂંસાઈ જશે. તમારી સ્વાસ્થ્ય પ્રોફાઇલ સુરક્ષિત રહેશે.",
    cancelBtn: "રદ કરો",
    confirmClearBtn: "હા, ચેટ ભૂંસો",
    emergencyBannerTitle: "કૃપા કરીને અત્યારે જ તાત્કાલિક તબીબી મદદ લો.",
    emergencyBannerBody:
      "તરત જ ઇમરજન્સી સેવા (112) પર કૉલ કરો અથવા નજીકની હોસ્પિટલના ઇમરજન્સી વિભાગમાં જાઓ.",
    call112Btn: "112 પર કૉલ કરો",
    emptyClearedTitle: "આ સેશનના ચેટ સંદેશા ભૂંસી નાખવામાં આવ્યા છે",
    emptyClearedBody:
      "તમારી વાતચીતનો ઇતિહાસ દૂર કરવામાં આવ્યો છે. નીચે નવો પ્રશ્ન લખો અથવા નવું સ્વાગત સંદેશ શરૂ કરો.",
    restoreGreetingBtn: "નિષ્ણાતનો સ્વાગત સંદેશ પાછો લાવો",
    guideSuffix: "માર્ગદર્શક",
    youLabel: "તમે",
    routineGuidanceBadge: "સામાન્ય માર્ગદર્શન",
    suggestedCheckInPrefix: "સૂચવેલા ડૉક્ટર:",
    firstBotDisclaimer:
      "આ AI માર્ગદર્શક ફક્ત સમજવા માટે છે. આ ડૉક્ટર, નિદાન કે તબીબી સલાહ નથી. કટોકટીમાં 112 પર કૉલ કરો અથવા નજીકની હોસ્પિટલમાં જાઓ.",
    seeADoctorLabel: "ડૉક્ટરને બતાવો",
    suggestedSpecialistPrefix: "સૂચવેલા નિષ્ણાત:",
    findDoctorNearMeBtn: "મારી નજીક ડૉક્ટર શોધો",
    thinkingStatus: "{specialty} માર્ગદર્શક વિચારી રહ્યા છે…",
    retryBtn: "ફરી પ્રયાસ કરો",
    inputPlaceholder:
      "તમારા નિષ્ણાત માર્ગદર્શકને જણાવો કે તમને શું અનુભવાઈ રહ્યું છે… (મોકલવા Enter, નવી લાઇન માટે Shift+Enter)",
    sendBtn: "મોકલો",
    persistentDisclaimer:
      "આ AI માર્ગદર્શક ફક્ત સમજવા માટે છે. આ ડૉક્ટર, નિદાન કે તબીબી સલાહ નથી. કટોકટીમાં 112 પર કૉલ કરો અથવા નજીકની હોસ્પિટલમાં જાઓ.",
    firstBotGreeting:
      "નમસ્તે {name}, મેં તમારી પ્રોફાઇલ વાંચી લીધી છે — જેમાં {highlight} સામેલ છે. મને જણાવો કે તમને શું તકલીફ થઈ રહી છે, આપણે શાંતિથી સાથે મળીને તેને સમજીશું.",
    suggestionChips: [
      "મને માથાનો દુખાવો થાય છે",
      "મને હંમેશા થાક લાગે છે",
      "મારા લક્ષણોનો અર્થ સમજાવો",
      "શું આ કોઈ ગંભીર બાબત છે?",
    ],
    urgencyLabels: {
      emergency: "કટોકટી — તાત્કાલિક તબીબી મદદ લો",
      urgent: "અત્યંત જરૂરી — 24 કલાકમાં ડૉક્ટરને બતાવો",
      soon: "થોડા દિવસોમાં ડૉક્ટરને મળો",
      routine: "સામાન્ય — નિયમિત મુલાકાતમાં ચર્ચા કરો",
    },
    specialists: {
      "General Physician": {
        label: "જનરલ ફિઝિશિયન (General Physician)",
        shortDesc: "રોજિંદા લક્ષણો, તાવ, થાક, દુખાવો અને સામાન્ય સ્વાસ્થ્ય",
      },
      Cardiologist: {
        label: "હૃદય રોગ નિષ્ણાત (Cardiologist)",
        shortDesc: "હૃદયના ધબકારા, બ્લડ પ્રેશર અને છાતીની સ્વસ્થતા",
      },
      "Endocrinologist/Diabetes": {
        label: "ડાયાબિટીસ અને હોર્મોન નિષ્ણાત (Endocrinologist)",
        shortDesc: "બ્લડ સુગર, ડાયાબિટીસ, થાઇરોઇડ અને હોર્મોન્સ",
      },
      Dermatologist: {
        label: "ચામડીના નિષ્ણાત (Dermatologist)",
        shortDesc: "ચામડી પર ચકામા, ખંજવાળ, એલર્જી, વાળ અને નખ",
      },
      Neurologist: {
        label: "ન્યુરોલોજીસ્ટ (Neurologist)",
        shortDesc: "માથાનો દુખાવો, માઇગ્રેન, ચક્કર, ઝણઝણાટી અને ઊંઘ",
      },
      Gastroenterologist: {
        label: "પેટના રોગ નિષ્ણાત (Gastroenterologist)",
        shortDesc: "પાચન, એસિડિટી, પેટ ફૂલવું અને આંતરડાનું સ્વાસ્થ્ય",
      },
      "Women's Health": {
        label: "મહિલા સ્વાસ્થ્ય (Women's Health)",
        shortDesc: "માસિક ચક્ર, PCOS, ગર્ભાવસ્થા સંભાળ, આયર્ન અને હોર્મોન્સ",
      },
      Pediatrician: {
        label: "બાળ રોગ નિષ્ણાત (Pediatrician)",
        shortDesc: "બાળકોનો વિકાસ, પોષણ, તાવ અને કોમળ સંભાળ",
      },
      "Mental Wellbeing": {
        label: "માનસિક સ્વાસ્થ્ય (Mental Wellbeing)",
        shortDesc: "તણાવ, ચિંતા, ઉદાસી, આરામ અને માનસિક શાંતિ",
      },
    },
    doctorSummaryHeader: "આરોગ્ય મિત્ર — ડૉક્ટરની મુલાકાત માટે સરળ સારાંશ",
    doctorSummaryPreparedOn: "તૈયાર કર્યાની તારીખ",
    doctorSummaryProfileSection: "1. દર્દીની સ્વાસ્થ્ય પ્રોફાઇલ:",
    doctorSummarySymptomsSection: "2. દર્દીએ જણાવેલા લક્ષણો અને ચિંતાઓ:",
    doctorSummaryNoSymptoms: "(હજુ કોઈ ચોક્કસ લક્ષણો લખ્યા નથી)",
    doctorSummaryGuideNoteSection: "3. AI સ્વાસ્થ્ય માર્ગદર્શક નોંધ અને સૂચવેલા નિષ્ણાત:",
    doctorSummaryLatestDiscussion: "4. વાતચીતનો મુખ્ય સારાંશ:",
    doctorSummaryQuestionsSection: "5. ડૉક્ટરને પૂછવા માટેના પ્રશ્નો:",
    doctorSummaryDefaultQuestions: [
      "મારી સ્વાસ્થ્ય પ્રોફાઇલ જોતાં આ લક્ષણોનું સૌથી સંભવિત કારણ શું હોઈ શકે?",
      "શું તમે અત્યારે કોઈ ખાસ ટેસ્ટ કરાવવાની સલાહ આપો છો?",
      "કયા ચિહ્નો દેખાય તો મારે તાત્કાલિક ડૉક્ટરનો સંપર્ક કરવો જોઈએ?",
    ],
  },
  safetyFixed: {
    emergencyMessage:
      "આ લક્ષણો ગંભીર તબીબી કટોકટી (medical emergency) ના સંકેત હોઈ શકે છે. કૃપા કરીને તરત જ ઇમરજન્સી સેવા (ભારતમાં 112) પર કૉલ કરો અથવા સૌથી નજીકની હોસ્પિટલના ઇમરજન્સી વિભાગમાં જાઓ. વિલંબ ન કરો અને શક્ય હોય તો કોઈની મદદ લો.",
    medicineRefusalMessage:
      "તમારી સુરક્ષા સૌથી મહત્વપૂર્ણ છે, તેથી હું કોઈપણ દવા, ગોળી, સપ્લિમેન્ટ કે ઘરગથ્થુ ઉપચારનું નામ, સલાહ કે ડોઝ જણાવી શકતો નથી. તમારી સ્વાસ્થ્ય પ્રોફાઇલ અને સંપૂર્ણ તબીબી ઇતિહાસ જોઈને માત્ર યોગ્ય ડૉક્ટર કે ફાર્માસિસ્ટ જ સાચી દવા જણાવી શકે છે. હું તમારા લક્ષણો નોંધવામાં, શેનું ધ્યાન રાખવું અને ડૉક્ટરને શું પૂછવું—તેમાં તમારી મદદ કરી શકું છું.",
  },
  howItWorks: {
    kicker: "આરોગ્ય મિત્ર કેવી રીતે કામ કરે છે",
    title: "મૂંઝવણથી સ્પષ્ટતા સુધીના ત્રણ સરળ પગલાં.",
    step1Title: "તમારો દસ્તાવેજ શેર કરો",
    step1Desc:
      "તમારા લેબ રિપોર્ટ કે પ્રિસ્ક્રિપ્શનનું લખાણ પેસ્ટ કરો, બોલીને લખો અથવા ફોટો/PDF અપલોડ કરો. બધું જ તમારા હાલના બ્રાઉઝર સેશનમાં રહે છે.",
    step2Title: "સરળ શબ્દોમાં વાંચો",
    step2Desc:
      "જાણો કે દરેક ટેસ્ટ શું માપે છે, 100 માંથી તમારો AI સ્પષ્ટતા સ્કોર અને સામાન્ય મર્યાદા સાથે સરખામણી—15 ભાષાઓમાં.",
    step3Title: "ડૉક્ટરની મુલાકાતની તૈયારી કરો",
    step3Desc:
      "3 સરળ જીવનશૈલી સૂચનો વાંચો અને ડૉક્ટર સાથે શાંત વાતચીત માટે પ્રશ્નોની યાદી કોપી કે પ્રિન્ટ કરો.",
  },
  faq: {
    kicker: "જાણવા જેવું",
    title: "સામાન્ય પ્રશ્નો",
    subtitle:
      "ગોપનીયતા, સ્પષ્ટતા સ્કોર અને આરોગ્ય મિત્ર તમારા સ્વાસ્થ્ય દસ્તાવેજો કેવી રીતે વાંચે છે તેના સીધા જવાબો.",
    items: [
      {
        question: "શું મારો સ્વાસ્થ્ય રિપોર્ટ ક્યાંય સેવ થાય છે?",
        answer:
          "ક્યારેય નહીં. તમારો રિપોર્ટ ફક્ત આ સેશન માટે જ પ્રોસેસ થાય છે અને કોઈ સર્વર પર સેવ થતો નથી. તમારા બ્રાઉઝરમાં ફક્ત છેલ્લા 3 રિપોર્ટ રહે છે જેને તમે એક ટેપથી ભૂંસી શકો છો.",
      },
      {
        question: "100 માંથી AI સ્પષ્ટતા સ્કોરનો અર્થ શું છે?",
        answer:
          "જ્યારે તમે રિપોર્ટ કે પ્રિસ્ક્રિપ્શન આપો છો, ત્યારે આરોગ્ય મિત્ર ચકાસે છે કે દરેક ટેસ્ટનું નામ, આંકડો અને મર્યાદા કેટલી સ્પષ્ટતાથી વંચાઈ છે. 90–100 સ્કોર એટલે દસ્તાવેજ એકદમ સ્પષ્ટ હતો.",
      },
      {
        question: "શું આ મારા ડૉક્ટરનું સ્થાન લઈ શકે છે?",
        answer:
          "ના. આરોગ્ય મિત્ર ફક્ત શાંત સ્વાસ્થ્ય સમજ માટે છે. કોઈપણ રિપોર્ટનો પૂર્ણ અર્થ તમારા ડૉક્ટરની તપાસ અને સલાહ સાથે જ સમજાય છે.",
      },
      {
        question: "અલગ-અલગ લેબમાં સંદર્ભ મર્યાદા કેમ અલગ હોય છે?",
        answer:
          "અલગ-અલગ લેબ જુદા-જુદા સાધનો અને પદ્ધતિઓ વાપરે છે. ઉપરાંત ઉંમર, જાતિ અને સમય મુજબ પણ સામાન્ય મર્યાદા બદલાય છે.",
      },
    ],
  },
  footer: {
    disclaimerLine1:
      "આરોગ્ય મિત્ર ફક્ત સમજવા માટે છે. આ તબીબી સલાહ, નિદાન કે યોગ્ય ડૉક્ટરનો વિકલ્પ નથી.",
    disclaimerLine2:
      "જો તમને અસ્વસ્થ લાગે અથવા આ કટોકટીની સ્થિતિ હોય, તો તરત જ ડૉક્ટર અથવા ઇમરજન્સી સેવાનો સંપર્ક કરો.",
    sessionOnlyNote:
      "તમારો રિપોર્ટ ફક્ત આ સેશન માટે જ વપરાય છે અને ક્યારેય સેવ થતો નથી.",
    madeWithCare: "શાંત અને સંવેદનશીલ સ્વાસ્થ્ય સાક્ષરતા માટે કાળજીપૂર્વક નિર્મિત.",
  },
  mobileDock: {
    newReport: "નવો રિપોર્ટ",
    items: "તપાસો",
    doctorQs: "ડૉક્ટર પ્રશ્નો",
    share: "શેર",
    shared: "શેર થયું",
    snapPhoto: "ફોટો પાડો",
    voice: "બોલો",
    stop: "રોકો",
    reading: "વાંચી રહ્યું છે…",
    explainNow: "અત્યારે સમજો",
    pasteOrUpload: "પેસ્ટ / અપલોડ",
  },
  settingsModal: {
    title: "સેટિંગ્સ",
    appearanceLabel: "દેખાવ (Appearance)",
    appearanceDesc:
      "દિવસે વાંચવા માટે હૂંફાળું આઇવરી અથવા સાંજ માટે શાંત ડાર્ક મોડ પસંદ કરો.",
    warmIvory: "હૂંફાળું આઇવરી",
    quietDark: "શાંત ડાર્ક",
    textSizeLabel: "લખાણનું કદ",
    standardText: "સામાન્ય (17.5px)",
    largerText: "મોટા અક્ષરો (18.5px)",
    languageLabel: "સમજૂતીની ભાષા",
    doneBtn: "પૂર્ણ",
  },
  errors: {
    selectPhotoOrPdf:
      "આગળ વધતા પહેલા કૃપા કરીને તમારા લેબ રિપોર્ટ કે પ્રિસ્ક્રિપ્શનનો ફોટો કે PDF પસંદ કરો.",
    pastePrescriptionFirst:
      "કૃપા કરીને પહેલા તમારા પ્રિસ્ક્રિપ્શનમાંથી દવાઓના નામ પેસ્ટ કરો, અથવા 'નમૂનાનું પ્રિસ્ક્રિપ્શન જુઓ' પર ક્લિક કરો.",
    pasteLabFirst:
      "કૃપા કરીને પહેલા તમારા લેબ રિપોર્ટની લાઇનો પેસ્ટ કરો, અથવા 'નમૂનાનો રિપોર્ટ જુઓ' પર ક્લિક કરો.",
    fileTooLarge:
      "આ ફાઇલ 10 MB કરતાં મોટી છે. કૃપા કરીને નાનો ફોટો અથવા ઓછી સાઇઝની PDF પસંદ કરો.",
    invalidFileType: "કૃપા કરીને સ્પષ્ટ ફોટો (JPG, PNG, WebP) અથવા PDF અપલોડ કરો.",
    fileReadError:
      "અમે તમારા ડિવાઇસમાંથી તે ફાઇલ વાંચી શક્યા નથી. કૃપા કરીને ફરી પસંદ કરો.",
    messageTooLong:
      "કૃપા કરીને તમારો સંદેશ 1,000 અક્ષરોથી ઓછો રાખો જેથી અમે તેને સ્પષ્ટ રીતે સમજી શકીએ.",
    genericAnalyzeError:
      "અત્યારે સમજૂતી પૂર્ણ થઈ શકી નથી. કૃપા કરીને ફરી પ્રયાસ કરો.",
    genericChatError:
      "અત્યારે તમારા નિષ્ણાત માર્ગદર્શક સાથે સંપર્ક થઈ શક્યો નથી. કૃપા કરીને થોડી વાર પછી ફરી પ્રયાસ કરો.",
  },
};

export default gu;
