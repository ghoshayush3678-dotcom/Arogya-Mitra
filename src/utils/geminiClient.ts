import { GoogleGenAI, Type } from "@google/genai";
import { FIXED_SAFETY_MESSAGES } from "../i18n/safetyMessages";
import type { TranslationDictionary } from "../i18n/types";
import {
  buildMultilingualAiBehaviorBlock,
  matchesEmergencyKeyword,
  replyViolatesMedicineRule,
  resolveLanguageMeta,
  stripCodeFences,
  toWesternDigits,
} from "./safetyRules";

declare const process: {
  env: {
    GEMINI_API_KEY?: string;
  };
};

export const PRIMARY_GEMINI_MODEL = "gemini-3.1-flash-lite";
export const FALLBACK_GEMINI_MODEL = "gemini-2.5-flash";

const DEFAULT_TIMEOUT_MS = 30000;

export class MissingApiKeyError extends Error {
  constructor() {
    super("GEMINI_API_KEY is missing in this build");
    this.name = "MissingApiKeyError";
  }
}

function getApiKey(): string {
  const viteKey =
    typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env.VITE_GEMINI_API_KEY
      : undefined;
  const definedKey =
    typeof process !== "undefined" && process.env
      ? process.env.GEMINI_API_KEY
      : undefined;
  const raw = viteKey || definedKey || "";
  return typeof raw === "string" ? raw.trim() : "";
}

function createGeminiClient(): GoogleGenAI {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new MissingApiKeyError();
  }
  return new GoogleGenAI({ apiKey });
}

export function extractGeminiHttpStatus(error: unknown): number | null {
  if (!error) return null;
  const errObj = error as Record<string, any>;
  const directStatus = Number(
    errObj?.status || errObj?.statusCode || errObj?.error?.code
  );
  if (Number.isFinite(directStatus) && directStatus >= 400 && directStatus <= 599) {
    return directStatus;
  }

  const msg = String(errObj?.message || "");
  if (/API_KEY_INVALID|INVALID_ARGUMENT|\b400\b/i.test(msg)) return 400;
  if (/PERMISSION_DENIED|REFERER_BLOCKED|API key.*blocked|\b403\b/i.test(msg))
    return 403;
  if (/NOT_FOUND|model.*not found|\b404\b/i.test(msg)) return 404;
  if (/RESOURCE_EXHAUSTED|quota|\b429\b/i.test(msg)) return 429;
  if (/UNAVAILABLE|overloaded|\b503\b/i.test(msg)) return 503;
  if (/\b504\b|timed?\s*out/i.test(msg)) return 504;
  return null;
}

export function formatGeminiErrorMessage(
  error: unknown,
  errorsDict: TranslationDictionary["errors"],
  fallbackMessage: string
): string {
  if (error instanceof MissingApiKeyError) {
    return errorsDict.apiKeyMissing;
  }

  const errName = (error as any)?.name;
  const status = extractGeminiHttpStatus(error);

  if (status === 400) return errorsDict.status400;
  if (status === 403) return errorsDict.status403;
  if (status === 404) return errorsDict.status404;
  if (status === 429) return errorsDict.status429;
  if (status === 503) return errorsDict.status503;
  if (status === 504 || errName === "AbortError" || errName === "TimeoutError") {
    return errorsDict.requestTimeout;
  }

  return fallbackMessage;
}

async function generateWithTimeout(
  ai: GoogleGenAI,
  model: string,
  request: { contents: any; config?: any },
  timeoutMs: number
) {
  const controller = new AbortController();
  let timerId: number | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timerId = window.setTimeout(() => {
      controller.abort();
      const timeoutErr = new Error(`Request timed out after ${timeoutMs}ms`);
      timeoutErr.name = "TimeoutError";
      reject(timeoutErr);
    }, timeoutMs);
  });

  try {
    const callPromise = ai.models.generateContent({
      model,
      contents: request.contents,
      config: {
        ...(request.config || {}),
        abortSignal: controller.signal,
      },
    });
    return await Promise.race([callPromise, timeoutPromise]);
  } finally {
    if (timerId !== undefined) {
      window.clearTimeout(timerId);
    }
  }
}

async function generateWithSingleFallback(
  ai: GoogleGenAI,
  request: { contents: any; config?: any },
  timeoutMs = DEFAULT_TIMEOUT_MS
) {
  try {
    return await generateWithTimeout(ai, PRIMARY_GEMINI_MODEL, request, timeoutMs);
  } catch (firstErr) {
    const status = extractGeminiHttpStatus(firstErr);
    // Do not retry on invalid/blocked key errors (400 / 403)
    if (status === 400 || status === 403) {
      throw firstErr;
    }
    return await generateWithTimeout(ai, FALLBACK_GEMINI_MODEL, request, timeoutMs);
  }
}

