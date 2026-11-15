import {
  LANGUAGE_META_MAP,
  SUPPORTED_LANGUAGES,
  type LanguageCode,
} from "../i18n/safetyMessages";
import type { LanguageMeta } from "../i18n/types";

export function resolveLanguageMeta(input?: string): LanguageMeta {
  if (!input || typeof input !== "string") {
    return LANGUAGE_META_MAP.en;
  }
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  if (lower in LANGUAGE_META_MAP) {
    return LANGUAGE_META_MAP[lower as LanguageCode];
  }

  const found = SUPPORTED_LANGUAGES.find(
    (l) =>
      l.code.toLowerCase() === lower ||
      l.englishName.toLowerCase() === lower ||
      l.nativeName.toLowerCase() === lower
  );
  return found || LANGUAGE_META_MAP.en;
}

// Convert any Indic native numerals (Devanagari, Bengali/Assamese, Gurmukhi, Gujarati, Odia, Tamil, Telugu, Kannada, Malayalam) to Western digits 0-9
const INDIC_ZERO_CODES = [
  0x0966, // Devanagari ०
  0x09e6, // Bengali/Assamese ০
  0x0a66, // Gurmukhi ੦
  0x0ae6, // Gujarati ૦
  0x0b66, // Odia ୦
  0x0be6, // Tamil ௦
  0x0c66, // Telugu ౦
  0x0ce6, // Kannada ೦
  0x0d66, // Malayalam ൦
];

export function toWesternDigits(text: string): string {
  if (!text) return text;
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    let mapped: string | null = null;
    for (const zeroCode of INDIC_ZERO_CODES) {
      if (code >= zeroCode && code <= zeroCode + 9) {
        mapped = String(code - zeroCode);
        break;
      }
    }
    out += mapped !== null ? mapped : text[i];
  }
  return out;
}

export function stripCodeFences(raw: string): string {
  const trimmed = raw.trim();
  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fencedMatch && fencedMatch[1]) {
    return fencedMatch[1].trim();
  }
  return trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export function buildMultilingualAiBehaviorBlock(meta: LanguageMeta): string {
  return `Language & Script Rules (CRITICAL):
Always reply in the language selected by the user: ${meta.nativeName} / ${meta.englishName} (${meta.code}), written in its own script (${meta.script}). Use simple, everyday words that a common person understands, not formal or textbook vocabulary. If the user types in another language or in Roman letters (for example Hinglish, Tanglish or Banglish), understand it and still reply in the selected language.
- Use Western digits (0-9) for every lab value, reference range, dose count, age and date, and standard units (mg/dL, g/dL, mmol/L), so numbers never get confused.
- Keep medical terms in the form people commonly use in that language, with the English term in brackets where it helps, for example: रक्तचाप (blood pressure).
- Bhojpuri and Rajasthani: write in Devanagari, in simple spoken style. If you are unsure of a word, use the common Hindi word instead of inventing one.
- Sanskrit: use very simple, short sentences in Devanagari. For emergencies, add one extra line in Hindi and English with 112.
- Never mix scripts within a sentence, except for English medical terms in brackets and numbers.`;
}

