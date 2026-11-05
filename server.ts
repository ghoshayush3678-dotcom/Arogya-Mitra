import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import {
  FIXED_SAFETY_MESSAGES,
  LANGUAGE_META_MAP,
  SUPPORTED_LANGUAGES,
  type LanguageCode,
} from "./src/i18n/safetyMessages";
import type { LanguageMeta } from "./src/i18n/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getAiClient() {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function resolveLanguageMeta(input?: string): LanguageMeta {
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

function toWesternDigits(text: string): string {
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

function buildMultilingualAiBehaviorBlock(meta: LanguageMeta): string {
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
  // Romanized Hinglish / Tanglish / Banglish
  /\b(seene\s*me\s*dard|chhati\s*me\s*dard|chati\s*me\s*dard|saans\s*nahi|sans\s*lene\s*me|behosh|chakkar\s*aa\s*ke\s*gir|nenju\s*vali|moochu\s*thinara|buke\s*byatha|buke\s*betha|shwas\s*kosto|chati\s*dukh|chhatit\s*dukh)\b/i,
  // Devanagari (Hindi, Marathi, Bhojpuri, Rajasthani, Sanskrit)
  /(सीने\s*में\s*दर्द|छाती\s*में\s*दर्द|छाती\s*मे\s*दरद|छाती\s*में\s*पीड़ा|छातीत\s*दुख|छातीत\s*कळ|हृदयवेदना|वक्षःपीडा|वक्षसि\s*पीडा|सांस\s*लेने\s*में|साँस\s*ना\s*आवे|दम\s*घुट|धाप\s*लाग|श्वास\s*घेण्यास\s*त्रास|श्वासकष्ट|बेहोश|बेशुद्ध|लकवा|पक्षाघात|खून\s*की\s*उल्टी|आत्महत्या|जीना\s*नहीं\s*चाह)/u,
  // Bengali & Assamese
  /(বুকে\s*ব্যথা|বুকে\s*চাপ|বুকুত\s*বিষ|বুকুৰ\s*বিষ|শ্বাসকষ্ট|শ্বাস\s*নিতে\s*কষ্ট|উশাহ\s*লোৱাত\s*কষ্ট|অজ্ঞান|সংজ্ঞাহীন|স্ট্রোক|রক্তবমি|আত্মহত্যা)/u,
  // Punjabi (Gurmukhi)
  /(ਛਾਤੀ\s*ਵਿੱਚ\s*ਦਰਦ|ਛਾਤੀ\s*ਦਾ\s*ਦਰਦ|ਸਾਹ\s*ਲੈਣ\s*ਵਿੱਚ\s*ਤਕਲੀਫ਼|ਸਾਹ\s*ਨਹੀਂ\s*ਆ\s*ਰਿਹਾ|ਬੇਹੋਸ਼|ਦੌਰਾ|ਅਧਰੰਗ|ਖੂਨ\s*ਦੀ\s*ਉਲਟੀ|ਖੁਦਕੁਸ਼ੀ)/u,
  // Gujarati
  /(છાતીમાં\s*દુખાવો|છાતીમાં\s*દબાણ|શ્વાસ\s*લેવામાં\s*તકલીફ|શ્વાસ\s*નથી\s*લેવાતો|બેભાન|આંચકી|લકવો|લોહીની\s*ઉલટી|આત્મહത്യा)/u,
  // Tamil
  /(நெஞ்சு\s*வலி|மார்பு\s*வலி|நெஞ்சில்\s*வலி|மூச்சுத்\s*திணறல்|மூச்சு\s*விட\s*சிரமம்|மயக்கம்|வலிப்பு|பக்கவாதம்|ரத்த\s*வாந்தி|தற்கொலை)/u,
  // Telugu
  /(ఛాతీ\s*నొప్పి|ఛాతీలో\s*నొప్పి|గుండె\s*నొప్పి|శ్వాస\s*తీసుకోవడం\s*కష్టం|ఊపిరి\s*ఆడటం\s*లేదు|స్పృహ\s*తప్పి|మూర్ఛ|పక్షవాతం|రక్తపు\s*వాంతులు|ఆత్మహత్య)/u,
  // Kannada
  /(ಎದೆ\s*ನೋವು|ಎದೆಯಲ್ಲಿ\s*ನೋವು|ಉಸಿರಾಟದ\s*ತೊಂದರೆ|ಉಸಿರು\s*ಕಟ್ಟುವಿಕೆ|ಪ್ರಜ್ಞೆ\s*ತಪ್ಪಿ|ಮూర్ಛೆ|ಪಕ್ಷವಾತ|ರಕ್ತ\s*ವಾಂತಿ|ಆತ್ಮಹತ್ಯೆ)/u,
  // Malayalam
  /(നെഞ്ചുവേദന|നെഞ്ച്\s*വേദന|ശ്വാസതടസ്സം|ശ്വാസം\s*മുട്ടൽ|ബോധക്ഷയം|അപസ്മാരം|പക്ഷാഘാതം|രക്തം\s*ഛർദ്ദിക്കുക|ആത്മഹത്യ)/u,
  // Odia
  /(ଛାତିରେ\s*ଯନ୍ତ୍ରଣା|ଛାତି\s*ବ୍ୟଥା|ନିଶ୍ୱାସ\s*ନେବାରେ\s*কষ্ট|ନିଶ୍ୱାସ\s*ନେବାରେ\s*অସୁବିଧା|ଚେତା\s*ହରାଇବା|ପକ୍ଷାଘାତ|ରକ୍ତ\s*ବାନ୍ତି|ଆତ୍ମହତ୍ୟା)/u,
];

function matchesEmergencyKeyword(text: string): boolean {
  if (!text) return false;
  return EMERGENCY_PATTERNS.some((rx) => rx.test(text));
}

// Drug / Medicine deny-list & user medicine-request patterns across languages
const DRUG_NAME_DENYLIST_REGEX =
  /\b(paracetamol|acetaminophen|dolo\s*650|dolo|crocin|calpol|ibuprofen|brufen|combiflam|aspirin|disprin|diclofenac|aceclofenac|zerodol|naproxen|cetirizine|levocetirizine|allegra|fexofenadine|montelukast|azithromycin|azee|amoxicillin|augmentin|ciprofloxacin|cefixime|doxycycline|metronidazole|flagyl|pantoprazole|pan\s*40|pan\s*d|omeprazole|omez|rabeprazole|ranitidine|gelusil|digene|eno|ondansetron|emeset|domperidone|loperamide|imodium|metformin|glycomet|glimepiride|insulin|amlodipine|telmisartan|losartan|atenolol|metoprolol|atorvastatin|rosuvastatin|levothyroxine|thyronorm|eltroxin|alprazolam|clonazepam|sertraline|fluoxetine|escitalopram|prednisolone|dexamethasone|betadine|neosporin|ors\s*packet|electral|strepsils|vicks|volini|moov|ashwagandha\s*tablet|giloy\s*vati|chyawanprash|hajmola|triphala\s*churna)\b/i;

const INDIC_DRUG_NAME_DENYLIST_REGEX =
  /(पैरासिटामोल|पेरासिटामोल|डोलो|क्रोसिन|इबुप्रोफेन|एस्पिरिन|डिस्प्रिन|कॉम्बीफ्लेम|सिट्रिजिन|एज़िथ्रोमाइसिन|अमोक्सिसिलिन|पैंटोप्राजोल|ओमेप्राजोल|मेटफॉर्मिन|पॅरासिटामॉल|पॅरासिटामोल|डोलो\s*650|प्यारासिटामोल|প্যারাসিটামল|ডলো|ক্রোসিন|আইবুপ্রোফেন|অ্যাসপিরিন|সিটিরিজিন|অ্যাজিথ্রোমাইসিন|মেটফরমিন|ਪੈਰਾਸੀਟਾਮੋਲ|ਡੋਲੋ|ક્રોસિન|પેરાસિટામોલ|ડોલો|பாராசிட்டமால்|டோலோ|குரோசின்|இபுப்ரோஃபன்|செட்டிரிசின்|அசித்ரோமைசின்|పారాసిటమాల్|డోలో|క్రోసిన్|ఇబుప్రోఫెన్|సెటిరిజైన్|అజిత్రోమైసిన్|ಪ್ಯಾರಸಿಟಮಾಲ್|ಡೊಲೊ|ಕ್ರೋಸಿನ್|പാരസെറ്റമോൾ|ഡോളോ|ക്രോസിൻ|ପାରାସିଟାମଲ୍|ଡୋଲୋ)/u;

const USER_ASKS_FOR_MEDICINE_REGEX =
  /(\b(which|what)\s+(tablet|medicine|pill|drug|syrup|antibiotic|painkiller|capsule|dose|medication)\b|\b(suggest|recommend|prescribe|give|tell)\s+(me\s+)?(a\s+|some\s+|any\s+)?(tablet|medicine|pill|drug|syrup|antibiotic|painkiller|remedy)\b|\b(tablet|medicine|pill)\s+for\s+(fever|headache|pain|cold|cough|acidity|stomach|diabetes|bp)\b|कौन\s*सी\s*(दवा|दवाई|गोली|टैबलेट)|कवन\s*(दवाई|गोली)|कुणसी\s*(दवाई|गोळी)|कौणसी\s*दवाई|कोणती\s*(गोळी|औषध)|कोणते\s*औषध|কোন\s*(ওষুধ|ট্যাবলেট|বড়ি)|কি\s*ওষুধ\s*খাব|কোনটো\s*(ঔষধ|টেবলেট)|ਕਿਹੜੀ\s*(ਦਵਾਈ|ਗੋਲੀ)|કઈ\s*(દવા|ગોળી)|எந்த\s*(மாத்திரை|மருந்து)|என்ன\s*(மாத்திரை|மருந்து)|ఏ\s*(మాత్ర|మందు|టాబ్లెట్)|ಯಾವ\s*(ಮಾತ್ರೆ|ಔಷಧಿ)|ഏത്\s*(ഗുളിക|മരുന്ന്)|କେଉଁ\s*(ଔଷଧ|ଟାବଲେଟ୍|ବଟିକା)|किम्\s*औषधम्|का\s*गुलिका)/iu;

function replyViolatesMedicineRule(replyText: string, userMessage: string): boolean {
  if (!replyText) return false;
  if (DRUG_NAME_DENYLIST_REGEX.test(replyText)) return true;
  if (INDIC_DRUG_NAME_DENYLIST_REGEX.test(replyText)) return true;
  if (USER_ASKS_FOR_MEDICINE_REGEX.test(userMessage)) return true;
  return false;
}

const SYSTEM_INSTRUCTION =
  "You are a calm, kind health-literacy assistant. Explain medical reports in simple language at a 7th-grade reading level. Never diagnose, never recommend starting, stopping or changing any medicine or dose, and never predict outcomes. Use phrases like 'can sometimes be linked to' rather than definitive statements. Use standard adult reference ranges and mention that ranges vary by lab, age and sex. When optional user profile context (such as Name, Blood Type, Blood Sugar / Glucose status, Known Allergies, Height, Weight, or Other Details) is provided in the prompt, warmly address the user by name in the summary and thoughtfully weave their provided profile details into the report summary, relevant item explanations (for example, relating glucose/HbA1c or metabolic markers to their sugar history, noting known allergies when explaining prescribed medicines, and considering height/weight or other notes), lifestyle tips, and doctor questions in a grounded, supportive way. Include 3 simple, gentle, non-medical everyday lifestyle tips based on the analysis (such as 'Try adding a 10-minute walk to your daily routine' or drinking plenty of water). Also provide a confidenceScore out of 100 (0-100) indicating how clearly, completely, and accurately the uploaded or pasted lab report or prescription could be read and matched to reference ranges, along with a 1-sentence confidenceNote. If information is missing or unreadable, say so and ask the user to check. If the input is not a medical document, politely say so. Always respond in the language the user selected. Return only valid JSON matching the schema.";

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description:
        "A short, reassuring 'At a glance' summary (2-3 sentences, plain language) of the report or prescription in the selected language. If any optional user profile fields are provided in the prompt context, warmly address them by name and include helpful, grounded context tailored to their profile where relevant. Mention that reference ranges can vary by lab, age, and sex. Use Western digits (0-9) for all numbers.",
    },
    confidenceScore: {
      type: Type.INTEGER,
      description:
        "A score from 0 to 100 representing how clearly, completely, and reliably the AI was able to read every item, unit, and dosage/reference range from the user's lab report or prescription.",
    },
    confidenceNote: {
      type: Type.STRING,
      description:
        "A short, reassuring 1-sentence explanation in the selected language explaining the score out of 100.",
    },
    items: {
      type: Type.ARRAY,
      description: "One entry per lab test or prescribed medicine found in the document.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description:
              "For lab tests (type === 'lab'): show the test name as printed on the report in English followed by the translated name in the selected language in brackets, e.g. 'Hemoglobin (हीमोग्लोबिन)' (or just 'Hemoglobin' if English is selected). For medicines (type === 'medicine'): keep the medicine name in English exactly as printed on the prescription (e.g. 'Tab Metformin 500mg') so the user can match the medicine strip.",
          },
          value: {
            type: Type.STRING,
            description:
              "For lab tests, the user's numeric or text value using Western digits 0-9 (without units). For medicines, the strength or dosage in Western digits (e.g. '500 mg').",
          },
          unit: {
            type: Type.STRING,
            description:
              "The standard unit of measurement in Latin/English script (e.g. 'g/dL', 'mg/dL', 'mIU/L', '%'). Empty string if not applicable.",
          },
          referenceRange: {
            type: Type.STRING,
            description:
              "Standard adult reference range (or the range printed on the report) for lab tests using Western digits 0-9 and standard units (e.g. '12.0 - 15.5 g/dL'). For medicines, what the medicine is generally used for translated into the selected language.",
          },
          status: {
            type: Type.STRING,
            enum: ["normal", "slightly_high", "slightly_low", "discuss_soon"],
            description:
              "Status classification in English. For medicines, use 'normal' unless there is a specific safety note worth discussing soon with the doctor.",
          },
          explanation: {
            type: Type.STRING,
            description:
              "1-2 sentence plain, kind explanation at a 7th-grade reading level in the selected language. Use Western digits (0-9) for all numbers.",
          },
          type: {
            type: Type.STRING,
            enum: ["lab", "medicine"],
            description: "Whether this item is a 'lab' test or a 'medicine' on a prescription.",
          },
          usage: {
            type: Type.STRING,
            description:
              "For medicines, how it is commonly taken as written on the prescription, translated into the selected language using Western digits 0-9. Optional for labs.",
          },
        },
        required: [
          "name",
          "value",
          "unit",
          "referenceRange",
          "status",
          "explanation",
          "type",
        ],
      },
    },
    lifestyleTips: {
      type: Type.ARRAY,
      description:
        "Exactly 3 simple, gentle, non-medical everyday lifestyle tips in the selected language. Use Western digits (0-9) for any numbers.",
      items: {
        type: Type.STRING,
      },
    },
    doctorQuestions: {
      type: Type.ARRAY,
      description:
        "4 to 6 specific, personalized, constructive questions in the selected language that the patient can ask their doctor at their next visit.",
      items: {
        type: Type.STRING,
      },
    },
    urgentFlag: {
      type: Type.BOOLEAN,
      description:
        "True if one or more values look seriously abnormal and may need prompt medical attention; false otherwise.",
    },
  },
  required: [
    "summary",
    "confidenceScore",
    "confidenceNote",
    "items",
    "lifestyleTips",
    "doctorQuestions",
    "urgentFlag",
  ],
};