const REPORT_SYSTEM_INSTRUCTION =
  "You are a calm, kind health-literacy assistant. Explain medical reports in simple language at a 7th-grade reading level. Never diagnose, never recommend starting, stopping or changing any medicine or dose, and never predict outcomes. Use phrases like 'can sometimes be linked to' rather than definitive statements. Use standard adult reference ranges and mention that ranges vary by lab, age and sex. When optional user profile context (such as Name, Blood Type, Blood Sugar / Glucose status, Known Allergies, Height, Weight, or Other Details) is provided in the prompt, warmly address the user by name in the summary and thoughtfully weave their provided profile details into the report summary, relevant item explanations (for example, relating glucose/HbA1c or metabolic markers to their sugar history, noting known allergies when explaining prescribed medicines, and considering height/weight or other notes), lifestyle tips, and doctor questions in a grounded, supportive way. Include 3 simple, gentle, non-medical everyday lifestyle tips based on the analysis (such as 'Try adding a 10-minute walk to your daily routine' or drinking plenty of water). Also provide a confidenceScore out of 100 (0-100) indicating how clearly, completely, and accurately the uploaded or pasted lab report or prescription could be read and matched to reference ranges, along with a 1-sentence confidenceNote. If information is missing or unreadable, say so and ask the user to check. If the input is not a medical document, politely say so. Always respond in the language the user selected. Return only valid JSON matching the schema.";