// Multilingual emergency keyword fallback across all 15 languages + Romanized Indian languages
const EMERGENCY_PATTERNS: RegExp[] = [
  /\b(chest\s*pain|chest\s*tightness|chest\s*pressure|heart\s*attack|can'?t\s*breathe|cannot\s*breathe|trouble\s*breathing|shortness\s*of\s*breath|difficulty\s*breathing|stroke|face\s*droop|slurred\s*speech|unconscious|fainted|fainting|seizure|convulsion|severe\s*bleeding|coughing\s*blood|vomiting\s*blood|suicid|kill\s*myself|end\s*my\s*life|self[\s-]*harm|overdose|poison)\b/i,
  // Romanized Hinglish / Tanglish / Banglish / Marathi / Punjabi / Gujarati / Telugu / Kannada / Malayalam / Odia / Assamese
  /\b(seene\s*me(?:in)?\s*dard|sine\s*me(?:in)?\s*dard|chhati\s*me(?:in)?\s*dard|chati\s*me(?:in)?\s*dard|saans\s*nahi|sans\s*nahi|saans\s*lene\s*me|sans\s*lene\s*me|behosh|chakkar\s*aa\s*ke\s*gir|nenju\s*vali|maarbu\s*vali|moochu\s*thinara|moochu\s*vida\s*kashtam|buke\s*byatha|buke\s*betha|shwas\s*kosto|chati\s*dukh|chhatit\s*dukh|ede\s*novu|chhati\s*noppi|nenju\s*vedana|chatire\s*jontrona)\b/i,
  // Devanagari (Hindi, Marathi, Bhojpuri, Rajasthani, Sanskrit)
  /(सीने\s*में\s*दर्द|छाती\s*में\s*दर्द|छाती\s*मे\s*दरद|छाती\s*में\s*पीड़ा|छातीत\s*दुख|छातीत\s*कळ|हृदयवेदना|वक्षःपीडा|वक्षसि\s*पीडा|सांस\s*लेने\s*में|साँस\s*ना\s*आवे|दम\s*घुट|धाप\s*लाग|श्वास\s*घेण्यास\s*त्रास|श्वासकष्ट|बेहोश|बेशुद्ध|लकवा|पक्षाघात|खून\s*की\s*उल्टी|आत्महत्या|जीना\s*नहीं\s*चाह)/u,
  // Bengali & Assamese
  /(বুকে\s*ব্যথা|বুকে\s*চাপ|বুকুত\s*বিষ|বুকুৰ\s*বিষ|শ্বাসকষ্ট|শ্বাস\s*নিতে\s*কষ্ট|উশাহ\s*লোৱাত\s*কষ্ট|অজ্ঞান|সংজ্ঞাহীন|স্ট্রোক|রক্তবমি|আত্মহত্যা)/u,
  // Punjabi (Gurmukhi)
  /(ਛਾਤੀ\s*ਵਿੱਚ\s*ਦਰਦ|ਛਾਤੀ\s*ਦਾ\s*ਦਰਦ|ਸਾਹ\s*ਲੈਣ\s*ਵਿੱਚ\s*ਤਕਲੀਫ਼|ਸਾਹ\s*ਨਹੀਂ\s*ਆ\s*ਰਿਹਾ|ਬੇਹੋਸ਼|ਦੌਰਾ|ਅਧਰੰਗ|ਖੂਨ\s*ਦੀ\s*ਉਲਟੀ|ਖੁਦਕੁਸ਼ੀ)/u,
  // Gujarati
  /(છાતીમાં\s*દુખાવો|છાતીમાં\s*દબાણ|શ્વાસ\s*લેવામાં\s*તકલીફ|શ્વાસ\s*નથી\s*લેવાતો|બેભાન|આંચકી|લકવો|લોહીની\s*ઉલટી|આત્મહત્યા)/u,
  // Tamil
  /(நெஞ்சு\s*வலி|மார்பு\s*வலி|நெஞ்சில்\s*வலி|மூச்சுத்\s*திணறல்|மூச்சு\s*விட\s*சிரமம்|மயக்கம்|வலிப்பு|பக்கவாதம்|ரத்த\s*வாந்தி|தற்கொலை)/u,
  // Telugu
  /(ఛాతీ\s*నొప్పి|ఛాతీలో\s*నొప్పి|గుండె\s*నొప్పి|శ్వాస\s*తీసుకోవడం\s*కష్టం|ఊపిరి\s*ఆడటం\s*లేదు|స్పృహ\s*తప్పి|మూర్ఛ|పక్షవాతం|రక్తపు\s*వాంతులు|ఆత్మహత్య)/u,
  // Kannada
  /(ಎದೆ\s*ನೋವು|ಎದೆಯಲ್ಲಿ\s*ನೋವು|ಉಸಿರಾಟದ\s*ತೊಂದರೆ|ಉಸಿರು\s*ಕಟ್ಟುವಿಕೆ|ಪ್ರಜ್ಞೆ\s*ತಪ್ಪಿ|ಮೂರ್ಛೆ|ಪಕ್ಷವಾತ|ರಕ್ತ\s*ವಾಂತಿ|ಆత్మಹತ್ಯೆ)/u,
  // Malayalam
  /(നെഞ്ചുവേദന|നെഞ്ച്\s*വേദന|ശ്വാസതടസ്സം|ശ്വാസം\s*മുട്ടൽ|ബോധക്ഷയം|അപസ്മാരം|പക്ഷാഘാതം|രക്തം\s*ഛർദ്ദിക്കുക|ആത്മഹത്യ)/u,
  // Odia
  /(ଛାତିରେ\s*ଯନ୍ତ୍ରଣା|ଛାତି\s*ବ୍ୟଥା|ନିଶ୍ୱାସ\s*ନେବାରେ\s*କষ্ট|ନିଶ୍ୱାସ\s*ନେବାରେ\s*ଅସୁବିଧା|ଚେତା\s*ହରାଇବା|ପକ୍ଷାଘାତ|ରକ୍ତ\s*ବାନ୍ତି|ଆତ୍ମହତ୍ୟା)/u,
];

export function matchesEmergencyKeyword(text: string): boolean {
  if (!text) return false;
  return EMERGENCY_PATTERNS.some((rx) => rx.test(text));
}

// Drug / Medicine deny-list & user medicine-request patterns across all 15 languages + Romanized forms
const DRUG_NAME_DENYLIST_REGEX =
  /\b(paracetamol|acetaminophen|dolo\s*650|dolo|crocin|calpol|ibuprofen|brufen|combiflam|aspirin|disprin|diclofenac|aceclofenac|zerodol|naproxen|cetirizine|levocetirizine|allegra|fexofenadine|montelukast|azithromycin|azee|amoxicillin|augmentin|ciprofloxacin|cefixime|doxycycline|metronidazole|flagyl|pantoprazole|pan\s*40|pan\s*d|omeprazole|omez|rabeprazole|ranitidine|gelusil|digene|eno|ondansetron|emeset|domperidone|loperamide|imodium|metformin|glycomet|glimepiride|insulin|amlodipine|telmisartan|losartan|atenolol|metoprolol|atorvastatin|rosuvastatin|levothyroxine|thyronorm|eltroxin|alprazolam|clonazepam|sertraline|fluoxetine|escitalopram|prednisolone|dexamethasone|betadine|neosporin|ors\s*packet|electral|strepsils|vicks|volini|moov|ashwagandha\s*tablet|giloy\s*vati|chyawanprash|hajmola|triphala\s*churna)\b/i;

const INDIC_DRUG_NAME_DENYLIST_REGEX =
  /(पैरासिटामोल|पेरासिटामोल|डोलो|क्रोसिन|इबुप्रोफेन|एस्पिरिन|डिस्प्रिन|कॉम्बीफ्लेम|सिट्रिजिन|एज़िथ्रोमाइसिन|अमोक्सिसिलिन|पैंटोप्राजोल|ओमेप्राजोल|मेटफॉर्मिन|पॅरासिटामॉल|पॅरासिटामोल|डोलो\s*650|प्यारासिटामोल|প্যারাসিটামল|ডলো|ক্রোসিন|আইবুপ্রোফেন|অ্যাসপিরিন|সিটিরিজিন|অ্যাজিথ্রোমাইসিন|মেটফরমিন|ਪੈਰਾਸੀਟਾਮੋਲ|ਡੋਲੋ|ક્રોસિન|પેરાસિટામોલ|ડોલો|பாராசிட்டமால்|டோலோ|குரோசின்|இபுப்ரோஃபன்|செட்டிரிசின்|அசித்ரோமைசின்|పారాసిటమాల్|డోలో|క్రోసిన్|ఇబుప్రోఫెన్|సెటిరిజైన్|అజిత్రోమైసిన్|ಪ್ಯಾರಸಿಟಮಾಲ್|ಡೊಲೊ|ಕ್ರೋಸಿನ್|പാരസെറ്റമോൾ|ഡോളോ|ക്രോസിൻ|ପାରାସିଟାମଲ୍|ଡୋଲୋ)/u;

const USER_ASKS_FOR_MEDICINE_REGEX =
  /(\b(which|what)\s+(tablet|medicine|pill|drug|syrup|antibiotic|painkiller|capsule|dose|medication)\b|\b(suggest|recommend|prescribe|give|tell)\s+(me\s+)?(a\s+|some\s+|any\s+)?(tablet|medicine|pill|drug|syrup|antibiotic|painkiller|remedy)\b|\b(tablet|medicine|pill)\s+for\s+(fever|headache|pain|cold|cough|acidity|stomach|diabetes|bp)\b|\b(kaun\s*si|kaunsi|konsi)\s*(dawa|dawai|goli|tablet)\b|कौन[\s-]*(सी|सा)\s*(दवा|दवाई|गोली|टैबलेट|सिरप|कैप्सूल)|कवन\s*(दवाई|गोली)|कुणसी\s*(दवाई|गोळी)|कौणसी\s*दवाई|कोणती\s*(गोळी|औषध)|कोणते\s*औषध|কোন\s*(ওষুধ|ট্যাবলেট|বড়ি)|কি\s*ওষুধ\s*খাব|কোনটো\s*(ঔষধ|টেবলেট)|ਕਿਹੜੀ\s*(ਦਵਾਈ|ਗੋਲੀ)|કઈ\s*(દવા|ગોળી)|எந்த\s*(மாத்திரை|மருந்து)|என்ன\s*(மாத்திரை|மருந்து)|ఏ\s*(మాత్ర|మందు|టాబ్లెట్)|ಯಾವ\s*(ಮಾತ್ರೆ|ಔಷಧಿ)|ഏത്\s*(ഗുളിക|മരുന്ന്)|କେଉଁ\s*(ଔଷଧ|ଟାବଲେଟ୍|ବଟିକା)|किम्\s*औषधम्|का\s*गुलिका)/iu;

export function replyViolatesMedicineRule(
  replyText: string,
  userMessage: string
): boolean {
  if (!replyText) return false;
  if (DRUG_NAME_DENYLIST_REGEX.test(replyText)) return true;
  if (INDIC_DRUG_NAME_DENYLIST_REGEX.test(replyText)) return true;
  if (USER_ASKS_FOR_MEDICINE_REGEX.test(userMessage)) return true;
  return false;
}