// WebSocket-free @vite/client replacement so HMR-disabled preview never opens a WebSocket
const NO_WS_VITE_CLIENT = `
const sheetsMap = new Map();
if (typeof document !== "undefined") {
  document.querySelectorAll("style[data-vite-dev-id]").forEach((el) => {
    sheetsMap.set(el.getAttribute("data-vite-dev-id"), el);
  });
}
let lastInsertedStyle;
export function updateStyle(id, content) {
  if (typeof document === "undefined") return;
  let style = sheetsMap.get(id);
  if (!style) {
    style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.setAttribute("data-vite-dev-id", id);
    style.textContent = content;
    if (!lastInsertedStyle) {
      document.head.appendChild(style);
      setTimeout(() => { lastInsertedStyle = undefined; }, 0);
    } else {
      lastInsertedStyle.insertAdjacentElement("afterend", style);
    }
    lastInsertedStyle = style;
  } else if (style.textContent !== content) {
    style.textContent = content;
  }
  sheetsMap.set(id, style);
}
export function removeStyle(id) {
  if (typeof document === "undefined") return;
  const style = sheetsMap.get(id);
  if (style) {
    document.head.removeChild(style);
    sheetsMap.delete(id);
  }
}
export function createHotContext() {
  return {
    data: {},
    accept() {},
    acceptExports() {},
    dispose() {},
    prune() {},
    invalidate() {},
    on() {},
    off() {},
    send() {},
  };
}
export function injectQuery(url, queryToInject) {
  if (url[0] !== "." && url[0] !== "/") return url;
  const pathname = url.replace(/[?#].*$/, "");
  const { search, hash } = new URL(url, "http://vite.dev");
  return \`\${pathname}?\${queryToInject}\${search ? "&" + search.slice(1) : ""}\${hash || ""}\`;
}
export class ErrorOverlay extends (typeof HTMLElement !== "undefined" ? HTMLElement : class {}) {
  constructor() { super(); }
  close() { this.remove?.(); }
}
`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support up to 15MB JSON bodies for base64 PDF/image uploads
  app.use(express.json({ limit: "15mb" }));

  // Intercept /@vite/client so the browser never attempts to open a Vite HMR WebSocket
  app.get("/@vite/client", (_req, res) => {
    res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.send(NO_WS_VITE_CLIENT);
  });

  app.post("/api/analyze", async (req, res) => {
    try {
      const {
        mode,
        text,
        file,
        language = "en",
        languageCode,
        userProfile,
        profilePromptContext,
      } = req.body as {
        mode: "lab" | "prescription" | "upload";
        text?: string;
        file?: { base64: string; mimeType: string; name?: string };
        language?: string;
        languageCode?: string;
        userProfile?: {
          name?: string;
          age?: string;
          sex?: string;
          bloodType?: string;
          sugar?: string;
          allergy?: string;
          bloodPressure?: string;
          existingConditions?: string;
          height?: string;
          weight?: string;
          otherDetails?: string;
        };
        profilePromptContext?: string;
      };

      const langMeta = resolveLanguageMeta(languageCode || language);
      const langDisplay = `${langMeta.nativeName} (${langMeta.englishName}, code: ${langMeta.code})`;

      if (mode === "upload") {
        if (!file || !file.base64 || !file.mimeType) {
          return res.status(400).json({
            error: "Please select a clear photo or PDF of your health document first.",
          });
        }
      } else {
        if (!text || !text.trim()) {
          return res.status(400).json({
            error: "Please paste the text from your report or prescription so we can read it together.",
          });
        }
      }

      const cleanName =
        typeof userProfile?.name === "string" ? userProfile.name.trim() : "";
      const cleanAge =
        typeof userProfile?.age === "string" ? userProfile.age.trim() : "";
      const cleanSex =
        typeof userProfile?.sex === "string" ? userProfile.sex.trim() : "";
      const cleanBloodType =
        typeof userProfile?.bloodType === "string"
          ? userProfile.bloodType.trim()
          : "";
      const cleanSugar =
        typeof userProfile?.sugar === "string" ? userProfile.sugar.trim() : "";
      const cleanAllergy =
        typeof userProfile?.allergy === "string"
          ? userProfile.allergy.trim()
          : "";
      const cleanBloodPressure =
        typeof userProfile?.bloodPressure === "string"
          ? userProfile.bloodPressure.trim()
          : "";
      const cleanExistingConditions =
        typeof userProfile?.existingConditions === "string"
          ? userProfile.existingConditions.trim()
          : "";
      const cleanHeight =
        typeof userProfile?.height === "string"
          ? userProfile.height.trim()
          : "";
      const cleanWeight =
        typeof userProfile?.weight === "string"
          ? userProfile.weight.trim()
          : "";
      const cleanOtherDetails =
        typeof userProfile?.otherDetails === "string"
          ? userProfile.otherDetails.trim()
          : "";

      const profileDetails: string[] = [];
      if (cleanName) profileDetails.push(`Name: ${cleanName}`);
      if (cleanAge) profileDetails.push(`Age: ${cleanAge}`);
      if (cleanSex) profileDetails.push(`Sex: ${cleanSex}`);
      if (cleanBloodType) profileDetails.push(`Blood Type: ${cleanBloodType}`);
      if (cleanSugar) profileDetails.push(`Diabetes / Blood Sugar Status: ${cleanSugar}`);
      if (cleanAllergy) profileDetails.push(`Known Allergies: ${cleanAllergy}`);
      if (cleanBloodPressure) {
        profileDetails.push(`Blood Pressure / Fluid-Related Conditions: ${cleanBloodPressure}`);
      }
      if (cleanExistingConditions) {
        profileDetails.push(`Existing Conditions: ${cleanExistingConditions}`);
      }
      if (cleanHeight) profileDetails.push(`Height: ${cleanHeight}`);
      if (cleanWeight) profileDetails.push(`Weight: ${cleanWeight}`);
      if (cleanOtherDetails) profileDetails.push(`Other Health Details: ${cleanOtherDetails}`);

      const structuredProfilePrompt =
        profileDetails.length > 0
          ? `\n\nUser Profile Context for Report Summary & Explanations:\n${profileDetails
              .map((line) => `- ${line}`)
              .join("\n")}${
              profilePromptContext && profilePromptContext.trim()
                ? `\n- Summary Context Note: ${profilePromptContext.trim()}`
                : ""
            }\nPlease use this optional user profile info (${profileDetails.join(
              ", "
            )}) in the report summary, item explanations, lifestyle tips, and doctor questions to give personalized, reassuring context.`
          : "";

      const reportLanguageSpecifics = `Report/prescription explainer specifics:
- Keep JSON field names and enum values (normal, slightly_high, slightly_low, discuss_soon, lab, medicine) in English. Only the text values (summary, confidenceNote, explanation, usage, lifestyleTips, doctorQuestions) are translated into ${langDisplay}.
- Show each lab test name as printed on the report in English plus the translated name in ${langMeta.nativeName} in brackets, for example "Hemoglobin (हीमोग्लोबिन)"${
        langMeta.code === "en" ? " (or 'Hemoglobin' in English)" : ""
      }, so the user can match it to their paper.
- Keep medicine names on prescriptions in English as printed on the prescription (e.g. "Tab Metformin 500mg") so the user can match the medicine strip, and translate the explanation and usage instructions into ${langDisplay}.
- Always use Western digits (0-9) for all numbers, values, ranges, doses, and dates.`;

      const parts: Array<
        | { text: string }
        | { inlineData: { mimeType: string; data: string } }
      > = [];

      if (mode === "upload" && file) {
        parts.push({
          inlineData: {
            mimeType: file.mimeType,
            data: file.base64,
          },
        });
        parts.push({
          text: `Please carefully read this uploaded medical document (lab report or prescription) and explain every item in plain, reassuring language at a 7th-grade reading level.
Target language: ${langDisplay} (script: ${langMeta.script}).
${buildMultilingualAiBehaviorBlock(langMeta)}
${reportLanguageSpecifics}${
            text && text.trim() ? `\n\nAdditional context from user: ${text.trim()}` : ""
          }${structuredProfilePrompt}`,
        });
      } else {
        const docKind = mode === "prescription" ? "prescription" : "lab report";
        parts.push({
          text: `Document type: ${docKind}
Selected language for explanation: ${langDisplay} (script: ${langMeta.script})${
            profileDetails.length > 0
              ? `\nUser Profile (${profileDetails.join(" | ")})`
              : ""
          }

Document content:
${text?.trim()}${structuredProfilePrompt}

${buildMultilingualAiBehaviorBlock(langMeta)}
${reportLanguageSpecifics}

Please explain every item in plain, reassuring language at a 7th-grade reading level in ${langDisplay}.`,
        });
      }

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: { parts },
        config: {
          systemInstruction: `${SYSTEM_INSTRUCTION}\n\n${buildMultilingualAiBehaviorBlock(
            langMeta
          )}\n\n${reportLanguageSpecifics}${
            profileDetails.length > 0
              ? `\nActive user profile context: ${profileDetails.join(", ")}.`
              : ""
          }`,
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
        },
      });

      const rawText = (response.text ?? "").trim();
      if (!rawText) {
        return res.status(502).json({
          error:
            "We couldn't get a clear response right now. Please take a breath and try again in a moment.",
        });
      }

      const parsed = JSON.parse(rawText);

      // Normalize all numbers to Western digits 0-9 across fields
      if (typeof parsed.summary === "string") {
        parsed.summary = toWesternDigits(parsed.summary);
      }
      if (typeof parsed.confidenceNote === "string") {
        parsed.confidenceNote = toWesternDigits(parsed.confidenceNote);
      }
      if (Array.isArray(parsed.items)) {
        parsed.items = parsed.items.map((item: any) => ({
          ...item,
          name: typeof item.name === "string" ? toWesternDigits(item.name) : item.name,
          value: typeof item.value === "string" ? toWesternDigits(item.value) : item.value,
          unit: typeof item.unit === "string" ? toWesternDigits(item.unit) : item.unit,
          referenceRange:
            typeof item.referenceRange === "string"
              ? toWesternDigits(item.referenceRange)
              : item.referenceRange,
          explanation:
            typeof item.explanation === "string"
              ? toWesternDigits(item.explanation)
              : item.explanation,
          usage:
            typeof item.usage === "string" ? toWesternDigits(item.usage) : item.usage,
        }));
      }
      if (Array.isArray(parsed.lifestyleTips)) {
        parsed.lifestyleTips = parsed.lifestyleTips.map((tip: any) =>
          typeof tip === "string" ? toWesternDigits(tip) : tip
        );
      }
      if (Array.isArray(parsed.doctorQuestions)) {
        parsed.doctorQuestions = parsed.doctorQuestions.map((q: any) =>
          typeof q === "string" ? toWesternDigits(q) : q
        );
      }

      return res.json(parsed);
    } catch (error: any) {
      console.error("Gemini analysis error:", error);
      const msg: string = error?.message || "";
      if (
        msg.includes("API_KEY_INVALID") ||
        msg.includes("PERMISSION_DENIED") ||
        msg.includes("403")
      ) {
        return res.status(403).json({
          error:
            "The Gemini API key could not be verified. Please check your API key configuration in the Settings > Secrets panel.",
        });
      }
      if (msg.includes("RESOURCE_EXHAUSTED") || msg.includes("429")) {
        return res.status(429).json({
          error:
            "The service is temporarily busy. Please wait a few seconds or select a billing-enabled API key in Settings > Secrets.",
        });
      }
      return res.status(500).json({
        error:
          "Something went wrong while reading your document. Please check that the text or file is clear and try again.",
      });
    }
  });

  app.post("/api/transcribe", async (req, res) => {
    try {
      const {
        audioBase64,
        mimeType = "audio/webm",
        language = "en",
        languageCode,
      } = req.body as {
        audioBase64?: string;
        mimeType?: string;
        language?: string;
        languageCode?: string;
      };

      if (!audioBase64) {
        return res.status(400).json({
          error: "No audio recording was received. Please try speaking again.",
        });
      }

      const langMeta = resolveLanguageMeta(languageCode || language);

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: audioBase64,
              },
            },
            {
              text: `Transcribe this dictated medical lab report or prescription audio accurately. Preserve all test names, medicine names, numbers (in Western digits 0-9), units (e.g., mg/dL, g/dL, mg, IU, %), and dosage instructions cleanly. Preferred language context: ${langMeta.englishName} (${langMeta.nativeName}). Output ONLY the transcribed text without any introductory or concluding remarks.`,
            },
          ],
        },
      });

      const transcript = toWesternDigits((response.text ?? "").trim());
      return res.json({ transcript });
    } catch (error: any) {
      console.error("Audio transcription error:", error);
      return res.status(500).json({
        error:
          "We couldn't transcribe that audio clip clearly. Please try dictating again or type your text.",
      });
    }
  });

  // In-memory rate limiter for /api/chat (no message content or profile data is ever stored)
  const chatRateLimitMap = new Map<string, number[]>();
  const CHAT_RATE_LIMIT_WINDOW_MS = 60 * 1000;
  const CHAT_RATE_LIMIT_MAX_REQUESTS = 35;

  const CHAT_RESPONSE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
      reply: {
        type: Type.STRING,
        description:
          "Warm, calm, plain-language response in the selected language (3-6 short paragraphs or a short list, 7th-grade reading level). Never name, suggest, describe, compare, or give doses for any medicine, drug, tablet, supplement, vitamin, herbal product, or home remedy.",
      },
      urgency: {
        type: Type.STRING,
        enum: ["none", "routine", "soon", "urgent", "emergency"],
        description:
          "Urgency level: 'emergency' for chest pain, trouble breathing, stroke signs, severe bleeding, fainting, seizure, severe allergic reaction, very high/low blood sugar with confusion, self-harm, or life-threatening signs; 'urgent' within 24 hours; 'soon' within a few days; 'routine' normal appointment; 'none' general info only.",
      },
      suggestedSpecialist: {
        type: Type.STRING,
        nullable: true,
        description:
          "For any urgency other than 'none', the type of doctor to see; null when urgency is 'none'.",
      },
      reasonForReferral: {
        type: Type.STRING,
        nullable: true,
        description:
          "For any urgency other than 'none', one plain sentence in the selected language explaining why seeing that doctor is recommended; null when urgency is 'none'.",
      },
      followUpQuestions: {
        type: Type.ARRAY,
        description:
          "2 to 3 short, natural tappable follow-up replies or questions from the patient's perspective in the selected language (or empty array if emergency).",
        items: {
          type: Type.STRING,
        },
      },
    },
    required: [
      "reply",
      "urgency",
      "suggestedSpecialist",
      "reasonForReferral",
      "followUpQuestions",
    ],
  };

  const EMERGENCY_CLASSIFIER_SCHEMA = {
    type: Type.OBJECT,
    properties: {
      emergency: {
        type: Type.BOOLEAN,
        description:
          "True if the user's message in ANY language or script describes a potential medical emergency (chest pain, pressure in chest, shortness of breath / trouble breathing, stroke signs like face drooping / arm weakness / slurred speech, severe bleeding, fainting / loss of consciousness, seizure, severe allergic reaction, very high or low blood sugar with confusion, self-harm / suicidal thoughts, overdose, or life-threatening symptoms).",
      },
    },
    required: ["emergency"],
  };

  const MEDICINE_GUARD_SCHEMA = {
    type: Type.OBJECT,
    properties: {
      namesMedicine: {
        type: Type.BOOLEAN,
        description:
          "True if the assistant's reply names, recommends, suggests, compares, or gives a dosage for any specific medicine, tablet, pill, drug, antibiotic, painkiller, supplement, vitamin, herbal product, or home remedy in any language, OR if the user asked which medicine/tablet/pill to take and the assistant failed to refuse.",
      },
    },
    required: ["namesMedicine"],
  };

  app.post("/api/chat", async (req, res) => {
    try {
      const clientIp =
        (typeof req.headers["x-forwarded-for"] === "string"
          ? req.headers["x-forwarded-for"].split(",")[0].trim()
          : req.ip) || "unknown";
      const now = Date.now();
      const recentTimestamps = (chatRateLimitMap.get(clientIp) || []).filter(
        (ts) => now - ts < CHAT_RATE_LIMIT_WINDOW_MS
      );
      if (recentTimestamps.length >= CHAT_RATE_LIMIT_MAX_REQUESTS) {
        return res.status(429).json({
          error:
            "You're sending messages a little quickly. Please take a slow breath and try again in a few seconds.",
        });
      }
      recentTimestamps.push(now);
      chatRateLimitMap.set(clientIp, recentTimestamps);

      const {
        profile,
        specialty = "General Physician",
        language = "en",
        languageCode,
        messages,
      } = req.body as {
        profile?: Record<string, string>;
        specialty?: string;
        language?: string;
        languageCode?: string;
        messages?: Array<{ role: "user" | "assistant"; content: string }>;
      };

      const langMeta = resolveLanguageMeta(languageCode || language);
      const langDisplay = `${langMeta.nativeName} (${langMeta.englishName}, code: ${langMeta.code})`;
      const fixedSafety =
        FIXED_SAFETY_MESSAGES[langMeta.code] || FIXED_SAFETY_MESSAGES.en;

      if (!profile || typeof profile !== "object") {
        return res.status(400).json({
          error:
            "Please complete your health profile first so your specialist guide can understand your context.",
        });
      }

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({
          error: "Please type a question or symptom to start the conversation.",
        });
      }

      // Slice to the last 12 messages as required
      const recentMessages = messages.slice(-12);
      const latestMessage = recentMessages[recentMessages.length - 1];

      if (
        !latestMessage ||
        typeof latestMessage.content !== "string" ||
        !latestMessage.content.trim()
      ) {
        return res.status(400).json({
          error: "Please enter a message before sending.",
        });
      }

      const userText = latestMessage.content.trim();
      if (userText.length > 1000) {
        return res.status(400).json({
          error:
            "Your message is a little long (over 1,000 characters). Please shorten it slightly so we can go through it step by step.",
        });
      }

      const sanitizedProfile: Record<string, string> = {};
      for (const [key, val] of Object.entries(profile)) {
        if (typeof val === "string") {
          sanitizedProfile[key] = val.trim().slice(0, 200);
        }
      }

      const cleanSpecialty =
        typeof specialty === "string" && specialty.trim()
          ? specialty.trim().slice(0, 80)
          : "General Physician";

      const systemInstruction = `You are a warm, calm AI health guide acting in the style of a ${cleanSpecialty} doctor. You are NOT a licensed doctor and must never claim to be one. You help people understand their symptoms using their health profile: ${JSON.stringify(
        sanitizedProfile
      )}.

What you do:
- Ask 1-2 short clarifying questions at a time (duration, severity, triggers, other symptoms) before drawing conclusions, unless it is an emergency.
- Explain POSSIBLE causes in plain language at a 7th-grade reading level, ordered from most to least likely, using phrases like 'can sometimes be linked to' and 'one possibility is'. Never state a definite diagnosis.
- Explain what the likely effects or outcomes could be if it is not looked at, and what usually happens over time, without causing fear.
- Always connect your answer to the user's profile when relevant (for example diabetes, blood pressure, allergies, age, blood type) and explain why it matters for them.
- Give non-medicine guidance only: what to monitor, what to note down, warning signs to watch for, rest, hydration, food and lifestyle habits, and which tests a doctor may suggest.
- End with what to do next and, when appropriate, which type of doctor to see.

Hard rules:
- NEVER name, suggest, describe, compare, or give doses for any medicine, drug, supplement, vitamin, herbal product, or home remedy meant to treat a condition. If asked about medicine, say kindly that you cannot advise on medicines and that a doctor or pharmacist who knows their full history should answer this.
- Never tell the user to start, stop, skip or change any medicine they already take.
- Never diagnose, never promise a good outcome, never say 'you are fine' or 'nothing to worry about' as a certainty.
- If the profile shows an allergy or condition relevant to the question, mention caution and encourage telling their doctor.
- Keep replies concise: 3-6 short paragraphs or a short list. No walls of text.
- If the user's message is not health-related, politely steer back.

${buildMultilingualAiBehaviorBlock(langMeta)}

Referral and urgency rules (set the 'urgency' field):
- emergency: possible chest pain, trouble breathing, stroke signs (face drooping, arm weakness, slurred speech), severe bleeding, fainting, seizure, severe allergic reaction, very high or very low blood sugar with confusion, signs of self-harm, or anything life-threatening. Reply with a short, calm, direct instruction to contact local emergency services (112 in India) or go to the nearest hospital immediately. Do not ask more questions first.
- urgent: symptoms that need a doctor within 24 hours.
- soon: should see a doctor within a few days.
- routine: can be discussed at a normal appointment.
- none: general information only.
- For any urgency other than 'none', fill suggestedSpecialist with the type of doctor to see and reasonForReferral with one plain sentence in ${langDisplay} explaining why.
- If the user mentions self-harm or severe emotional distress, respond with compassion, encourage reaching out to a trusted person and a local mental health helpline, and set urgency to 'urgent' or 'emergency'.
- Always include a gentle reminder to confirm with a real doctor. Do not repeat the long disclaimer in every message.`;

      const formattedConversation = recentMessages
        .map((m) => {
          const speaker =
            m.role === "user" ? "Patient" : `AI Guide (${cleanSpecialty})`;
          return `${speaker}: ${String(m.content || "").trim().slice(0, 1000)}`;
        })
        .join("\n\n");

      const ai = getAiClient();

      // Run main chat call and parallel emergency classifier across all 15 languages
      const mainChatPromise = ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: {
          parts: [
            {
              text: `Selected language: ${langDisplay} (script: ${langMeta.script})
Selected specialist style: ${cleanSpecialty}
Patient Health Profile JSON: ${JSON.stringify(sanitizedProfile)}

Conversation so far (last ${recentMessages.length} messages):
${formattedConversation}

Respond to the patient's latest message in ${langDisplay} (written in ${langMeta.script} script) following all instructions and hard rules. Keep JSON field names and urgency enum values in English. Return valid JSON matching the schema.`,
            },
          ],
        },
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: CHAT_RESPONSE_SCHEMA,
        },
      });

      const emergencyClassifierPromise = ai.models
        .generateContent({
          model: "gemini-3.1-flash-lite",
          contents: {
            parts: [
              {
                text: `Classify whether this patient message (which may be in any Indian language, English, or Romanized script) describes a medical emergency such as chest pain, chest pressure, difficulty breathing, stroke signs, severe bleeding, fainting, seizure, severe allergic reaction, dangerously high/low blood sugar with confusion, or self-harm.\n\nPatient message: "${userText}"`,
              },
            ],
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: EMERGENCY_CLASSIFIER_SCHEMA,
          },
        })
        .catch(() => null);

      const [response, emergencyCheckRes] = await Promise.all([
        mainChatPromise,
        emergencyClassifierPromise,
      ]);

      let classifierEmergency = false;
      if (emergencyCheckRes && emergencyCheckRes.text) {
        try {
          const parsedClassifier = JSON.parse(emergencyCheckRes.text.trim());
          classifierEmergency = Boolean(parsedClassifier?.emergency);
        } catch {
          classifierEmergency = false;
        }
      }

      const keywordEmergency = matchesEmergencyKeyword(userText);

      const rawText = (response.text ?? "").trim();
      if (!rawText) {
        return res.status(502).json({
          error:
            "Your specialist guide couldn't respond clearly just now. Please tap retry in a moment.",
        });
      }

      const parsed = JSON.parse(rawText) as {
        reply?: string;
        urgency?: "none" | "routine" | "soon" | "urgent" | "emergency";
        suggestedSpecialist?: string | null;
        reasonForReferral?: string | null;
        followUpQuestions?: string[];
      };

      const validUrgencies = new Set([
        "none",
        "routine",
        "soon",
        "urgent",
        "emergency",
      ]);
      let normalizedUrgency:
        | "none"
        | "routine"
        | "soon"
        | "urgent"
        | "emergency" = validUrgencies.has(parsed.urgency || "")
        ? (parsed.urgency as any)
        : "routine";

      let finalReply =
        typeof parsed.reply === "string" && parsed.reply.trim()
          ? toWesternDigits(parsed.reply.trim())
          : "";

      // 1. Emergency Guard: if classifier, keyword detector, or main model flags emergency
      if (
        classifierEmergency ||
        keywordEmergency ||
        normalizedUrgency === "emergency"
      ) {
        normalizedUrgency = "emergency";
        finalReply = fixedSafety.emergencyMessage;
        return res.json({
          reply: finalReply,
          urgency: "emergency",
          suggestedSpecialist: "Emergency Medicine / Nearest Hospital (112)",
          reasonForReferral: fixedSafety.emergencyMessage,
          followUpQuestions: [],
        });
      }

      // 2. Medicine Guard (/api/chat only): check both deterministic deny-list/request patterns and second Gemini classifier
      let violatesMedicine = replyViolatesMedicineRule(finalReply, userText);

      if (!violatesMedicine) {
        try {
          const medGuardRes = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: {
              parts: [
                {
                  text: `Check this health chatbot interaction (in ${langDisplay}) for medicine safety rules.
Rule: The assistant must NEVER name, recommend, suggest, compare, or give a dose for any specific medicine, tablet, pill, antibiotic, painkiller, supplement, vitamin, herbal product, or home remedy to treat a condition. Also, if the patient asks which medicine or tablet to take (for example for fever, headache, pain, cold, etc.), the assistant must strictly refuse to name any medicine.

Patient message: "${userText}"
Assistant reply: "${finalReply}"

Return JSON { "namesMedicine": true } if the assistant named/suggested/dosed any medicine, tablet, supplement, or remedy OR if the patient asked for a medicine/tablet recommendation. Otherwise return { "namesMedicine": false }.`,
                },
              ],
            },
            config: {
              responseMimeType: "application/json",
              responseSchema: MEDICINE_GUARD_SCHEMA,
            },
          });
          const medRaw = (medGuardRes.text ?? "").trim();
          if (medRaw) {
            const medParsed = JSON.parse(medRaw);
            if (medParsed?.namesMedicine === true) {
              violatesMedicine = true;
            }
          }
        } catch {
          // Fallback to deterministic check if classifier fails
        }
      }

      if (violatesMedicine) {
        finalReply = fixedSafety.medicineRefusalMessage;
      }

      return res.json({
        reply:
          finalReply ||
          fixedSafety.medicineRefusalMessage,
        urgency: normalizedUrgency,
        suggestedSpecialist:
          normalizedUrgency === "none"
            ? null
            : typeof parsed.suggestedSpecialist === "string" &&
              parsed.suggestedSpecialist.trim()
            ? toWesternDigits(parsed.suggestedSpecialist.trim())
            : cleanSpecialty,
        reasonForReferral:
          normalizedUrgency === "none"
            ? null
            : typeof parsed.reasonForReferral === "string" &&
              parsed.reasonForReferral.trim()
            ? toWesternDigits(parsed.reasonForReferral.trim())
            : fixedSafety.medicineRefusalMessage,
        followUpQuestions: Array.isArray(parsed.followUpQuestions)
          ? parsed.followUpQuestions
              .filter((q) => typeof q === "string" && q.trim())
              .map((q) => toWesternDigits(q.trim()))
              .slice(0, 4)
          : [],
      });
    } catch (error: any) {
      const msg: string = error?.message || "";
      if (
        msg.includes("API_KEY_INVALID") ||
        msg.includes("PERMISSION_DENIED") ||
        msg.includes("403")
      ) {
        return res.status(403).json({
          error:
            "The Gemini API key could not be verified. Please check your API key configuration in the Settings > Secrets panel.",
        });
      }
      if (msg.includes("RESOURCE_EXHAUSTED") || msg.includes("429")) {
        return res.status(429).json({
          error:
            "The specialist service is momentarily busy. Please wait a few seconds and tap Retry.",
        });
      }
      return res.status(500).json({
        error:
          "We couldn't reach your specialist guide right now. Please take a breath and tap Retry.",
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vitePromise = createViteServer({
      server: { middlewareMode: true, hmr: false, ws: false as const },
      appType: "spa",
    });

    app.use(async (req, res, next) => {
      try {
        const vite = await vitePromise;
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Arogya Mitra server running on http://localhost:${PORT}`);
    console.log(`  ➜  Local:   http://localhost:${PORT}/`);
    console.log(`  ➜  Network: http://0.0.0.0:${PORT}/`);
  });
}

startServer();