const REPORT_RESPONSE_SCHEMA = {
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
      items: { type: Type.STRING },
    },
    doctorQuestions: {
      type: Type.ARRAY,
      description:
        "4 to 6 specific, personalized, constructive questions in the selected language that the patient can ask their doctor at their next visit.",
      items: { type: Type.STRING },
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
      items: { type: Type.STRING },
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

export interface AnalyzeDocumentParams {
  mode: "lab" | "prescription" | "upload";
  text?: string;
  file?: { base64: string; mimeType: string; name?: string };
  languageCode: string;
  language: string;
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
}

export async function analyzeMedicalDocument(params: AnalyzeDocumentParams) {
  const ai = createGeminiClient();
  const {
    mode,
    text,
    file,
    languageCode,
    language,
    userProfile,
    profilePromptContext,
  } = params;

  const langMeta = resolveLanguageMeta(languageCode || language);
  const langDisplay = `${langMeta.nativeName} (${langMeta.englishName}, code: ${langMeta.code})`;

  const profileDetails: string[] = [];
  if (userProfile?.name?.trim()) profileDetails.push(`Name: ${userProfile.name.trim()}`);
  if (userProfile?.age?.trim()) profileDetails.push(`Age: ${userProfile.age.trim()}`);
  if (userProfile?.sex?.trim()) profileDetails.push(`Sex: ${userProfile.sex.trim()}`);
  if (userProfile?.bloodType?.trim()) profileDetails.push(`Blood Type: ${userProfile.bloodType.trim()}`);
  if (userProfile?.sugar?.trim()) profileDetails.push(`Diabetes / Blood Sugar Status: ${userProfile.sugar.trim()}`);
  if (userProfile?.allergy?.trim()) profileDetails.push(`Known Allergies: ${userProfile.allergy.trim()}`);
  if (userProfile?.bloodPressure?.trim()) {
    profileDetails.push(`Blood Pressure / Fluid-Related Conditions: ${userProfile.bloodPressure.trim()}`);
  }
  if (userProfile?.existingConditions?.trim()) {
    profileDetails.push(`Existing Conditions: ${userProfile.existingConditions.trim()}`);
  }
  if (userProfile?.height?.trim()) profileDetails.push(`Height: ${userProfile.height.trim()}`);
  if (userProfile?.weight?.trim()) profileDetails.push(`Weight: ${userProfile.weight.trim()}`);
  if (userProfile?.otherDetails?.trim()) {
    profileDetails.push(`Other Health Details: ${userProfile.otherDetails.trim()}`);
  }

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
    { text: string } | { inlineData: { mimeType: string; data: string } }
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

  const response = await generateWithSingleFallback(ai, {
    contents: { parts },
    config: {
      systemInstruction: `${REPORT_SYSTEM_INSTRUCTION}\n\n${buildMultilingualAiBehaviorBlock(
        langMeta
      )}\n\n${reportLanguageSpecifics}${
        profileDetails.length > 0
          ? `\nActive user profile context: ${profileDetails.join(", ")}.`
          : ""
      }`,
      responseMimeType: "application/json",
      responseSchema: REPORT_RESPONSE_SCHEMA,
    },
  });

  const rawText = (response.text ?? "").trim();
  if (!rawText) {
    throw new Error("Empty response from Gemini");
  }

  const parsed = JSON.parse(stripCodeFences(rawText));

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
      usage: typeof item.usage === "string" ? toWesternDigits(item.usage) : item.usage,
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

  return parsed;
}

export interface SpecialistChatParams {
  profile: Record<string, string>;
  specialty: string;
  languageCode: string;
  language: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface SpecialistChatResponse {
  reply: string;
  urgency: "none" | "routine" | "soon" | "urgent" | "emergency";
  suggestedSpecialist: string | null;
  reasonForReferral: string | null;
  followUpQuestions: string[];
}

export async function sendSpecialistChat(
  params: SpecialistChatParams
): Promise<SpecialistChatResponse> {
  const { profile, specialty, languageCode, language, messages } = params;
  const langMeta = resolveLanguageMeta(languageCode || language);
  const langDisplay = `${langMeta.nativeName} (${langMeta.englishName}, code: ${langMeta.code})`;
  const fixedSafety =
    FIXED_SAFETY_MESSAGES[langMeta.code] || FIXED_SAFETY_MESSAGES.en;

  // Send only the last 12 messages
  const recentMessages = messages.slice(-12);
  const latestMessage = recentMessages[recentMessages.length - 1];
  const userText = String(latestMessage?.content || "").trim();

  // Instant local emergency detection across all 15 languages + Romanized spellings (no AI call needed)
  const keywordEmergency = matchesEmergencyKeyword(userText);
  if (keywordEmergency) {
    return {
      reply: fixedSafety.emergencyMessage,
      urgency: "emergency",
      suggestedSpecialist: "Emergency Medicine / Nearest Hospital (112)",
      reasonForReferral: fixedSafety.emergencyMessage,
      followUpQuestions: [],
    };
  }

  // Validate key before doing any work
  const ai = createGeminiClient();

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

  // Single Gemini call per message with 30s timeout, maxOutputTokens ~700, and single fallback model retry
  const response = await generateWithSingleFallback(
    ai,
    {
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
        maxOutputTokens: 700,
        responseMimeType: "application/json",
        responseSchema: CHAT_RESPONSE_SCHEMA,
      },
    },
    DEFAULT_TIMEOUT_MS
  );

  const rawText = (response.text ?? "").trim();
  if (!rawText) {
    throw new Error("Empty response from Gemini");
  }

  const cleanedRawText = stripCodeFences(rawText);
  let parsed: {
    reply?: string;
    urgency?: "none" | "routine" | "soon" | "urgent" | "emergency";
    suggestedSpecialist?: string | null;
    reasonForReferral?: string | null;
    followUpQuestions?: string[];
  };

  try {
    const jsonParsed = JSON.parse(cleanedRawText);
    if (jsonParsed && typeof jsonParsed === "object" && !Array.isArray(jsonParsed)) {
      parsed = jsonParsed;
    } else {
      parsed = {
        reply: cleanedRawText,
        urgency: "none",
        suggestedSpecialist: null,
        reasonForReferral: null,
        followUpQuestions: [],
      };
    }
  } catch {
    parsed = {
      reply: cleanedRawText,
      urgency: "none",
      suggestedSpecialist: null,
      reasonForReferral: null,
      followUpQuestions: [],
    };
  }

  const validUrgencies = new Set([
    "none",
    "routine",
    "soon",
    "urgent",
    "emergency",
  ]);
  let normalizedUrgency: SpecialistChatResponse["urgency"] = validUrgencies.has(
    parsed.urgency || ""
  )
    ? (parsed.urgency as SpecialistChatResponse["urgency"])
    : "none";

  let finalReply =
    typeof parsed.reply === "string" && parsed.reply.trim()
      ? toWesternDigits(parsed.reply.trim())
      : "";

  // Secondary emergency guard from model output
  if (normalizedUrgency === "emergency") {
    return {
      reply: fixedSafety.emergencyMessage,
      urgency: "emergency",
      suggestedSpecialist: "Emergency Medicine / Nearest Hospital (112)",
      reasonForReferral: fixedSafety.emergencyMessage,
      followUpQuestions: [],
    };
  }

  // Local medicine deny-list & medicine-request check across all 15 languages (zero extra AI calls)
  if (replyViolatesMedicineRule(finalReply, userText)) {
    finalReply = fixedSafety.medicineRefusalMessage;
  }

  return {
    reply: finalReply || fixedSafety.medicineRefusalMessage,
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
  };
}

export async function transcribeMedicalAudio(params: {
  audioBase64: string;
  mimeType: string;
  languageCode: string;
  language: string;
}): Promise<string> {
  const ai = createGeminiClient();
  const langMeta = resolveLanguageMeta(params.languageCode || params.language);

  const response = await generateWithSingleFallback(ai, {
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: params.mimeType,
            data: params.audioBase64,
          },
        },
        {
          text: `Transcribe this dictated medical lab report or prescription audio accurately. Preserve all test names, medicine names, numbers (in Western digits 0-9), units (e.g., mg/dL, g/dL, mg, IU, %), and dosage instructions cleanly. Preferred language context: ${langMeta.englishName} (${langMeta.nativeName}). Output ONLY the transcribed text without any introductory or concluding remarks.`,
        },
      ],
    },
  });

  const transcript = toWesternDigits((response.text ?? "").trim());
  if (!transcript) {
    throw new Error("Empty transcript from Gemini");
  }
  return transcript;
}
