import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  UploadCloud,
  FileText,
  Pill,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
  Printer,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  ChevronDown,
  Globe,
  Trash2,
  Settings,
  Moon,
  Sun,
  X,
  Clock,
  Search,
  Mic,
  Square,
  HeartHandshake,
  Camera,
  Menu,
  Share2,
  User,
  Droplets,
  Activity,
  Scale,
  Ruler,
  Lock,
  Send,
  PhoneCall,
  MapPin,
  MessageCircleHeart,
  Stethoscope,
  Edit3,
  Download,
} from "lucide-react";
import {
  AYURVEDA_SANCTUARY_IMAGE_DATA_URI,
  BOTANICAL_HISTORY_IMAGE_DATA_URI,
} from "./assets/embeddedImages";
import {
  en,
  loadLanguageDictionary,
  ensureLanguageFontLoaded,
  LANGUAGE_META_MAP,
  SUPPORTED_LANGUAGES,
  type LanguageCode,
  type TranslationDictionary,
} from "./i18n";
import { LanguageSelector } from "./components/LanguageSelector";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export type ItemStatus = "normal" | "slightly_high" | "slightly_low" | "discuss_soon";
export type ItemType = "lab" | "medicine";

export interface ReportItem {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: ItemStatus;
  explanation: string;
  type: ItemType;
  usage?: string;
}

export interface AnalysisResult {
  summary: string;
  confidenceScore?: number;
  confidenceNote?: string;
  items: ReportItem[];
  lifestyleTips?: string[];
  doctorQuestions: string[];
  urgentFlag: boolean;
}

type TabType = "lab" | "prescription" | "upload";
type ThemeMode = "light" | "dark";
type TextScale = "standard" | "comfortable";

export type SpecialistType =
  | "General Physician"
  | "Cardiologist"
  | "Endocrinologist/Diabetes"
  | "Dermatologist"
  | "Neurologist"
  | "Gastroenterologist"
  | "Women's Health"
  | "Pediatrician"
  | "Mental Wellbeing";

export type ChatUrgency = "none" | "routine" | "soon" | "urgent" | "emergency";

export interface SpecialistChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  specialty?: SpecialistType;
  urgency?: ChatUrgency;
  suggestedSpecialist?: string | null;
  reasonForReferral?: string | null;
  followUpQuestions?: string[];
  isInitialGreeting?: boolean;
}

export interface UserProfile {
  name: string;
  age: string;
  sex: string;
  bloodType: string;
  sugar: string;
  allergy: string;
  bloodPressure: string;
  existingConditions: string;
  height: string;
  weight: string;
  otherDetails: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  mode: TabType;
  language: string;
  languageCode?: LanguageCode;
  title: string;
  result: AnalysisResult;
  userProfile?: UserProfile;
}

function normalizeLanguageCode(input?: string): LanguageCode {
  if (!input) return "en";
  const lower = input.trim().toLowerCase();
  if (lower in LANGUAGE_META_MAP) return lower as LanguageCode;
  const found = SUPPORTED_LANGUAGES.find(
    (l) =>
      l.englishName.toLowerCase() === lower ||
      l.nativeName.toLowerCase() === lower
  );
  return found ? found.code : "en";
}

const SESSION_HISTORY_STORAGE_KEY = "plainly_session_history";

const EMPTY_USER_PROFILE: UserProfile = {
  name: "",
  age: "",
  sex: "",
  bloodType: "",
  sugar: "",
  allergy: "",
  bloodPressure: "",
  existingConditions: "",
  height: "",
  weight: "",
  otherDetails: "",
};

const SAMPLE_COMPLETE_PROFILE: UserProfile = {
  name: "Riya Sen",
  age: "42",
  sex: "Female",
  bloodType: "O+",
  sugar: "Type 2 Diabetes (Fasting ~118 mg/dL)",
  allergy: "Penicillin",
  bloodPressure: "Mild hypertension (132/84 mmHg), no fluid retention",
  existingConditions: "Mild hypothyroidism",
  height: "164 cm",
  weight: "64 kg",
  otherDetails: "Vegetarian diet, walks 20 mins daily",
};

const PROFILE_REQUIRED_FIELDS: Array<{
  key: keyof UserProfile;
  label: string;
  inputId: string;
}> = [
  { key: "name", label: "Name", inputId: "profile-name-input" },
  { key: "age", label: "Age", inputId: "profile-age-input" },
  { key: "sex", label: "Sex", inputId: "profile-sex-select" },
  { key: "bloodType", label: "Blood Type", inputId: "profile-blood-type-select" },
  { key: "sugar", label: "Diabetes Status", inputId: "profile-sugar-input" },
  { key: "allergy", label: "Allergies", inputId: "profile-allergy-input" },
  {
    key: "bloodPressure",
    label: "Blood Pressure / Fluid Conditions",
    inputId: "profile-bp-input",
  },
  {
    key: "existingConditions",
    label: "Existing Conditions",
    inputId: "profile-conditions-input",
  },
  { key: "height", label: "Height", inputId: "profile-height-input" },
  { key: "weight", label: "Weight", inputId: "profile-weight-input" },
  { key: "otherDetails", label: "Other Details", inputId: "profile-other-input" },
];

function getMissingProfileFields(profile: UserProfile) {
  return PROFILE_REQUIRED_FIELDS.filter(
    (field) => !profile[field.key] || !profile[field.key].trim()
  );
}

function isProfileCompleteForSpecialist(profile: UserProfile): boolean {
  return getMissingProfileFields(profile).length === 0;
}

const SEX_OPTIONS = [
  "",
  "Female",
  "Male",
  "Non-binary / Other",
  "Prefer not to say",
] as const;

const BLOOD_TYPE_OPTIONS = [
  "",
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
  "Unknown / Not sure",
] as const;

const SUGAR_PRESET_OPTIONS = [
  "None / Non-diabetic",
  "Borderline / Pre-diabetes",
  "Type 2 Diabetes",
  "Type 1 Diabetes",
  "Gestational Sugar Monitoring",
  "Fasting ~90–100 mg/dL",
  "Fasting ~110–125 mg/dL",
] as const;

const ALLERGY_PRESET_OPTIONS = [
  "None known",
  "Penicillin",
  "Sulfa drugs",
  "Dust / Pollen",
  "Peanuts / Tree nuts",
  "NSAIDs / Pain relievers",
] as const;

const BP_FLUID_PRESET_OPTIONS = [
  "Normal BP, no fluid retention",
  "High Blood Pressure (Hypertension)",
  "Low Blood Pressure (occasional dizziness)",
  "Mild ankle swelling / fluid retention",
  "None",
] as const;

const EXISTING_CONDITIONS_PRESET_OPTIONS = [
  "None",
  "Hypothyroidism / Thyroid condition",
  "Asthma / Mild breathing sensitivity",
  "PCOS / Hormonal balance",
  "Acid reflux / Gastritis",
  "High cholesterol / Lipid monitoring",
] as const;

export const SPECIALIST_OPTIONS: Array<{
  id: SpecialistType;
  label: string;
  shortDesc: string;
}> = [
  {
    id: "General Physician",
    label: "General Physician",
    shortDesc: "Everyday symptoms, fever, fatigue, aches & whole-body guidance",
  },
  {
    id: "Cardiologist",
    label: "Cardiologist",
    shortDesc: "Heart rhythm, blood pressure, circulation & chest comfort",
  },
  {
    id: "Endocrinologist/Diabetes",
    label: "Endocrinologist/Diabetes",
    shortDesc: "Blood sugar, diabetes, thyroid, hormones & metabolism",
  },
  {
    id: "Dermatologist",
    label: "Dermatologist",
    shortDesc: "Skin rashes, itching, allergies, hair & nail concerns",
  },
  {
    id: "Neurologist",
    label: "Neurologist",
    shortDesc: "Headaches, migraines, dizziness, tingling & sleep",
  },
  {
    id: "Gastroenterologist",
    label: "Gastroenterologist",
    shortDesc: "Digestion, acidity, bloating, stomach & gut comfort",
  },
  {
    id: "Women's Health",
    label: "Women's Health",
    shortDesc: "Cycles, PCOS, pregnancy wellness, iron & hormonal care",
  },
  {
    id: "Pediatrician",
    label: "Pediatrician",
    shortDesc: "Child & family growth, nutrition, fevers & gentle care",
  },
  {
    id: "Mental Wellbeing",
    label: "Mental Wellbeing",
    shortDesc: "Stress, anxious thoughts, low mood, rest & emotional calm",
  },
];

export function SpecialistHandDrawnIcon({
  specialty,
  className = "w-5 h-5",
}: {
  specialty: SpecialistType;
  className?: string;
}) {
  switch (specialty) {
    case "Cardiologist":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M12 20.5C12 20.5 4.5 15.2 4.5 9.3C4.5 6.4 6.8 4.2 9.5 4.2C11.1 4.2 12 5.2 12 5.2C12 5.2 12.9 4.2 14.5 4.2C17.2 4.2 19.5 6.4 19.5 9.3C19.5 15.2 12 20.5 12 20.5Z" />
          <path d="M7.5 12H10L11.2 9.5L12.8 14.2L14 12H16.5" />
        </svg>
      );
    case "Endocrinologist/Diabetes":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M12 3.5C12 3.5 6.5 10 6.5 14.5C6.5 17.8 9 20.5 12 20.5C15 20.5 17.5 17.8 17.5 14.5C17.5 10 12 3.5 12 3.5Z" />
          <path d="M9.8 14.5H14.2M12 12.3V16.7" />
        </svg>
      );
    case "Dermatologist":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M12 3.8C7.8 7.5 6.8 12.2 8.5 16.5C9.8 19.4 12 20.6 12 20.6C12 20.6 14.2 19.4 15.5 16.5C17.2 12.2 16.2 7.5 12 3.8Z" />
          <path d="M12 20.2V9.5M9.5 14C10.5 14.8 11.3 15.2 12 15.5" />
        </svg>
      );
    case "Neurologist":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M9.5 4.5C7 4.5 5 6.5 5 9C5 10.2 5.5 11.2 6.2 12C5.4 12.8 5 13.9 5 15.2C5 17.6 7 19.5 9.5 19.5H11V4.5H9.5Z" />
          <path d="M14.5 4.5C17 4.5 19 6.5 19 9C19 10.2 18.5 11.2 17.8 12C18.6 12.8 19 13.9 19 15.2C19 17.6 17 19.5 14.5 19.5H13V4.5H14.5Z" />
        </svg>
      );
    case "Gastroenterologist":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M9.5 4V8.2C9.5 9.5 7 10.8 7 14C7 17.3 9.6 19.8 12.8 19.8C15.5 19.8 17.5 18 17.5 15.5C17.5 13.2 15.8 11.8 14 11.2C12.5 10.7 12.2 9.4 12.5 8V4" />
          <path d="M9.5 15.2C10.5 16.2 12 16.6 13.5 16.2" />
        </svg>
      );
    case "Women's Health":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M12 5C9.5 8.2 8.8 11.5 10.2 14.5C11 16.2 12 17 12 17C12 17 13 16.2 13.8 14.5C15.2 11.5 14.5 8.2 12 5Z" />
          <path d="M6.5 12.5C8.2 15.8 10.2 17 12 17C13.8 17 15.8 15.8 17.5 12.5" />
          <path d="M8.5 19.5H15.5" />
        </svg>
      );
    case "Pediatrician":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="7.5" />
          <path d="M9.5 10.5H9.51M14.5 10.5H14.51" strokeWidth="2" />
          <path d="M9.2 14.2C10.1 15.3 11.2 15.8 12 15.8C12.8 15.8 13.9 15.3 14.8 14.2" />
          <path d="M12 4.5C12 3.2 13.2 2.8 13.8 3.6" />
        </svg>
      );
    case "Mental Wellbeing":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M12 4.2L13.8 8.6L18.2 10.4L13.8 12.2L12 16.6L10.2 12.2L5.8 10.4L10.2 8.6L12 4.2Z" />
          <path d="M6 19.2C8.5 17.8 15.5 17.8 18 19.2" />
        </svg>
      );
    case "General Physician":
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M6.5 4.5V9.5C6.5 12.5 8.8 14.8 11.8 14.8C14.8 14.8 17.1 12.5 17.1 9.5V4.5" />
          <path d="M11.8 14.8V17.5C11.8 19.2 13.2 20.5 14.9 20.5C16.6 20.5 18 19.2 18 17.5V15.2" />
          <circle cx="18" cy="13.5" r="1.7" />
        </svg>
      );
  }
}

function getFirstNameFromProfile(name: string): string {
  const cleaned = name.trim();
  if (!cleaned) return "Friend";
  return cleaned.split(/\s+/)[0];
}

function getRelevantProfileHighlight(profile: UserProfile): string {
  const candidates = [
    profile.sugar.trim() &&
    !/^(none|no|n\/a|normal)$/i.test(profile.sugar.trim())
      ? `${profile.sugar.trim()}`
      : "",
    profile.bloodPressure.trim() &&
    !/^(none|no|n\/a|normal)$/i.test(profile.bloodPressure.trim())
      ? `${profile.bloodPressure.trim()}`
      : "",
    profile.allergy.trim() &&
    !/^(none|none known|no|n\/a)$/i.test(profile.allergy.trim())
      ? `${profile.allergy.trim()}`
      : "",
    profile.existingConditions.trim() &&
    !/^(none|no|n\/a)$/i.test(profile.existingConditions.trim())
      ? `${profile.existingConditions.trim()}`
      : "",
    profile.bloodType.trim() ? `${profile.bloodType.trim()}` : "",
  ].filter(Boolean);

  return candidates[0] || "OK";
}

function buildFirstBotGreeting(
  profile: UserProfile,
  t: TranslationDictionary
): string {
  const firstName = getFirstNameFromProfile(profile.name);
  const highlight = getRelevantProfileHighlight(profile);
  return t.chat.firstBotGreeting
    .replace("{name}", firstName)
    .replace("{firstName}", firstName)
    .replace("{highlight}", highlight);
}

function getUrgencyMeta(urgency: ChatUrgency, t: TranslationDictionary) {
  switch (urgency) {
    case "emergency":
      return {
        label: t.chat.urgencyLabels.emergency,
        surface: "bg-[#C8694A]/15 dark:bg-[#C8694A]/22",
        border: "border-[#C8694A]/50 dark:border-[#E2876B]/50",
        text: "text-[#8F3519] dark:text-[#F7B6A1]",
        badgeBg: "bg-[#C8694A] text-[#FAF7F2]",
        Icon: AlertCircle,
      };
    case "urgent":
      return {
        label: t.chat.urgencyLabels.urgent,
        surface: "bg-[#C8694A]/12 dark:bg-[#C8694A]/18",
        border: "border-[#C8694A]/40 dark:border-[#E2876B]/40",
        text: "text-[#8F3519] dark:text-[#F7B6A1]",
        badgeBg: "bg-[#C8694A]/20 text-[#8F3519] dark:text-[#F7B6A1]",
        Icon: AlertCircle,
      };
    case "soon":
      return {
        label: t.chat.urgencyLabels.soon,
        surface: "bg-[#D99B52]/14 dark:bg-[#D99B52]/20",
        border: "border-[#D99B52]/45 dark:border-[#F0C675]/40",
        text: "text-[#7D5010] dark:text-[#F5D08A]",
        badgeBg: "bg-[#D99B52]/22 text-[#7D5010] dark:text-[#F5D08A]",
        Icon: Clock,
      };
    case "routine":
    default:
      return {
        label: t.chat.urgencyLabels.routine,
        surface: "bg-[#DCE8E2]/70 dark:bg-[#1B332E]",
        border: "border-[#1F4E4A]/20 dark:border-[#8CE0C0]/25",
        text: "text-[#1F4E4A] dark:text-[#8CE0C0]",
        badgeBg: "bg-[#DCE8E2] dark:bg-[#24423B] text-[#1F4E4A] dark:text-[#8CE0C0]",
        Icon: CheckCircle2,
      };
  }
}

function getActiveProfileSummaryParts(profile: UserProfile): string[] {
  const parts: string[] = [];
  if (profile.name.trim()) parts.push(`Name: ${profile.name.trim()}`);
  if (profile.age.trim()) parts.push(`Age: ${profile.age.trim()}`);
  if (profile.sex.trim()) parts.push(`Sex: ${profile.sex.trim()}`);
  if (profile.bloodType.trim()) parts.push(`Blood Type: ${profile.bloodType.trim()}`);
  if (profile.sugar.trim()) parts.push(`Diabetes/Sugar: ${profile.sugar.trim()}`);
  if (profile.allergy.trim()) parts.push(`Allergies: ${profile.allergy.trim()}`);
  if (profile.bloodPressure.trim())
    parts.push(`BP/Fluid: ${profile.bloodPressure.trim()}`);
  if (profile.existingConditions.trim())
    parts.push(`Conditions: ${profile.existingConditions.trim()}`);
  if (profile.height.trim()) parts.push(`Height: ${profile.height.trim()}`);
  if (profile.weight.trim()) parts.push(`Weight: ${profile.weight.trim()}`);
  if (profile.otherDetails.trim()) parts.push(`Other Details: ${profile.otherDetails.trim()}`);
  return parts;
}

function buildProfilePromptContext(profile: UserProfile): string {
  const parts = getActiveProfileSummaryParts(profile);
  if (parts.length === 0) return "";

  const cleanName = profile.name.trim();
  return `Report Summary Context — ${parts.join(
    ", "
  )}. Please address ${
    cleanName || "the patient"
  } warmly in the report summary and tailor explanations, medicine allergy notes, blood sugar context, blood pressure/fluid notes, existing conditions, and lifestyle tips using these profile details (${parts.join(
    "; "
  )}).`;
}

const CALM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const SAMPLE_LAB_REPORT = `COMPREHENSIVE HEALTH PANEL — ADULT DIAGNOSTIC LABS
Patient Age: 44 | Sex: Female | Collection Date: Oct 24, 2026

COMPLETE BLOOD COUNT (CBC)
Hemoglobin (Hb): 11.3 g/dL (Reference Range: 12.0 - 15.5 g/dL)
Total WBC Count: 6,800 /mcL (Reference Range: 4,500 - 11,000 /mcL)
Platelet Count: 235,000 /mcL (Reference Range: 150,000 - 450,000 /mcL)

LIPID PROFILE (FASTING)
Total Cholesterol: 216 mg/dL (Desirable: < 200 mg/dL)
LDL Cholesterol: 134 mg/dL (Optimal: < 100 mg/dL)
HDL Cholesterol: 54 mg/dL (Reference: > 50 mg/dL)
Triglycerides: 158 mg/dL (Normal: < 150 mg/dL)

BLOOD SUGAR & KIDNEY FUNCTION
Fasting Blood Glucose: 105 mg/dL (Normal: 70 - 99 mg/dL)
HbA1c (Glycated Hemoglobin): 5.8 % (Normal: 4.0 - 5.6 %)
Serum Creatinine: 0.78 mg/dL (Reference Range: 0.60 - 1.10 mg/dL)`;

const SAMPLE_PRESCRIPTION = `Rx — OUTPATIENT CLINIC NOTE
Date: Oct 24, 2026

1. Tab. Metformin SR 500 mg — Take 1 tablet once daily with dinner for 30 days.
2. Tab. Rosuvastatin 5 mg — Take 1 tablet at bedtime daily.
3. Cap. Cholecalciferol (Vitamin D3) 60,000 IU — Take 1 capsule once a week with milk for 8 weeks.
4. Tab. Ferrous Ascorbate 100 mg — Take 1 tablet daily after lunch.`;

/**
 * Counts up the primary numeric value in a string quickly on first display (e.g. "11.3", "235,000", "500 mg").
 */
function AnimatedValue({
  value,
  reducedMotion,
}: {
  value: string;
  reducedMotion: boolean;
}) {
  const [displayValue, setDisplayValue] = useState<string>(value);

  useEffect(() => {
    if (reducedMotion || !value) {
      setDisplayValue(value);
      return;
    }

    const match = value.match(/^([^0-9]*)([0-9][0-9,]*\.?[0-9]*)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const prefix = match[1] || "";
    const rawNumStr = match[2] || "";
    const suffix = match[3] || "";
    const hasCommas = rawNumStr.includes(",");
    const cleanNumStr = rawNumStr.replace(/,/g, "");
    const target = parseFloat(cleanNumStr);

    if (Number.isNaN(target) || target === 0) {
      setDisplayValue(value);
      return;
    }

    const decimalPart = cleanNumStr.split(".")[1];
    const decimals = decimalPart ? decimalPart.length : 0;
    const duration = 550;
    const startTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Cubic ease-out matching calm easing
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      let formatted = current.toFixed(decimals);
      if (hasCommas) {
        const parts = formatted.split(".");
        parts[0] = Number(parts[0]).toLocaleString("en-US");
        formatted = parts.join(".");
      }

      setDisplayValue(`${prefix}${formatted}${suffix}`);

      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        setDisplayValue(value);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [value, reducedMotion]);

  return <>{displayValue}</>;
}

function computeMarkerPercentage(item: ReportItem): number {
  if (item.type === "medicine") return 50;

  const valNum = parseFloat(String(item.value).replace(/,/g, ""));
  const rangeStr = String(item.referenceRange || "").replace(/,/g, "");

  if (!Number.isNaN(valNum)) {
    const intervalMatch = rangeStr.match(
      /(\d+(?:\.\d+)?)\s*(?:-|–|to)\s*(\d+(?:\.\d+)?)/i
    );
    if (intervalMatch) {
      const low = parseFloat(intervalMatch[1]);
      const high = parseFloat(intervalMatch[2]);
      if (high > low) {
        const ratio = (valNum - low) / (high - low);
        const mapped = 25 + ratio * 50;
        return Math.max(7, Math.min(93, Math.round(mapped)));
      }
    }

    const upperBoundMatch = rangeStr.match(/<\s*(\d+(?:\.\d+)?)/);
    if (upperBoundMatch) {
      const maxVal = parseFloat(upperBoundMatch[1]);
      if (maxVal > 0) {
        if (valNum <= maxVal) {
          const pct = 25 + (valNum / maxVal) * 48;
          return Math.max(15, Math.min(73, Math.round(pct)));
        } else {
          const excess = (valNum - maxVal) / maxVal;
          return Math.max(77, Math.min(93, Math.round(76 + excess * 45)));
        }
      }
    }

    const lowerBoundMatch = rangeStr.match(/>\s*(\d+(?:\.\d+)?)/);
    if (lowerBoundMatch) {
      const minVal = parseFloat(lowerBoundMatch[1]);
      if (minVal > 0) {
        if (valNum >= minVal) {
          return 56;
        } else {
          return 16;
        }
      }
    }
  }

  switch (item.status) {
    case "normal":
      return 50;
    case "slightly_low":
      return 17;
    case "slightly_high":
      return 82;
    case "discuss_soon":
      return 90;
    default:
      return 50;
  }
}

/**
 * Generates deterministic pseudo-random drift & ambient float parameters per item card
 * so each card gently drifts into place from a unique angle and softly floats without re-render jitter.
 */
function getCardDriftMotion(name: string, idx: number) {
  let hash = (idx + 1) * 131;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % 10000;
  }
  const normA = (hash % 100) / 100; // 0..0.99
  const normB = ((hash * 7) % 100) / 100;
  const normC = ((hash * 13) % 100) / 100;

  const dir = idx % 2 === 0 ? -1 : 1;
  // Initial drift-in offsets
  const initialX = dir * (6 + normA * 9); // -15px .. +15px
  const initialY = 20 + normB * 14; // 20px .. 34px
  const initialRotate = dir * (0.45 + normC * 0.95); // -1.4deg .. +1.4deg
  const entryDuration = 0.62 + normA * 0.22; // 0.62s .. 0.84s
  const entryDelay = idx * 0.08 + normB * 0.04;

  // Ambient gentle floating loop once settled
  const floatY = 2.5 + normA * 2.5; // 2.5px .. 5px
  const floatX = -dir * (1.2 + normB * 1.8); // subtle horizontal sway
  const floatRotate = dir * (0.18 + normC * 0.25); // subtle tilt
  const floatDuration = 5.2 + normB * 2.4; // 5.2s .. 7.6s
  const floatDelay = entryDelay + entryDuration + normC * 0.5;

  return {
    initialX,
    initialY,
    initialRotate,
    entryDuration,
    entryDelay,
    floatY,
    floatX,
    floatRotate,
    floatDuration,
    floatDelay,
  };
}

function getStatusMeta(
  status: ItemStatus,
  type: ItemType,
  t: TranslationDictionary
) {
  if (type === "medicine" && status === "normal") {
    return {
      label: t.results.statusPrescribedMedicine,
      Icon: Pill,
      textColor: "text-[#1F4E4A] dark:text-[#9CE0D3]",
      barColor: "bg-[#5E9C84]",
      surfaceColor: "bg-[#5E9C84]/12 dark:bg-[#5E9C84]/20",
      borderColor: "border-[#5E9C84]/35 dark:border-[#5E9C84]/40",
    };
  }

  switch (status) {
    case "normal":
      return {
        label: t.results.statusNormal,
        Icon: CheckCircle2,
        textColor: "text-[#2A634E] dark:text-[#8ED0B5]",
        barColor: "bg-[#5E9C84]",
        surfaceColor: "bg-[#5E9C84]/14 dark:bg-[#5E9C84]/20",
        borderColor: "border-[#5E9C84]/35 dark:border-[#5E9C84]/45",
      };
    case "slightly_high":
      return {
        label: t.results.statusSlightlyHigh,
        Icon: ArrowUpRight,
        textColor: "text-[#8A5B13] dark:text-[#F0C675]",
        barColor: "bg-[#D9A441]",
        surfaceColor: "bg-[#D9A441]/15 dark:bg-[#D9A441]/20",
        borderColor: "border-[#D9A441]/40 dark:border-[#D9A441]/45",
      };
    case "slightly_low":
      return {
        label: t.results.statusSlightlyLow,
        Icon: ArrowDownRight,
        textColor: "text-[#8A5B13] dark:text-[#F0C675]",
        barColor: "bg-[#D9A441]",
        surfaceColor: "bg-[#D9A441]/15 dark:bg-[#D9A441]/20",
        borderColor: "border-[#D9A441]/40 dark:border-[#D9A441]/45",
      };
    case "discuss_soon":
    default:
      return {
        label: t.results.statusDiscussSoon,
        Icon: HelpCircle,
        textColor: "text-[#963E34] dark:text-[#F2A69D]",
        barColor: "bg-[#D9776B]",
        surfaceColor: "bg-[#D9776B]/15 dark:bg-[#D9776B]/20",
        borderColor: "border-[#D9776B]/40 dark:border-[#D9776B]/45",
      };
  }
}

function getConfidenceBadge(score: number, t: TranslationDictionary) {
  if (score >= 90) {
    return {
      label: t.results.clarityHigh,
      Icon: CheckCircle2,
      textClass: "text-[#2A634E] dark:text-[#8ED0B5]",
      barClass: "bg-[#5E9C84]",
      chipBg: "bg-[#5E9C84]/14 dark:bg-[#5E9C84]/20",
      chipBorder: "border-[#5E9C84]/35 dark:border-[#5E9C84]/45",
    };
  }
  if (score >= 75) {
    return {
      label: t.results.clarityGood,
      Icon: ShieldCheck,
      textClass: "text-[#8A5B13] dark:text-[#F0C675]",
      barClass: "bg-[#D9A441]",
      chipBg: "bg-[#D9A441]/15 dark:bg-[#D9A441]/20",
      chipBorder: "border-[#D9A441]/40 dark:border-[#D9A441]/45",
    };
  }
  return {
    label: t.results.clarityPartial,
    Icon: AlertCircle,
    textClass: "text-[#963E34] dark:text-[#F2A69D]",
    barClass: "bg-[#D9776B]",
    chipBg: "bg-[#D9776B]/15 dark:bg-[#D9776B]/20",
    chipBorder: "border-[#D9776B]/40 dark:border-[#D9776B]/45",
  };
}

export default function App() {
  const prefersReducedMotion = Boolean(useReducedMotion());

  const [activeTab, setActiveTab] = useState<TabType>("lab");
  // Session-only shared language setting across both features
  const [languageCode, setLanguageCode] = useState<LanguageCode>("en");
  const [t, setT] = useState<TranslationDictionary>(en);
  const [chatLanguageChangedNotice, setChatLanguageChangedNotice] = useState<
    string | null
  >(null);

  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [textScale, setTextScale] = useState<TextScale>("standard");
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const [inputText, setInputText] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
    mimeType: string;
    base64: string;
    previewUrl?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copiedQuestions, setCopiedQuestions] = useState<boolean>(false);
  const [checkedQuestionIndices, setCheckedQuestionIndices] = useState<
    Record<number, boolean>
  >({});
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>("");
  const [sessionHistory, setSessionHistory] = useState<HistoryEntry[]>(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_HISTORY_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
    } catch {
      return [];
    }
  });
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [historySearchQuery, setHistorySearchQuery] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [itemStatusFilter, setItemStatusFilter] = useState<
    "all" | "attention" | "normal"
  >("all");
  const [sharedSummarySuccess, setSharedSummarySuccess] =
    useState<boolean>(false);

  // Session-only state for user health profile (stays in current session only; never stored or logged)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => ({
    ...EMPTY_USER_PROFILE,
  }));

  useEffect(() => {
    try {
      window.localStorage.removeItem("arogya_mitra_user_profile_v1");
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Lazy-load dictionary & dynamic Google Font when languageCode changes
  useEffect(() => {
    let active = true;
    ensureLanguageFontLoaded(languageCode);
    loadLanguageDictionary(languageCode)
      .then((dict) => {
        if (active) setT(dict);
      })
      .catch(() => {
        if (active) setT(en);
      });
    return () => {
      active = false;
    };
  }, [languageCode]);

  const localizedProfileRequiredFields: Array<{
    key: keyof UserProfile;
    label: string;
    inputId: string;
  }> = [
    { key: "name", label: t.profile.nameLabel, inputId: "profile-name-input" },
    { key: "age", label: t.profile.ageLabel, inputId: "profile-age-input" },
    { key: "sex", label: t.profile.sexLabel, inputId: "profile-sex-select" },
    {
      key: "bloodType",
      label: t.profile.bloodTypeLabel,
      inputId: "profile-blood-type-select",
    },
    {
      key: "sugar",
      label: t.profile.sugarLabel,
      inputId: "profile-sugar-input",
    },
    {
      key: "allergy",
      label: t.profile.allergyLabel,
      inputId: "profile-allergy-input",
    },
    {
      key: "bloodPressure",
      label: t.profile.bpLabel,
      inputId: "profile-bp-input",
    },
    {
      key: "existingConditions",
      label: t.profile.conditionsLabel,
      inputId: "profile-conditions-input",
    },
    {
      key: "height",
      label: t.profile.heightLabel,
      inputId: "profile-height-input",
    },
    {
      key: "weight",
      label: t.profile.weightLabel,
      inputId: "profile-weight-input",
    },
    {
      key: "otherDetails",
      label: t.profile.otherLabel,
      inputId: "profile-other-input",
    },
  ];

  const activeProfileSummaryParts = getActiveProfileSummaryParts(userProfile);
  const hasActiveUserProfile = activeProfileSummaryParts.length > 0;
  const missingProfileFields = localizedProfileRequiredFields.filter(
    (field) => !userProfile[field.key] || !userProfile[field.key].trim()
  );
  const isProfileComplete = missingProfileFields.length === 0;
  const completedProfileCount =
    localizedProfileRequiredFields.length - missingProfileFields.length;

  // "Ask a Specialist" Chatbot States
  const [selectedSpecialty, setSelectedSpecialty] =
    useState<SpecialistType>("General Physician");
  const [chatMessages, setChatMessages] = useState<SpecialistChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [lastFailedUserMessage, setLastFailedUserMessage] = useState<
    string | null
  >(null);
  const [copiedChatSummary, setCopiedChatSummary] = useState<boolean>(false);
  const [hasSeenChatConsent, setHasSeenChatConsent] = useState<boolean>(false);
  const [isConfirmingClearChat, setIsConfirmingClearChat] =
    useState<boolean>(false);
  const [hasClearedChatSession, setHasClearedChatSession] =
    useState<boolean>(false);

  const specialistSectionRef = useRef<HTMLElement>(null);
  const profileSectionRef = useRef<HTMLDivElement>(null);
  const chatViewportRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  // Voice-to-text dictation states & refs
  const [isDictating, setIsDictating] = useState<boolean>(false);
  const [isTranscribingAudio, setIsTranscribingAudio] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const speechRecognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const workspaceRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const itemsBreakdownRef = useRef<HTMLDivElement>(null);
  const doctorChecklistRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = async (nextCode: LanguageCode) => {
    if (nextCode === languageCode) return;
    setLanguageCode(nextCode);
    ensureLanguageFontLoaded(nextCode);
    const nextDict = await loadLanguageDictionary(nextCode).catch(() => en);
    setT(nextDict);

    const nextMeta = LANGUAGE_META_MAP[nextCode] || LANGUAGE_META_MAP.en;
    const displayLang =
      nextMeta.code === "en"
        ? nextMeta.englishName
        : `${nextMeta.nativeName} (${nextMeta.englishName})`;

    if (chatMessages.length > 0) {
      setChatLanguageChangedNotice(
        nextDict.languageSelector.languageChangedNotice.replace(
          "{language}",
          displayLang
        )
      );
    }
  };

  // Sync Dark Mode class with <html> element
  useEffect(() => {
    const rootEl = document.documentElement;
    if (themeMode === "dark") {
      rootEl.classList.add("dark");
    } else {
      rootEl.classList.remove("dark");
    }
  }, [themeMode]);

  // Crossfade loading messages every 2.5 seconds
  useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0);
      return;
    }
    const timer = window.setInterval(() => {
      setLoadingStep(
        (prev) => (prev + 1) % Math.max(1, t.loading.messages.length)
      );
    }, 2500);
    return () => window.clearInterval(timer);
  }, [isLoading, t.loading.messages.length]);

  // Initialize or update the warm first bot message when profile becomes complete
  useEffect(() => {
    if (!isProfileComplete || hasClearedChatSession) return;
    setChatMessages((prev) => {
      const greetingContent = buildFirstBotGreeting(userProfile, t);
      if (prev.length === 0) {
        return [
          {
            id: `welcome-${Date.now()}`,
            role: "assistant",
            content: greetingContent,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            specialty: selectedSpecialty,
            urgency: "none",
            suggestedSpecialist: null,
            reasonForReferral: null,
            followUpQuestions: t.chat.suggestionChips,
            isInitialGreeting: true,
          },
        ];
      }
      // If only the initial greeting is in the chat, keep it updated with current name/profile/language/specialty
      if (prev.length === 1 && prev[0].isInitialGreeting) {
        return [
          {
            ...prev[0],
            content: greetingContent,
            specialty: selectedSpecialty,
            followUpQuestions: t.chat.suggestionChips,
          },
        ];
      }
      return prev;
    });
  }, [
    isProfileComplete,
    hasClearedChatSession,
    userProfile,
    selectedSpecialty,
    t,
  ]);

  // Auto-scroll chat container to newest message
  useEffect(() => {
    const el = chatViewportRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [chatMessages, isChatLoading, prefersReducedMotion]);

  const scrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToSpecialistChat = () => {
    setIsMobileMenuOpen(false);
    specialistSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToProfileForm = () => {
    setIsMobileMenuOpen(false);
    if (profileSectionRef.current) {
      profileSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      workspaceRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    window.setTimeout(() => {
      const targetField =
        missingProfileFields[0] || localizedProfileRequiredFields[0];
      const inputEl = document.getElementById(targetField.inputId);
      if (inputEl) {
        inputEl.focus();
      }
    }, 350);
  };

  const handleStartNewChat = () => {
    setIsConfirmingClearChat(false);
    setHasClearedChatSession(false);
    setChatError(null);
    setLastFailedUserMessage(null);
    setChatLanguageChangedNotice(null);
    setChatInput("");
    if (isProfileComplete) {
      setChatMessages([
        {
          id: `welcome-${Date.now()}`,
          role: "assistant",
          content: buildFirstBotGreeting(userProfile, t),
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          specialty: selectedSpecialty,
          urgency: "none",
          suggestedSpecialist: null,
          reasonForReferral: null,
          followUpQuestions: t.chat.suggestionChips,
          isInitialGreeting: true,
        },
      ]);
    } else {
      setChatMessages([]);
    }
  };

  const handleConfirmClearChat = () => {
    setHasClearedChatSession(true);
    setIsConfirmingClearChat(false);
    setChatMessages([]);
    setChatError(null);
    setLastFailedUserMessage(null);
    setChatLanguageChangedNotice(null);
    setChatInput("");
  };

  const sendSpecialistChatRequest = async (
    historyToSend: SpecialistChatMessage[]
  ) => {
    setIsChatLoading(true);
    setChatError(null);

    try {
      const payloadMessages = historyToSend.slice(-12).map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const currentMeta =
        LANGUAGE_META_MAP[languageCode] || LANGUAGE_META_MAP.en;

      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile: {
            name: userProfile.name.trim(),
            age: userProfile.age.trim(),
            sex: userProfile.sex.trim(),
            bloodType: userProfile.bloodType.trim(),
            diabetesStatus: userProfile.sugar.trim(),
            allergies: userProfile.allergy.trim(),
            bloodPressureAndFluidConditions: userProfile.bloodPressure.trim(),
            existingConditions: userProfile.existingConditions.trim(),
            height: userProfile.height.trim(),
            weight: userProfile.weight.trim(),
            otherDetails: userProfile.otherDetails.trim(),
          },
          specialty: selectedSpecialty,
          languageCode,
          language: currentMeta.englishName,
          messages: payloadMessages,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data) {
        throw new Error(
          data?.error ||
            "We couldn't reach your specialist guide right now. Please take a breath and tap Retry."
        );
      }

      const botMsg: SpecialistChatMessage = {
        id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        role: "assistant",
        content:
          typeof data.reply === "string" && data.reply.trim()
            ? data.reply.trim()
            : "I'm listening. Could you share a little more about how long this has been happening?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        specialty: selectedSpecialty,
        urgency: (data.urgency as ChatUrgency) || "routine",
        suggestedSpecialist: data.suggestedSpecialist || null,
        reasonForReferral: data.reasonForReferral || null,
        followUpQuestions: Array.isArray(data.followUpQuestions)
          ? data.followUpQuestions
          : [],
      };

      setChatMessages((prev) => [...prev, botMsg]);
      setLastFailedUserMessage(null);
    } catch (err: any) {
      setChatError(
        err?.message ||
          "Something paused while connecting to your specialist guide. Please tap Retry."
      );
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSendChatMessage = async (overrideText?: string) => {
    if (!isProfileComplete || isChatLoading) return;
    const rawText = typeof overrideText === "string" ? overrideText : chatInput;
    const trimmed = rawText.trim();
    if (!trimmed) return;

    if (trimmed.length > 1000) {
      setChatError(t.errors.messageTooLong);
      return;
    }

    setHasSeenChatConsent(true);
    setHasClearedChatSession(false);
    setIsConfirmingClearChat(false);
    setChatError(null);

    const userMsg: SpecialistChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const nextMessages = [...chatMessages, userMsg];
    setChatMessages(nextMessages);
    if (typeof overrideText !== "string") {
      setChatInput("");
    }
    setLastFailedUserMessage(trimmed);

    await sendSpecialistChatRequest(nextMessages);
  };

  const handleRetryLastChatMessage = async () => {
    if (isChatLoading || chatMessages.length === 0) return;
    setChatError(null);
    await sendSpecialistChatRequest(chatMessages);
  };

  const handleCopyDoctorSummary = async () => {
    const userTurns = chatMessages.filter((m) => m.role === "user");
    const botTurns = chatMessages.filter(
      (m) => m.role === "assistant" && !m.isInitialGreeting
    );
    const latestBotWithReferral = [...botTurns]
      .reverse()
      .find((m) => m.urgency && m.urgency !== "none");

    const localizedSpecialtyLabel =
      t.chat.specialists[selectedSpecialty]?.label || selectedSpecialty;
    const referralUrgencyKey =
      latestBotWithReferral?.urgency &&
      latestBotWithReferral.urgency !== "none"
        ? latestBotWithReferral.urgency
        : "routine";
    const summaryLines = [
      t.chat.doctorSummaryHeader,
      `${t.chat.doctorSummaryPreparedOn}: ${new Date().toLocaleDateString()} · ${localizedSpecialtyLabel}`,
      "",
      `1. ${t.chat.doctorSummaryProfileSection}:`,
      `• ${t.profile.nameLabel}: ${userProfile.name.trim()} (${userProfile.age.trim()}, ${userProfile.sex.trim()}, ${t.profile.bloodTypeLabel}: ${userProfile.bloodType.trim()})`,
      `• ${t.profile.sugarLabel}: ${userProfile.sugar.trim()}`,
      `• ${t.profile.allergyLabel}: ${userProfile.allergy.trim()}`,
      `• ${t.profile.bpLabel}: ${userProfile.bloodPressure.trim()}`,
      `• ${t.profile.conditionsLabel}: ${userProfile.existingConditions.trim()}`,
      `• ${t.profile.heightLabel} / ${t.profile.weightLabel}: ${userProfile.height.trim()} · ${userProfile.weight.trim()}`,
      `• ${t.profile.otherLabel}: ${userProfile.otherDetails.trim()}`,
      "",
      `2. ${t.chat.doctorSummarySymptomsSection}:`,
      ...(userTurns.length > 0
        ? userTurns.map((m, idx) => `• [${idx + 1}] ${m.content}`)
        : [`• ${t.chat.doctorSummaryNoSymptoms}`]),
      "",
      ...(latestBotWithReferral
        ? [
            `3. ${t.chat.doctorSummaryGuideNoteSection}:`,
            `• ${t.chat.urgencyLabels[referralUrgencyKey]}`,
            ...(latestBotWithReferral.suggestedSpecialist
              ? [
                  `• ${t.chat.suggestedSpecialistPrefix}: ${latestBotWithReferral.suggestedSpecialist}`,
                ]
              : []),
            ...(latestBotWithReferral.reasonForReferral
              ? [`• ${latestBotWithReferral.reasonForReferral}`]
              : []),
            "",
          ]
        : []),
      ...(botTurns.length > 0
        ? [
            `4. ${t.chat.doctorSummaryLatestDiscussion}:`,
            botTurns[botTurns.length - 1].content,
            "",
          ]
        : []),
      `5. ${t.chat.doctorSummaryQuestionsSection}:`,
      ...t.chat.doctorSummaryDefaultQuestions.map((q) => `• ${q}`),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summaryLines);
      setCopiedChatSummary(true);
      window.setTimeout(() => setCopiedChatSummary(false), 2200);
    } catch {
      const el = document.createElement("textarea");
      el.value = summaryLines;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopiedChatSummary(true);
      window.setTimeout(() => setCopiedChatSummary(false), 2200);
    }
  };

  const hasEmergencyInChat = chatMessages.some(
    (m) => m.role === "assistant" && m.urgency === "emergency"
  );

  const runAnalysis = async (
    overrideMode?: TabType,
    overrideText?: string
  ) => {
    setErrorMessage(null);
    const targetMode = overrideMode ?? activeTab;
    const targetText = overrideText ?? inputText;

    if (targetMode === "upload") {
      if (!uploadedFile) {
        setErrorMessage(
          "Please select a photo or PDF of your lab report or prescription before continuing."
        );
        return;
      }
    } else {
      if (!targetText.trim()) {
        setErrorMessage(
          targetMode === "prescription"
            ? "Please paste the medicine names and instructions from your prescription first, or click 'Try a sample prescription'."
            : "Please paste the lines from your lab report first, or click 'Try a sample report' to see an example."
        );
        return;
      }
    }

    setIsLoading(true);

    try {
      const profilePromptContext = buildProfilePromptContext(userProfile);
      const trimmedTextWithProfile =
        targetMode !== "upload" && profilePromptContext
          ? `${targetText.trim()}\n\n[${profilePromptContext}]`
          : targetText;

      const currentMeta =
        LANGUAGE_META_MAP[languageCode] || LANGUAGE_META_MAP.en;

      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: targetMode,
          text:
            targetMode === "upload"
              ? targetText.trim()
                ? profilePromptContext
                  ? `${targetText.trim()}\n\n[${profilePromptContext}]`
                  : targetText.trim()
                : profilePromptContext
              : trimmedTextWithProfile,
          file:
            targetMode === "upload" && uploadedFile
              ? {
                  base64: uploadedFile.base64,
                  mimeType: uploadedFile.mimeType,
                  name: uploadedFile.name,
                }
              : undefined,
          languageCode,
          language: currentMeta.englishName,
          userProfile: {
            name: userProfile.name.trim(),
            age: userProfile.age.trim(),
            sex: userProfile.sex.trim(),
            bloodType: userProfile.bloodType.trim(),
            sugar: userProfile.sugar.trim(),
            allergy: userProfile.allergy.trim(),
            bloodPressure: userProfile.bloodPressure.trim(),
            existingConditions: userProfile.existingConditions.trim(),
            height: userProfile.height.trim(),
            weight: userProfile.weight.trim(),
            otherDetails: userProfile.otherDetails.trim(),
          },
          profilePromptContext,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data) {
        throw new Error(
          data?.error ||
            "We ran into a quiet hiccup while reading your document. Please try again."
        );
      }

      const analyzedResult = data as AnalysisResult;
      setResult(analyzedResult);
      setCheckedQuestionIndices({});
      setItemStatusFilter("all");

      // Build human-friendly title for the Session History card
      const itemNames = (analyzedResult.items || [])
        .map((it) => it.name)
        .filter(Boolean);
      const computedTitle =
        targetMode === "upload" && uploadedFile?.name
          ? uploadedFile.name
          : itemNames.length > 2
          ? `${itemNames.slice(0, 2).join(", ")} + ${itemNames.length - 2} more`
          : itemNames.length > 0
          ? itemNames.join(", ")
          : targetMode === "prescription"
          ? t.workspace.tabPrescription
          : t.workspace.tabLab;

      const newEntry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        mode: targetMode,
        language: currentMeta.englishName,
        languageCode,
        title: computedTitle,
        result: analyzedResult,
        userProfile: hasActiveUserProfile
          ? {
              name: userProfile.name.trim(),
              age: userProfile.age.trim(),
              sex: userProfile.sex.trim(),
              bloodType: userProfile.bloodType.trim(),
              sugar: userProfile.sugar.trim(),
              allergy: userProfile.allergy.trim(),
              bloodPressure: userProfile.bloodPressure.trim(),
              existingConditions: userProfile.existingConditions.trim(),
              height: userProfile.height.trim(),
              weight: userProfile.weight.trim(),
              otherDetails: userProfile.otherDetails.trim(),
            }
          : undefined,
      };

      setActiveHistoryId(newEntry.id);
      setSessionHistory((prev) => {
        const next = [newEntry, ...prev].slice(0, 3);
        try {
          // Do not persist session-only userProfile to localStorage
          const storageSafeNext = next.map(({ userProfile: _up, ...rest }) => rest);
          window.localStorage.setItem(
            SESSION_HISTORY_STORAGE_KEY,
            JSON.stringify(storageSafeNext)
          );
        } catch {
          // Ignore storage quota errors
        }
        return next;
      });

      window.setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          "We couldn't complete the explanation right now. Please check your input and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryEntry = (entry: HistoryEntry) => {
    setErrorMessage(null);
    setActiveHistoryId(entry.id);
    const resolvedCode =
      entry.languageCode || normalizeLanguageCode(entry.language);
    void handleLanguageChange(resolvedCode);
    setResult(entry.result);
    setCheckedQuestionIndices({});
    setItemStatusFilter("all");
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  const handleClearHistory = () => {
    setSessionHistory([]);
    setActiveHistoryId(null);
    setHistorySearchQuery("");
    try {
      window.localStorage.removeItem(SESSION_HISTORY_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  const filteredHistory = sessionHistory.filter((entry) => {
    const q = historySearchQuery.trim().toLowerCase();
    if (!q) return true;
    const itemText = (entry.result.items || [])
      .map(
        (it) =>
          `${it.name} ${it.value} ${it.unit} ${it.explanation} ${it.usage || ""}`
      )
      .join(" ");
    const searchable = `${entry.title} ${entry.mode} ${entry.language} ${entry.timestamp} ${entry.result.summary} ${itemText}`.toLowerCase();
    return searchable.includes(q);
  });

  const handleLoadSampleReport = (kind: "lab" | "prescription" = "lab") => {
    setErrorMessage(null);
    setUploadedFile(null);
    const sampleText =
      kind === "prescription" ? SAMPLE_PRESCRIPTION : SAMPLE_LAB_REPORT;
    setActiveTab(kind);
    setInputText(sampleText);
    workspaceRef.current?.scrollIntoView({ behavior: "smooth" });
    void runAnalysis(kind, sampleText);
  };

  const handleFileSelection = (file: File | undefined) => {
    if (!file) return;
    setErrorMessage(null);

    const maxBytes = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxBytes) {
      setErrorMessage(
        "That file is over 10 MB. Please choose a smaller photo or a compressed PDF so we can read it smoothly."
      );
      return;
    }

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      setErrorMessage(
        "Please upload a clear photo (JPG, PNG, WebP) or a PDF document."
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1] || "";
      setUploadedFile({
        name: file.name,
        size: file.size,
        mimeType: file.type,
        base64,
        previewUrl: file.type.startsWith("image/") ? dataUrl : undefined,
      });
    };
    reader.onerror = () => {
      setErrorMessage(
        "We couldn't read that file from your device. Please try selecting it again."
      );
    };
    reader.readAsDataURL(file);
  };

  const stopMediaRecorder = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const stopVoiceDictation = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.onend = null;
        speechRecognitionRef.current.stop();
      } catch {
        // Ignore stop errors
      }
      speechRecognitionRef.current = null;
    }
    stopMediaRecorder();
    setIsDictating(false);
    setInterimTranscript("");
  };

  useEffect(() => {
    return () => {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch {
          // Ignore
        }
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startMediaRecorderFallback = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage(
          "Voice dictation is not supported in this browser. Please type or paste your report text."
        );
        setIsDictating(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const mimeType = recorder.mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        audioChunksRef.current = [];

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
          mediaStreamRef.current = null;
        }

        if (audioBlob.size < 200) {
          setIsDictating(false);
          return;
        }

        setIsTranscribingAudio(true);
        try {
          const base64Audio = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const dataUrl = reader.result as string;
              resolve(dataUrl.split(",")[1] || "");
            };
            reader.onerror = () => reject(new Error("Failed to read audio"));
            reader.readAsDataURL(audioBlob);
          });

          const currentMeta =
            LANGUAGE_META_MAP[languageCode] || LANGUAGE_META_MAP.en;

          const res = await fetch(`${API_BASE}/api/transcribe`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              audioBase64: base64Audio,
              mimeType,
              languageCode,
              language: currentMeta.englishName,
            }),
          });

          const data = await res.json().catch(() => null);
          if (!res.ok || !data?.transcript) {
            throw new Error(
              data?.error || "We couldn't transcribe that audio clearly."
            );
          }

          setInputText((prev) => {
            const trimmed = prev.trim();
            return trimmed
              ? `${trimmed}\n${data.transcript.trim()}`
              : data.transcript.trim();
          });
        } catch (err: any) {
          setErrorMessage(
            err?.message ||
              "We couldn't transcribe your voice recording clearly. Please try again."
          );
        } finally {
          setIsTranscribingAudio(false);
          setIsDictating(false);
        }
      };

      recorder.start();
      setIsDictating(true);
    } catch {
      setIsDictating(false);
      setErrorMessage(
        "Microphone access was denied or unavailable. Please allow microphone permissions in your browser to dictate your report."
      );
    }
  };

  const handleToggleVoiceDictation = () => {
    setErrorMessage(null);

    if (isDictating) {
      stopVoiceDictation();
      return;
    }

    const SpeechRecognitionApi =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionApi) {
      void startMediaRecorderFallback();
      return;
    }

    try {
      const recognition = new SpeechRecognitionApi();
      speechRecognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang =
        LANGUAGE_META_MAP[languageCode]?.speechLang || "en-IN";

      recognition.onstart = () => {
        setIsDictating(true);
        setInterimTranscript("");
      };

      recognition.onresult = (event: any) => {
        let finalChunk = "";
        let interimChunk = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0]?.transcript || "";
          if (event.results[i].isFinal) {
            finalChunk += transcriptPiece + " ";
          } else {
            interimChunk += transcriptPiece;
          }
        }

        if (finalChunk.trim()) {
          const cleaned = finalChunk.trim();
          setInputText((prev) => {
            if (!prev) return cleaned;
            const needsSpace = !prev.endsWith(" ") && !prev.endsWith("\n");
            return `${prev}${needsSpace ? " " : ""}${cleaned}`;
          });
        }

        setInterimTranscript(interimChunk);
      };

      recognition.onerror = (event: any) => {
        const errCode = event?.error;
        if (errCode === "not-allowed" || errCode === "permission-denied") {
          setErrorMessage(
            "Microphone permission was blocked. Please allow microphone access in your browser address bar to dictate by voice."
          );
          stopVoiceDictation();
        } else if (errCode === "network" || errCode === "service-not-allowed") {
          speechRecognitionRef.current = null;
          setInterimTranscript("");
          void startMediaRecorderFallback();
        } else if (errCode !== "no-speech" && errCode !== "aborted") {
          setErrorMessage(
            "Voice dictation paused unexpectedly. You can tap 'Dictate by voice' to continue speaking."
          );
          stopVoiceDictation();
        }
      };

      recognition.onend = () => {
        setIsDictating(false);
        setInterimTranscript("");
        speechRecognitionRef.current = null;
      };

      recognition.start();
    } catch {
      void startMediaRecorderFallback();
    }
  };

  const handleAnalyze = async () => {
    if (isDictating) {
      stopVoiceDictation();
    }
    await runAnalysis();
  };

  // Copy button morphs to checkmark with "Copied" for 2 seconds
  const handleCopyQuestions = async () => {
    if (!result?.doctorQuestions?.length) return;
    const formatted = [
      `${t.results.questionsForDoctorTitle} (Arogya Mitra):`,
      ...result.doctorQuestions.map((q, idx) => `${idx + 1}. ${q}`),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedQuestions(true);
      window.setTimeout(() => setCopiedQuestions(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = formatted;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopiedQuestions(true);
      window.setTimeout(() => setCopiedQuestions(false), 2000);
    }
  };

  const [downloadedPdfSuccess, setDownloadedPdfSuccess] = useState(false);

  const handlePrintOrSavePdf = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!result) return;
    const { generateReportPdf } = await import("./utils/generateReportPdf");
    generateReportPdf({
      result,
      t,
      languageName: LANGUAGE_META_MAP[languageCode]?.nativeName || "English",
      profileParts: getActiveProfileSummaryParts(userProfile),
      patientName: userProfile.name,
      checkedQuestionIndices,
    });
    setDownloadedPdfSuccess(true);
    window.setTimeout(() => setDownloadedPdfSuccess(false), 2200);
  };

  const handleShareResults = async () => {
    if (!result) return;
    const attentionItems = (result.items || []).filter(
      (it) => it.status !== "normal"
    );
    const profileHeaderParts = getActiveProfileSummaryParts(userProfile);
    const lines = [
      `Arogya Mitra — ${t.results.reassuranceHeaderDefault}`,
      ...(profileHeaderParts.length > 0 ? [profileHeaderParts.join(" · ")] : []),
      "",
      result.summary,
      ...(attentionItems.length > 0
        ? [
            "",
            `${t.results.filterOutsideRange}:`,
            ...attentionItems.map(
              (it) =>
                `• ${it.name}${it.value ? `: ${it.value} ${it.unit || ""}` : ""} — ${it.explanation}`
            ),
          ]
        : []),
      ...(result.doctorQuestions?.length
        ? [
            "",
            `${t.results.questionsForDoctorTitle}:`,
            ...result.doctorQuestions.map((q, idx) => `${idx + 1}. ${q}`),
          ]
        : []),
    ].join("\n");

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: `Arogya Mitra — ${t.results.reassuranceHeaderDefault}`,
          text: lines,
        });
        setSharedSummarySuccess(true);
        window.setTimeout(() => setSharedSummarySuccess(false), 2200);
        return;
      } catch (err: any) {
        if (err?.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(lines);
      setSharedSummarySuccess(true);
      window.setTimeout(() => setSharedSummarySuccess(false), 2200);
    } catch {
      const el = document.createElement("textarea");
      el.value = lines;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setSharedSummarySuccess(true);
      window.setTimeout(() => setSharedSummarySuccess(false), 2200);
    }
  };

  const handleQuickCameraCapture = () => {
    setErrorMessage(null);
    setActiveTab("upload");
    setIsMobileMenuOpen(false);
    workspaceRef.current?.scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => {
      cameraInputRef.current?.click();
    }, 180);
  };

  const toggleDoctorQuestionCheck = (idx: number) => {
    setCheckedQuestionIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const scoreValue =
    typeof result?.confidenceScore === "number"
      ? Math.max(0, Math.min(100, Math.round(result.confidenceScore)))
      : 96;
  const confidenceMeta = getConfidenceBadge(scoreValue, t);
  const ConfidenceIcon = confidenceMeta.Icon;

  const TAB_DEFINITIONS: Array<{
    id: TabType;
    label: string;
    mobileLabel: string;
    Icon: typeof FileText;
  }> = [
    {
      id: "lab",
      label: t.workspace.tabLab,
      mobileLabel: t.workspace.tabLabMobile,
      Icon: FileText,
    },
    {
      id: "prescription",
      label: t.workspace.tabPrescription,
      mobileLabel: t.workspace.tabPrescriptionMobile,
      Icon: Pill,
    },
    {
      id: "upload",
      label: t.workspace.tabUpload,
      mobileLabel: t.workspace.tabUploadMobile,
      Icon: UploadCloud,
    },
  ];

  return (
    <div
      className={`min-h-screen paper-grain flex flex-col selection:bg-[#DCE8E2] selection:text-[#1F4E4A] dark:selection:bg-[#23453F] dark:selection:text-[#E5F2EE] ${
        textScale === "comfortable" ? "text-[18.5px]" : ""
      }`}
    >
      {/* Top Bar: Quiet, warm wellness clinic header */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/85 dark:bg-[#111C1A]/85 backdrop-blur-md border-b border-[#E6DFD2] dark:border-[#263D38] no-print transition-colors">
        <div className="max-w-6xl mx-auto px-3 sm:px-8 h-18 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          <motion.a
            href="#"
            initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: CALM_EASE }}
            whileHover={prefersReducedMotion ? undefined : "hover"}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            className="group inline-flex items-center gap-2.5 sm:gap-3.5 min-w-0 shrink rounded-full py-1.5 pr-1 sm:pr-3 focus:outline-none"
            aria-label="Arogya Mitra — Calm Health Companion, back to top"
          >
            {/* Bespoke Animated Brand Emblem: Sanctuary Ring + Healing Leaf + Terracotta Vitality Spark */}
            <span className="relative flex items-center justify-center w-11 h-11 shrink-0">
              {/* Soft breathing outer aura */}
              <motion.span
                aria-hidden="true"
                animate={
                  prefersReducedMotion
                    ? { scale: 1, opacity: 0.35 }
                    : { scale: [1, 1.18, 1], opacity: [0.3, 0.65, 0.3] }
                }
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute inset-0 rounded-full
                  bg-gradient-to-tr from-[#DCE8E2] via-[#5E9C84]/25 to-[#C8694A]/20
                  dark:from-[#1B332E] dark:via-[#8CE0C0]/20 dark:to-[#C8694A]/25
                  blur-[2px]
                "
              />

              {/* Rotating subtle botanical orbit ring */}
              <motion.svg
                aria-hidden="true"
                viewBox="0 0 44 44"
                className="absolute inset-0 w-full h-full text-[#1F4E4A]/25 dark:text-[#8CE0C0]/25"
                animate={
                  prefersReducedMotion ? { rotate: 0 } : { rotate: 360 }
                }
                transition={{
                  duration: 28,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <circle
                  cx="22"
                  cy="22"
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                  strokeLinecap="round"
                />
              </motion.svg>

              {/* Main circular badge */}
              <motion.span
                aria-hidden="true"
                variants={{
                  hover: {
                    scale: 1.08,
                    rotate: -5,
                    transition: { type: "spring", stiffness: 320, damping: 16 },
                  },
                }}
                animate={
                  prefersReducedMotion
                    ? { y: 0, rotate: 0 }
                    : { y: [0, -1.8, 0], rotate: [-2.5, 2.5, -2.5] }
                }
                transition={{
                  duration: 5.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  relative z-10 w-9.5 h-9.5 rounded-full
                  bg-[#DCE8E2] dark:bg-[#1B332E]
                  border border-[#1F4E4A]/20 dark:border-[#8CE0C0]/25
                  shadow-[0_6px_18px_-4px_rgba(31,78,74,0.18)]
                  flex items-center justify-center
                  text-[#1F4E4A] dark:text-[#8CE0C0]
                  transition-colors duration-300
                  group-hover:border-[#C8694A]/45
                "
              >
                <svg
                  viewBox="0 0 28 28"
                  fill="none"
                  className="w-6 h-6 overflow-visible"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Warm cradling sanctuary arc at the base */}
                  <motion.path
                    d="M6.5 18.5C8.3 21.8 11.2 23.5 14 23.5C16.8 23.5 19.7 21.8 21.5 18.5"
                    stroke="currentColor"
                    strokeOpacity="0.45"
                    strokeWidth="1.35"
                    initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.1, delay: 0.15, ease: CALM_EASE }}
                  />

                  {/* Primary botanical healing leaf silhouette */}
                  <motion.path
                    d="M14 4.8C9.2 8.8 7.8 13.6 9.4 17.7C10.7 20.9 14 22.4 14 22.4C14 22.4 17.3 20.9 18.6 17.7C20.2 13.6 18.8 8.8 14 4.8Z"
                    fill="currentColor"
                    fillOpacity="0.12"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="origin-center"
                    initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
                    animate={
                      prefersReducedMotion
                        ? { pathLength: 1, opacity: 1 }
                        : {
                            pathLength: 1,
                            opacity: 1,
                            scale: [1, 1.03, 1],
                          }
                    }
                    transition={{
                      pathLength: { duration: 1.25, ease: CALM_EASE },
                      opacity: { duration: 0.6 },
                      scale: {
                        duration: 4.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  />

                  {/* Central lifeline stem */}
                  <motion.path
                    d="M14 22.2V10.6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    initial={prefersReducedMotion ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, delay: 0.45, ease: CALM_EASE }}
                  />

                  {/* Left & right organic leaf veins */}
                  <motion.path
                    d="M11.1 15.1C12.1 16 13.1 16.5 14 16.9M16.9 13.8C15.9 14.7 14.9 15.3 14 15.7"
                    stroke="currentColor"
                    strokeWidth="1.35"
                    initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7, ease: CALM_EASE }}
                  />

                  {/* Terracotta vitality spark at the crown of the leaf */}
                  <motion.circle
                    cx="14"
                    cy="3.3"
                    r="1.65"
                    fill="#C8694A"
                    stroke="none"
                    className="origin-center"
                    animate={
                      prefersReducedMotion
                        ? { scale: 1, opacity: 0.95 }
                        : {
                            scale: [1, 1.32, 1],
                            opacity: [0.75, 1, 0.75],
                          }
                    }
                    transition={{
                      duration: 3.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </svg>
              </motion.span>
            </span>

            {/* Animated Brand Wordmark & Calm Subtitle (Live Continuous Motion) */}
            <motion.span
              animate={
                prefersReducedMotion
                  ? { y: 0 }
                  : { y: [0, -1.2, 0] }
              }
              transition={{
                duration: 5.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative flex flex-col leading-none"
            >
              <span className="inline-flex items-baseline gap-1.5 font-serif text-2xl font-medium tracking-tight text-[#1F4E4A] dark:text-[#8CE0C0]">
                <motion.span
                  animate={
                    prefersReducedMotion
                      ? { y: 0, scale: 1 }
                      : { y: [0, -1.5, 0], scale: [1, 1.02, 1] }
                  }
                  transition={{
                    duration: 4.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  variants={{
                    hover: { y: -2, transition: { duration: 0.25, ease: CALM_EASE } },
                  }}
                  className="inline-block origin-bottom"
                >
                  Arogya
                </motion.span>

                <motion.span
                  animate={
                    prefersReducedMotion
                      ? { y: 0, rotate: 0, opacity: 0.95 }
                      : {
                          y: [0, -2, 0],
                          rotate: [0, -1.2, 0],
                          opacity: [0.84, 1, 0.84],
                        }
                  }
                  transition={{
                    duration: 4.4,
                     delay: 0.45,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  variants={{
                    hover: { y: -2, x: 1, transition: { duration: 0.25, delay: 0.04, ease: CALM_EASE } },
                  }}
                  className="relative italic font-normal text-[#1F4E4A]/95 dark:text-[#8CE0C0]/95 inline-block origin-bottom"
                >
                  Mitra
                  {/* Live breathing hand-drawn terracotta curve under Mitra */}
                  <motion.svg
                    aria-hidden="true"
                    viewBox="0 0 56 6"
                    fill="none"
                    className="absolute -bottom-1 left-0 w-full h-1.5 text-[#C8694A]/75 dark:text-[#E2876B]/80 overflow-visible"
                  >
                    <motion.path
                      d="M2 4.2C15 1.4 39 1.4 54 3.8"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      animate={
                        prefersReducedMotion
                          ? { pathLength: 1, opacity: 0.7 }
                          : {
                              pathLength: [0.3, 1, 0.3],
                              opacity: [0.4, 0.95, 0.4],
                            }
                      }
                      transition={{
                        duration: 4.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.svg>
                </motion.span>

                {/* Living heartbeat dot with expanding ripple ring */}
                <span aria-hidden="true" className="relative inline-flex items-center justify-center w-2.5 h-2.5 mb-0.5">
                  <motion.span
                    animate={
                      prefersReducedMotion
                        ? { scale: 1, opacity: 0 }
                        : { scale: [1, 2.3, 1], opacity: [0.65, 0, 0.65] }
                    }
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    className="absolute inset-0 rounded-full bg-[#C8694A]/45"
                  />
                  <motion.span
                    animate={
                      prefersReducedMotion
                        ? { scale: 1, opacity: 0.9 }
                        : { scale: [1, 1.3, 1], opacity: [0.75, 1, 0.75] }
                    }
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative w-1.5 h-1.5 rounded-full bg-[#C8694A]"
                  />
                </span>
              </span>

              {/* Live animated subtitle with calm lifeline wave */}
              <motion.span
                animate={
                  prefersReducedMotion
                    ? { opacity: 0.9 }
                    : { opacity: [0.72, 1, 0.72], x: [0, 1.2, 0] }
                }
                transition={{
                  duration: 5.2,
                  delay: 0.25,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-[#5B6B67] dark:text-[#9EB0AC] font-medium mt-1 transition-colors group-hover:text-[#C8694A] dark:group-hover:text-[#E2876B]"
              >
                <motion.svg
                  aria-hidden="true"
                  viewBox="0 0 22 8"
                  fill="none"
                  className="w-4 h-2 text-[#5E9C84] dark:text-[#8CE0C0] shrink-0"
                >
                  <motion.path
                    d="M1 4H6L8.2 1.3L11.2 6.7L13.5 3.2L15 4H21"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={
                      prefersReducedMotion
                        ? { pathLength: 1, opacity: 0.8 }
                        : { pathLength: [0.2, 1, 0.2], opacity: [0.45, 1, 0.45] }
                    }
                    transition={{
                      duration: 3.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.svg>
                <span className="truncate max-w-[115px] sm:max-w-[180px]">{t.nav.brandSubtitle}</span>
              </motion.span>
            </motion.span>
          </motion.a>

          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-4 xl:gap-6 text-[14px] xl:text-[15px] font-medium text-[#5B6B67] dark:text-[#9EB0AC] min-w-0"
          >
            <a
              href="#workspace"
              className="hover:text-[#1F4E4A] dark:hover:text-[#8CE0C0] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.explainReport}
            </a>
            <a
              href="#ask-specialist"
              className="inline-flex items-center gap-1.5 text-[#1F4E4A] dark:text-[#8CE0C0] hover:text-[#C8694A] dark:hover:text-[#E2876B] transition-colors whitespace-nowrap shrink-0"
            >
              <Stethoscope className="w-4 h-4 text-[#C8694A] shrink-0" strokeWidth={1.5} />
              <span>{t.nav.askSpecialist}</span>
            </a>
            <button
              type="button"
              onClick={() => handleLoadSampleReport("lab")}
              className="hover:text-[#1F4E4A] dark:hover:text-[#8CE0C0] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.nav.sampleReport}
            </button>
            <a
              href="#how-it-works"
              className="hover:text-[#1F4E4A] dark:hover:text-[#8CE0C0] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.howItWorks}
            </a>
            <a
              href="#faq"
              className="hover:text-[#1F4E4A] dark:hover:text-[#8CE0C0] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.faq}
            </a>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
            <LanguageSelector
              id="header-language-selector"
              value={languageCode}
              onChange={(code) => void handleLanguageChange(code)}
              t={t}
              compact
            />

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              aria-label={t.nav.settings}
              className="btn-calm-lift inline-flex items-center justify-center gap-2 min-h-[40px] sm:min-h-[42px] px-2.5 sm:px-4 py-2 text-[13.5px] sm:text-[14px] font-medium text-[#1F4E4A] dark:text-[#EAE6DF] bg-white/80 dark:bg-[#1B332E] border border-[#E6DFD2] dark:border-[#2C4943] rounded-full cursor-pointer whitespace-nowrap shrink-0"
            >
              <Settings className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              <span className="hidden sm:inline">{t.nav.settings}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="lg:hidden btn-calm-lift inline-flex items-center justify-center w-10 h-10 text-[#1F4E4A] dark:text-[#EAE6DF] bg-white/80 dark:bg-[#1B332E] border border-[#E6DFD2] dark:border-[#2C4943] rounded-full cursor-pointer shrink-0"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Collapsible Navigation & Quick Preferences Sheet */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-nav-drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: CALM_EASE }}
              className="lg:hidden overflow-hidden border-t border-[#E6DFD2] dark:border-[#263D38] bg-[#FAF7F2]/95 dark:bg-[#111C1A]/95 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-4">
                <nav
                  aria-label="Mobile navigation"
                  className="grid grid-cols-2 gap-2 text-sm font-medium"
                >
                  <a
                    href="#workspace"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#263D38] text-[#1E2A28] dark:text-[#EAE6DF] min-w-0"
                  >
                    <FileText className="w-4 h-4 text-[#1F4E4A] dark:text-[#8CE0C0] shrink-0" strokeWidth={1.5} />
                    <span className="min-w-0 break-words">{t.nav.explainReport}</span>
                  </a>
                  <a
                    href="#ask-specialist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#DCE8E2]/65 dark:bg-[#1B332E] border border-[#1F4E4A]/15 dark:border-[#8CE0C0]/25 text-[#1F4E4A] dark:text-[#8CE0C0] min-w-0"
                  >
                    <Stethoscope className="w-4 h-4 text-[#C8694A] shrink-0" strokeWidth={1.5} />
                    <span className="min-w-0 break-words">{t.nav.askSpecialist}</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleQuickCameraCapture}
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#263D38] text-[#1E2A28] dark:text-[#EAE6DF] text-left cursor-pointer min-w-0"
                  >
                    <Camera className="w-4 h-4 text-[#1F4E4A] dark:text-[#8CE0C0] shrink-0" strokeWidth={1.5} />
                    <span className="min-w-0 break-words">{t.nav.snapPhoto}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLoadSampleReport("lab");
                    }}
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#263D38] text-[#1E2A28] dark:text-[#EAE6DF] text-left cursor-pointer min-w-0"
                  >
                    <Sparkles className="w-4 h-4 text-[#C8694A] shrink-0" strokeWidth={1.5} />
                    <span className="min-w-0 break-words">{t.nav.sampleReport}</span>
                  </button>
                  <a
                    href="#how-it-works"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#263D38] text-[#1E2A28] dark:text-[#EAE6DF] min-w-0"
                  >
                    <HeartHandshake className="w-4 h-4 text-[#C8694A] shrink-0" strokeWidth={1.5} />
                    <span className="min-w-0 break-words">{t.nav.howItWorks}</span>
                  </a>
                  <a
                    href="#faq"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#263D38] text-[#1E2A28] dark:text-[#EAE6DF] min-w-0"
                  >
                    <HelpCircle className="w-4 h-4 text-[#1F4E4A] dark:text-[#8CE0C0] shrink-0" strokeWidth={1.5} />
                    <span className="min-w-0 break-words">{t.nav.commonQA}</span>
                  </a>
                </nav>

                {/* Quick Mobile Language & Theme Switcher Row */}
                <div className="pt-3 border-t border-[#E6DFD2] dark:border-[#263D38] flex flex-wrap items-center justify-between gap-2">
                  <LanguageSelector
                    id="mobile-menu-language-selector"
                    value={languageCode}
                    onChange={(code) => void handleLanguageChange(code)}
                    t={t}
                    compact
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setThemeMode(themeMode === "light" ? "dark" : "light")
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#263D38] text-xs font-medium text-[#1E2A28] dark:text-[#EAE6DF] cursor-pointer"
                  >
                    {themeMode === "light" ? (
                      <>
                        <Moon className="w-3.5 h-3.5 text-[#1F4E4A]" strokeWidth={1.5} />
                        <span>{t.nav.quietDark}</span>
                      </>
                    ) : (
                      <>
                        <Sun className="w-3.5 h-3.5 text-[#D9A441]" strokeWidth={1.5} />
                        <span>{t.nav.warmIvory}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        {/* 1. Hero / Landing Section (Two-column on desktop, slight asymmetry, floating blob) */}
        <section className="relative overflow-hidden pt-10 pb-16 sm:pt-18 sm:pb-24 px-4 sm:px-8 no-print">
          {/* Soft, organic, imperfect blob shape behind the hero in sage (#DCE8E2) and a hint of terracotta (#C8694A) with very slow 20s floating movement */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    x: [0, 16, -10, 0],
                    y: [0, -18, 12, 0],
                    rotate: [0, 3, -2, 0],
                  }
            }
            transition={{
              opacity: { duration: 0.8, ease: CALM_EASE },
              x: { duration: 20, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 20, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 20, repeat: Infinity, ease: "easeInOut" },
            }}
            className="pointer-events-none absolute -top-14 right-[-10%] sm:right-[-4%] w-[360px] h-[360px] sm:w-[580px] sm:h-[580px] -z-10"
          >
            <svg viewBox="0 0 600 600" className="w-full h-full">
              <path
                fill="#DCE8E2"
                fillOpacity="0.72"
                d="M446.5,332.5Q416,425,326,456.5Q236,488,154.5,431Q73,374,82,272Q91,170,178,113.5Q265,57,364,102.5Q463,148,470,244Q477,340,446.5,332.5Z"
              />
              <path
                fill="#C8694A"
                fillOpacity="0.09"
                d="M398,354Q354,438,259,446Q164,454,119,368Q74,282,126,196Q178,110,275,112Q372,114,407,197Q442,280,398,354Z"
              />
            </svg>
          </motion.div>

          {/* Subtle floating botanical motes in background for calm depth */}
          {!prefersReducedMotion && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden -z-10"
            >
              <motion.span
                animate={{
                  y: [0, -22, 0],
                  x: [0, 12, 0],
                  opacity: [0.22, 0.48, 0.22],
                }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-16 left-[12%] w-3 h-3 rounded-full bg-[#5E9C84]/30 blur-[1px]"
              />
              <motion.span
                animate={{
                  y: [0, 18, 0],
                  x: [0, -14, 0],
                  opacity: [0.15, 0.38, 0.15],
                }}
                transition={{
                  duration: 11,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
                className="absolute bottom-14 left-[42%] w-4 h-4 rounded-full bg-[#C8694A]/20 blur-[1px]"
              />
              <motion.span
                animate={{
                  y: [0, -16, 0],
                  x: [0, -10, 0],
                  opacity: [0.2, 0.45, 0.2],
                }}
                transition={{
                  duration: 8.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
                className="absolute top-28 right-[32%] w-2.5 h-2.5 rounded-full bg-[#1F4E4A]/25"
              />
            </div>
          )}

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Hero Left Column: Staggered 100ms entrance */}
            <div className="lg:col-span-7 space-y-6 min-w-0">
              <motion.p
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0, ease: CALM_EASE }}
                className="text-xs sm:text-[13px] font-semibold uppercase tracking-[0.15em] text-[#1F4E4A] dark:text-[#8CE0C0] flex items-center gap-2.5"
              >
                <span className="relative flex h-2.5 w-2.5 items-center justify-center shrink-0">
                  {!prefersReducedMotion && (
                    <motion.span
                      animate={{ scale: [1, 2.1, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{
                        duration: 3.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inline-flex h-full w-full rounded-full bg-[#C8694A]"
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className="relative inline-block w-2 h-2 rounded-full bg-[#C8694A]"
                  />
                </span>
                <span>{t.hero.kicker}</span>
              </motion.p>

              <motion.h1
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05, ease: CALM_EASE }}
                className="font-serif text-3xl sm:text-5xl lg:text-[3.55rem] font-normal text-[#1E2A28] dark:text-[#EAE6DF] leading-[1.2] tracking-[-0.02em] max-w-2xl break-words"
              >
                <motion.span
                  initial={
                    prefersReducedMotion
                      ? false
                      : { opacity: 0, y: 12, scale: 1 }
                  }
                  animate={
                    prefersReducedMotion
                      ? { opacity: 1, y: 0, scale: 1 }
                      : {
                          opacity: 1,
                          y: 0,
                          scale: [1, 1.018, 1],
                        }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : {
                          opacity: { duration: 0.5, delay: 0.1, ease: CALM_EASE },
                          y: { duration: 0.5, delay: 0.1, ease: CALM_EASE },
                          scale: {
                            duration: 5.2,
                            delay: 0.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        }
                  }
                  className="inline-block origin-left"
                >
                  <motion.span
                    animate={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { opacity: [1, 0.88, 1] }
                    }
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : {
                            duration: 5.2,
                            delay: 0.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                    }
                  >
                    {t.hero.headlinePrefix}
                  </motion.span>
                </motion.span>{" "}
                <motion.span
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.22, ease: CALM_EASE }}
                  className={`relative inline-block text-[#1F4E4A] dark:text-[#8CE0C0] ${
                    languageCode === "en" ? "italic" : ""
                  }`}
                >
                  <motion.span
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.28, ease: CALM_EASE }}
                  >
                    {t.hero.headlineEmphasis}
                  </motion.span>
                  {/* Hand-drawn, slightly wobbly SVG underline that draws itself in on load */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 260 18"
                    fill="none"
                    preserveAspectRatio="none"
                    className="absolute -bottom-2 left-0 w-full h-4 text-[#C8694A]"
                  >
                    <motion.path
                      d="M4 12.5C44 6.5 92 14.2 142 8.4C185 3.8 222 11.2 256 7.5"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      initial={
                        prefersReducedMotion
                          ? { pathLength: 1, opacity: 1 }
                          : { pathLength: 0, opacity: 0.3 }
                      }
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.35,
                        ease: CALM_EASE,
                      }}
                    />
                  </svg>
                </motion.span>
              </motion.h1>

              <motion.p
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.2, ease: CALM_EASE }}
                className="text-base sm:text-[18px] text-[#5B6B67] dark:text-[#9EB0AC] leading-[1.7] max-w-xl"
              >
                {t.hero.subheadline}
              </motion.p>

              {/* Primary teal pill button + mobile camera quick action + quiet secondary text link */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.3, ease: CALM_EASE }}
                className="pt-2 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5 sm:gap-6"
              >
                <button
                  type="button"
                  onClick={scrollToWorkspace}
                  className="btn-primary-teal w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full font-medium text-[16px] cursor-pointer"
                >
                  <span>{t.hero.explainMyReportBtn}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                </button>

                <button
                  type="button"
                  onClick={handleQuickCameraCapture}
                  className="sm:hidden btn-calm-lift w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.25 rounded-full font-medium text-[15px] text-[#1F4E4A] dark:text-[#8CE0C0] bg-[#DCE8E2]/80 dark:bg-[#1B332E] border border-[#1F4E4A]/20 dark:border-[#8CE0C0]/25 cursor-pointer"
                >
                  <Camera className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  <span>{t.hero.snapPhotoMobileBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLoadSampleReport("lab")}
                  className="group inline-flex items-center justify-center sm:justify-start gap-2 text-[15.5px] font-medium text-[#1F4E4A] dark:text-[#8CE0C0] hover:text-[#C8694A] dark:hover:text-[#E07E5E] transition-colors cursor-pointer py-2"
                >
                  <span className="underline decoration-[#1F4E4A]/35 group-hover:decoration-[#C8694A] underline-offset-4">
                    {t.hero.trySampleLink}
                  </span>
                  <ArrowRight
                    className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={1.5}
                  />
                </button>
              </motion.div>

              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.4, ease: CALM_EASE }}
                className="pt-1 flex flex-wrap items-center gap-3 text-[13px] text-[#5B6B67] dark:text-[#9EB0AC]"
              >
                <span>{t.hero.trustNothingStored}</span>
                <span aria-hidden="true">·</span>
                <span>{t.hero.trustClarityScore}</span>
                <span aria-hidden="true">·</span>
                <span>{t.hero.trustLanguagesCount}</span>
              </motion.div>
            </div>

            {/* Hero Right Column: Slightly asymmetric floating preview card + overlapping note */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.25, ease: CALM_EASE }}
              className="lg:col-span-5 relative lg:pl-4 min-w-0"
            >
              <motion.div
                aria-label="Sample explanation preview card"
                animate={
                  prefersReducedMotion
                    ? { y: 0 }
                    : { y: [0, -7, 0] }
                }
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : { y: -6, rotate: 0.35, scale: 1.01 }
                }
                className="clinic-card clinic-card-hover p-6 sm:p-7 space-y-5 lg:translate-y-1"
              >
                <div className="flex items-center justify-between gap-2 border-b border-[#E6DFD2] dark:border-[#263D38] pb-3.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5B6B67] dark:text-[#9EB0AC]">
                    {t.hero.sampleCardTitle}
                  </span>
                  <span className="font-mono tabular-nums text-xs font-medium text-[#1F4E4A] dark:text-[#8CE0C0] bg-[#DCE8E2]/70 dark:bg-[#1B332E] px-2.5 py-0.5 rounded-full">
                    {t.hero.clarityBadge}
                  </span>
                </div>

                {/* Sample Item */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-serif text-xl font-medium text-[#1E2A28] dark:text-[#EAE6DF] break-words">
                        {t.hero.sampleTestName}
                      </h2>
                      <p className="text-xs text-[#5B6B67] dark:text-[#9EB0AC] mt-0.5">
                        {t.hero.sampleTypicalRange}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-serif text-2xl font-medium text-[#1E2A28] dark:text-[#EAE6DF]">
                        <AnimatedValue
                          value="105"
                          reducedMotion={prefersReducedMotion}
                        />
                      </span>
                      <span className="text-xs text-[#5B6B67] dark:text-[#9EB0AC] ml-1">
                        mg/dL
                      </span>
                    </div>
                  </div>

                  {/* Mini Range Bar + Status Chip */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D9A441]/15 border border-[#D9A441]/40 text-[#8A5B13] dark:text-[#F0C675] font-medium">
                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                        <span>{t.hero.slightlyHigh}</span>
                      </span>
                      <span className="text-[#5B6B67] dark:text-[#9EB0AC] font-mono tabular-nums text-[11px]">
                        70 – 99 mg/dL
                      </span>
                    </div>

                    <div className="relative h-2.5 w-full bg-[#EFEAE0] dark:bg-[#162522] rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 bottom-0 left-[25%] right-[25%] bg-[#DCE8E2] dark:bg-[#24423B]"
                        aria-hidden="true"
                      />
                      <motion.div
                        initial={
                          prefersReducedMotion ? { left: "78%" } : { left: "0%" }
                        }
                        animate={{ left: "78%" }}
                        transition={{
                          type: "spring",
                          stiffness: 90,
                          damping: 18,
                          delay: 0.4,
                        }}
                        className="absolute top-0 bottom-0 w-3 rounded-full bg-[#D9A441] -translate-x-1/2 shadow-xs flex items-center justify-center"
                        aria-hidden="true"
                      >
                        {!prefersReducedMotion && (
                          <motion.span
                            animate={{
                              scale: [1, 1.9, 1],
                              opacity: [0.55, 0, 0.55],
                            }}
                            transition={{
                              duration: 2.8,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="w-full h-full rounded-full bg-[#D9A441]"
                          />
                        )}
                      </motion.div>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#5B6B67] dark:text-[#9EB0AC]">
                      <span>{t.hero.lower}</span>
                      <span>{t.hero.typicalRange}</span>
                      <span>{t.hero.higher}</span>
                    </div>
                  </div>

                  <p className="text-[14.5px] text-[#1E2A28] dark:text-[#DCE6E3] leading-relaxed bg-[#FAF7F2]/90 dark:bg-[#111C1A] p-4 rounded-2xl border border-[#E6DFD2] dark:border-[#263D38]">
                    {t.hero.sampleExplanation}
                  </p>
                </div>
              </motion.div>

              {/* Overlapping asymmetric warm microcopy card with gentle counter-floating motion */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                animate={
                  prefersReducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 1, y: [0, 5, 0] }
                }
                transition={{
                  opacity: { duration: 0.65, delay: 0.5, ease: CALM_EASE },
                  y: {
                    duration: 4.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  },
                }}
                className="mt-4 sm:-mt-5 sm:-ml-5 relative z-10 inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#DCE8E2] dark:bg-[#1B332E] border border-[#1F4E4A]/15 dark:border-[#8CE0C0]/20 text-xs sm:text-[13px] text-[#1F4E4A] dark:text-[#8CE0C0] shadow-sm"
              >
                <motion.span
                  animate={
                    prefersReducedMotion
                      ? { scale: 1 }
                      : { scale: [1, 1.14, 1] }
                  }
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-flex shrink-0"
                >
                  <HeartHandshake
                    className="w-4 h-4 text-[#C8694A] shrink-0"
                    strokeWidth={1.5}
                  />
                </motion.span>
                <span className="font-medium">
                  {t.hero.reassuranceFloatingNote}
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* Ayurvedic Sanctuary Visual Showcase with Living Botanical & Sunlight Animations */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.75, delay: 0.15, ease: CALM_EASE }}
            className="max-w-6xl mx-auto mt-14 sm:mt-20"
          >
            <div className="clinic-card p-5 sm:p-8 lg:p-10 relative overflow-hidden">
              {/* Soft ambient background glow inside the sanctuary card */}
              <motion.div
                aria-hidden="true"
                animate={
                  prefersReducedMotion
                    ? { opacity: 0.35, scale: 1 }
                    : {
                        opacity: [0.25, 0.5, 0.25],
                        scale: [0.96, 1.06, 0.96],
                        rotate: [0, 3, -2, 0],
                      }
                }
                transition={{
                  duration: 14,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#DCE8E2]/65 dark:bg-[#1F4E4A]/30 blur-3xl -z-0"
              />
              <motion.div
                aria-hidden="true"
                animate={
                  prefersReducedMotion
                    ? { opacity: 0.2, scale: 1 }
                    : {
                        opacity: [0.15, 0.32, 0.15],
                        scale: [1, 1.08, 1],
                      }
                }
                transition={{
                  duration: 11,
                  delay: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute -bottom-24 right-8 w-72 h-72 rounded-full bg-[#C8694A]/15 dark:bg-[#C8694A]/10 blur-3xl -z-0"
              />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                {/* Left Column: Animated Ayurveda Picture Frame */}
                <div className="lg:col-span-6 relative">
                  {/* Synchronized rhythmic heartbeat aura ring behind the image container */}
                  <motion.div
                    aria-hidden="true"
                    animate={
                      prefersReducedMotion
                        ? { scale: 1, opacity: 0.6, rotate: 0 }
                        : {
                            scale: [0.985, 1.028, 1.005, 1.048, 0.985],
                            opacity: [0.45, 0.82, 0.55, 0.95, 0.45],
                            rotate: [-0.6, 0.4, -0.2, 0.8, -0.6],
                          }
                    }
                    transition={{
                      duration: 5.6,
                      times: [0, 0.22, 0.38, 0.58, 1],
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="pointer-events-none absolute -inset-2.5 sm:-inset-3.5 rounded-[28px] bg-gradient-to-br from-[#DCE8E2]/80 via-[#FAF7F2]/45 to-[#C8694A]/25 dark:from-[#1B332E]/80 dark:via-[#162623]/45 dark:to-[#C8694A]/25 -z-10"
                  />

                  {/* Secondary soft expanding heartbeat ripple ring */}
                  {!prefersReducedMotion && (
                    <motion.div
                      aria-hidden="true"
                      animate={{
                        scale: [1, 1.045, 1.01, 1.07, 1],
                        opacity: [0.25, 0.55, 0.2, 0, 0.25],
                      }}
                      transition={{
                        duration: 5.6,
                        times: [0, 0.22, 0.38, 0.78, 1],
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                      className="pointer-events-none absolute -inset-1.5 sm:-inset-2 rounded-[26px] border border-[#C8694A]/30 dark:border-[#8CE0C0]/25 -z-10"
                    />
                  )}

                  {/* Ayurveda Image Container with gentle rhythmic breathing heartbeat pulse */}
                  <motion.figure
                    animate={
                      prefersReducedMotion
                        ? { scale: 1, y: 0, rotate: 0 }
                        : {
                            scale: [1, 1.016, 1.004, 1.026, 1],
                            y: [0, -3.5, -1.5, -6, 0],
                            rotate: [0, 0.25, -0.1, 0.4, 0],
                          }
                    }
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : {
                            duration: 5.6,
                            times: [0, 0.22, 0.38, 0.58, 1],
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                    }
                    whileHover={
                      prefersReducedMotion
                        ? undefined
                        : {
                            y: -8,
                            scale: 1.032,
                            rotate: 0,
                            transition: { duration: 0.4, ease: CALM_EASE },
                          }
                    }
                    className="group relative rounded-[22px] overflow-hidden border border-[#E6DFD2] dark:border-[#2C4943] bg-[#F2ECE1] dark:bg-[#162623] shadow-md aspect-4/3 origin-center will-change-transform"
                  >
                    {/* Animated Ayurveda Sanctuary Image with gentle Ken Burns breathing & drift */}
                    <motion.img
                      src={AYURVEDA_SANCTUARY_IMAGE_DATA_URI}
                      alt="Ayurvedic wellness sanctuary featuring a handcrafted terracotta and brass mortar and pestle, fresh sacred tulsi leaves, ashwagandha roots, chamomile blossoms, and apothecary vessel on warm linen in morning sunlight"
                      loading="eager"
                      decoding="async"
                      animate={
                        prefersReducedMotion
                          ? { scale: 1, x: 0, y: 0, rotate: 0 }
                          : {
                              scale: [1.02, 1.085, 1.02],
                              x: [0, -6, 4, 0],
                              y: [0, -4, 3, 0],
                              rotate: [0, 0.45, -0.35, 0],
                            }
                      }
                      transition={{
                        duration: 16,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-full h-full object-cover origin-center"
                    />

                    {/* Warm Golden-Hour Dappled Sunlight Shimmer Sweeping Gently Across the Picture */}
                    {!prefersReducedMotion && (
                      <motion.div
                        aria-hidden="true"
                        animate={{
                          x: ["-30%", "30%", "-30%"],
                          opacity: [0.18, 0.48, 0.18],
                        }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-[#FAF7F2]/30 to-[#D9A441]/20 mix-blend-soft-light"
                      />
                    )}

                    {/* Subtle vignette for museum-grade depth */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1E2A28]/45 via-transparent to-[#1E2A28]/10"
                    />

                    {/* Self-drawing Handcrafted Ayurvedic Botanical Arch & Corner Flourishes Overlay */}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 400 300"
                      fill="none"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute inset-2.5 sm:inset-3.5 w-[calc(100%-1.25rem)] sm:w-[calc(100%-1.75rem)] h-[calc(100%-1.25rem)] sm:h-[calc(100%-1.75rem)] text-[#FAF7F2]/75"
                    >
                      {/* Delicate arched sanctuary inner frame */}
                      <motion.path
                        d="M 12 288 L 12 64 C 12 28 44 10 84 10 L 316 10 C 356 10 388 28 388 64 L 388 288 Z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        animate={
                          prefersReducedMotion
                            ? { pathLength: 1, opacity: 0.55 }
                            : {
                                pathLength: [0.75, 1, 0.75],
                                opacity: [0.35, 0.75, 0.35],
                              }
                        }
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      {/* Top-right botanical leaf flourish */}
                      <motion.path
                        d="M 348 26 C 362 26 372 36 372 50 C 358 50 348 40 348 26 Z"
                        stroke="#DCE8E2"
                        strokeWidth="1.3"
                        fill="#DCE8E2"
                        fillOpacity="0.22"
                        animate={
                          prefersReducedMotion
                            ? { scale: 1, opacity: 0.7 }
                            : {
                                scale: [0.92, 1.08, 0.92],
                                opacity: [0.45, 0.9, 0.45],
                              }
                        }
                        transition={{
                          duration: 4.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </svg>

                    {/* Floating Prana / Botanical Light Motes Over the Picture */}
                    {!prefersReducedMotion && (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 overflow-hidden"
                      >
                        <motion.span
                          animate={{
                            y: [0, -24, 0],
                            x: [0, 10, 0],
                            opacity: [0.2, 0.75, 0.2],
                            scale: [0.85, 1.25, 0.85],
                          }}
                          transition={{
                            duration: 5.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="absolute bottom-12 left-[22%] w-2 h-2 rounded-full bg-[#FAF7F2] shadow-xs"
                        />
                        <motion.span
                          animate={{
                            y: [0, -30, 0],
                            x: [0, -12, 0],
                            opacity: [0.15, 0.65, 0.15],
                            scale: [0.9, 1.3, 0.9],
                          }}
                          transition={{
                            duration: 6.8,
                            delay: 1.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="absolute bottom-16 right-[28%] w-2.5 h-2.5 rounded-full bg-[#DCE8E2]"
                        />
                        <motion.span
                          animate={{
                            y: [0, -20, 0],
                            x: [0, 8, 0],
                            opacity: [0.2, 0.7, 0.2],
                          }}
                          transition={{
                            duration: 4.9,
                            delay: 2.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="absolute top-1/3 left-[48%] w-1.5 h-1.5 rounded-full bg-[#D9A441]"
                        />
                      </div>
                    )}

                    {/* Floating glass-linen caption badge at bottom of picture */}
                    <figcaption className="absolute bottom-3.5 left-3.5 right-3.5 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2]/90 dark:bg-[#111C1A]/90 backdrop-blur-md border border-[#E6DFD2] dark:border-[#2C4943] text-xs text-[#1E2A28] dark:text-[#EAE6DF]">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <motion.span
                          aria-hidden="true"
                          animate={
                            prefersReducedMotion
                              ? { rotate: 0, scale: 1 }
                              : {
                                  rotate: [-6, 6, -6],
                                  scale: [1, 1.1, 1],
                                }
                          }
                          transition={{
                            duration: 4.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="w-6 h-6 rounded-full bg-[#DCE8E2] dark:bg-[#1B332E] border border-[#1F4E4A]/15 dark:border-[#8CE0C0]/25 flex items-center justify-center shrink-0 text-[#1F4E4A] dark:text-[#8CE0C0]"
                        >
                          <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            className="w-3.5 h-3.5"
                          >
                            <path
                              d="M10 3C6.5 6 5 9.5 5 12.5C5 15.2 7.2 17 10 17C12.8 17 15 15.2 15 12.5C15 9.5 13.5 6 10 3Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M10 17V8.5"
                              stroke="#C8694A"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                            />
                          </svg>
                        </motion.span>
                        <span className="font-serif text-[13.5px] text-[#1F4E4A] dark:text-[#8CE0C0] truncate">
                          {t.hero.sanctuaryCaption}
                        </span>
                      </div>
                      <span className="text-[10.5px] uppercase tracking-[0.14em] text-[#5B6B67] dark:text-[#9EB0AC] font-medium shrink-0 hidden sm:inline">
                        {t.hero.sanctuaryBadge}
                      </span>
                    </figcaption>
                  </motion.figure>
                </div>

                {/* Right Column: Warm Ayurvedic Philosophy & Restorative Context */}
                <div className="lg:col-span-6 space-y-5 lg:pl-2 min-w-0">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#C8694A]">
                    <span
                      aria-hidden="true"
                      className="w-5 h-px bg-[#C8694A]/60"
                    />
                    <span>{t.hero.sanctuaryKicker}</span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-[2.15rem] font-normal text-[#1E2A28] dark:text-[#EAE6DF] leading-[1.2] tracking-[-0.015em]">
                    {t.hero.sanctuaryTitlePrefix}{" "}
                    <span
                      className={`text-[#1F4E4A] dark:text-[#8CE0C0] ${
                        languageCode === "en" ? "italic" : ""
                      }`}
                    >
                      {t.hero.sanctuaryTitleEmphasis}
                    </span>
                  </h2>

                  <p className="text-[15.5px] sm:text-[16.5px] text-[#5B6B67] dark:text-[#9EB0AC] leading-[1.7]">
                    {t.hero.sanctuaryBody}
                  </p>

                  {/* Three gentle Ayurvedic pillars */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {[
                      {
                        sanskrit: "Prana",
                        title: t.hero.pillar1Title,
                        desc: t.hero.pillar1Desc,
                      },
                      {
                        sanskrit: "Sattva",
                        title: t.hero.pillar2Title,
                        desc: t.hero.pillar2Desc,
                      },
                      {
                        sanskrit: "Mitra",
                        title: t.hero.pillar3Title,
                        desc: t.hero.pillar3Desc,
                      },
                    ].map((pillar, idx) => (
                      <motion.div
                        key={pillar.sanskrit}
                        initial={
                          prefersReducedMotion ? false : { opacity: 0, y: 12 }
                        }
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{
                          duration: 0.45,
                          delay: 0.2 + idx * 0.1,
                          ease: CALM_EASE,
                        }}
                        whileHover={
                          prefersReducedMotion ? undefined : { y: -3 }
                        }
                        className="p-3.5 rounded-2xl bg-[#FAF7F2]/90 dark:bg-[#111C1A] border border-[#E6DFD2] dark:border-[#263D38] space-y-1 transition-shadow hover:shadow-xs min-w-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-sm text-[#C8694A]">
                            {pillar.sanskrit}
                          </span>
                          <span
                            aria-hidden="true"
                            className="w-1.5 h-1.5 rounded-full bg-[#5E9C84]/70"
                          />
                        </div>
                        <p className="text-[13.5px] font-medium text-[#1E2A28] dark:text-[#EAE6DF] break-words">
                          {pillar.title}
                        </p>
                        <p className="text-xs text-[#5B6B67] dark:text-[#9EB0AC] leading-relaxed">
                          {pillar.desc}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 2. Input Workspace Section (Scroll reveal, sliding layoutId pill tabs, inner-shadow textarea) */}
        <motion.section
          id="workspace"
          ref={workspaceRef}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.65, ease: CALM_EASE }}
          className="py-8 sm:py-12 px-4 sm:px-8 max-w-4xl mx-auto no-print"
        >
          <div className="clinic-card p-5 sm:p-9 space-y-6">
            {/* Top Bar inside Workspace: Sliding Pill Tabs + Searchable Language Selector */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3.5 sm:gap-4 border-b border-[#E6DFD2] dark:border-[#263D38] pb-5">
              {/* Pill-shaped tabs with sliding indicator (layoutId) — single row 3-col grid on mobile */}
              <div
                role="tablist"
                aria-label="Document input method"
                className="grid grid-cols-3 w-full sm:w-auto sm:inline-flex items-center gap-1 p-1 sm:p-1.5 bg-[#FAF7F2] dark:bg-[#111C1A] border border-[#E6DFD2] dark:border-[#263D38] rounded-full min-w-0"
              >
                {TAB_DEFINITIONS.map((tab) => {
                  const Icon = tab.Icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={tab.label}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setErrorMessage(null);
                      }}
                      className={`relative inline-flex items-center justify-center gap-1.5 sm:gap-2 min-h-[42px] px-2 sm:px-4 py-2 rounded-full text-[12.5px] sm:text-[14px] font-medium transition-colors min-w-0 cursor-pointer ${
                        isActive
                          ? "text-[#FAF7F2]"
                          : "text-[#5B6B67] dark:text-[#9EB0AC] hover:text-[#1E2A28] dark:hover:text-[#EAE6DF]"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="activeInputTab"
                          transition={{
                            type: "spring",
                            stiffness: 340,
                            damping: 30,
                          }}
                          className="absolute inset-0 rounded-full bg-[#1F4E4A] -z-0 shadow-xs"
                        />
                      )}
                      <Icon
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10 shrink-0"
                        strokeWidth={1.5}
                      />
                      {tab.mobileLabel === tab.label ? (
                        <span className="relative z-10 truncate">
                          {tab.label}
                        </span>
                      ) : (
                        <>
                          <span
                            className="relative z-10 sm:hidden truncate"
                            aria-hidden="true"
                          >
                            {tab.mobileLabel}
                          </span>
                          <span className="relative z-10 hidden sm:inline truncate">
                            {tab.label}
                          </span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Searchable Language Selector */}
              <div className="flex items-center justify-between md:justify-end gap-2.5 w-full md:w-auto min-w-0">
                <span className="text-xs font-medium uppercase tracking-[0.1em] text-[#5B6B67] dark:text-[#9EB0AC] whitespace-nowrap">
                  {t.languageSelector.label}
                </span>
                <LanguageSelector
                  id="language-select"
                  value={languageCode}
                  onChange={(code) => void handleLanguageChange(code)}
                  t={t}
                />
              </div>
            </div>

            {/* Beta Language Note Banner in Workspace when Bhojpuri, Rajasthani, or Sanskrit is selected */}
            {LANGUAGE_META_MAP[languageCode]?.status === "beta" && (
              <div className="rounded-xl px-3.5 py-2.5 bg-[#D99B52]/12 dark:bg-[#D99B52]/20 border border-[#D99B52]/35 text-xs text-[#1E2A28] dark:text-[#EAE6DF] flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#D99B52]/25 text-[#875212] dark:text-[#F5C582] shrink-0">
                  {t.languageSelector.betaBadge}
                </span>
                <span className="break-words">{t.languageSelector.betaNote}</span>
              </div>
            )}

            {/* Personal Health Profile Context Bar (Session-only: Optional for report explainer, required in full to unlock "Ask a Specialist") */}
            <div
              id="user-profile-context"
              ref={profileSectionRef}
              aria-label={t.profile.sectionTitle}
              className="rounded-[20px] bg-[#FAF7F2]/90 dark:bg-[#111C1A]/90 border border-[#E6DFD2] dark:border-[#263D38] p-4 sm:p-5 space-y-4 scroll-mt-24"
            >
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <User
                    className="w-4 h-4 text-[#1F4E4A] dark:text-[#8CE0C0] shrink-0"
                    strokeWidth={1.5}
                  />
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1F4E4A] dark:text-[#8CE0C0]">
                    {t.profile.sectionTitle}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-xs text-[#5B6B67] dark:text-[#9EB0AC]"
                  >
                    ·
                  </span>
                  <span className="text-xs text-[#5B6B67] dark:text-[#9EB0AC]">
                    {t.profile.sessionOnlyNote} · {t.profile.unlocksSpecialist}{" "}
                    <strong className="font-medium text-[#1F4E4A] dark:text-[#8CE0C0]">
                      {t.nav.askSpecialist}
                    </strong>{" "}
                    ({completedProfileCount}/
                    {localizedProfileRequiredFields.length}{" "}
                    {t.profile.fieldsCountLabel})
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setUserProfile({ ...SAMPLE_COMPLETE_PROFILE })}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-[#DCE8E2]/80 dark:bg-[#1B332E] border border-[#1F4E4A]/15 dark:border-[#8CE0C0]/25 text-[#1F4E4A] dark:text-[#8CE0C0] hover:border-[#1F4E4A] transition-colors cursor-pointer"
                  >
                    {t.profile.fillSampleProfile}
                  </button>
                  {hasActiveUserProfile && (
                    <button
                      type="button"
                      onClick={() => setUserProfile({ ...EMPTY_USER_PROFILE })}
                      className="text-xs font-medium text-[#5B6B67] dark:text-[#9EB0AC] hover:text-[#C8694A] transition-colors cursor-pointer"
                    >
                      {t.profile.clearProfile}
                    </button>
                  )}
                </div>
              </div>

              {/* Row 1: Name, Age, Sex, Blood Type */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-3.5 items-end">
                {/* Name Input */}
                <div className="sm:col-span-4 min-w-0">
                  <label
                    htmlFor="profile-name-input"
                    className="block text-xs font-medium text-[#5B6B67] dark:text-[#9EB0AC] mb-1.5"
                  >
                    {t.profile.nameLabel}
                  </label>
                  <div className="relative">
                    <User
                      className="w-4 h-4 text-[#5B6B67] dark:text-[#9EB0AC] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      strokeWidth={1.5}
                    />
                    <input
                      id="profile-name-input"
                      type="text"
                      value={userProfile.name}
                      onChange={(e) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder={t.profile.namePlaceholder}
                      maxLength={60}
                      className="w-full min-h-[42px] rounded-xl bg-white dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#2C4641] focus:border-[#1F4E4A] pl-10 pr-3.5 py-2 text-[15px] sm:text-sm text-[#1E2A28] dark:text-[#EAE6DF] placeholder:text-[#5B6B67]/60 transition-colors"
                    />
                  </div>
                </div>

                {/* Age Input */}
                <div className="sm:col-span-2 min-w-0">
                  <label
                    htmlFor="profile-age-input"
                    className="block text-xs font-medium text-[#5B6B67] dark:text-[#9EB0AC] mb-1.5"
                  >
                    {t.profile.ageLabel}
                  </label>
                  <input
                    id="profile-age-input"
                    type="text"
                    inputMode="numeric"
                    value={userProfile.age}
                    onChange={(e) =>
                      setUserProfile((prev) => ({
                        ...prev,
                        age: e.target.value,
                      }))
                    }
                    placeholder={t.profile.agePlaceholder}
                    maxLength={15}
                    className="w-full min-h-[42px] rounded-xl bg-white dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#2C4641] focus:border-[#1F4E4A] px-3.5 py-2 text-[15px] sm:text-sm text-[#1E2A28] dark:text-[#EAE6DF] placeholder:text-[#5B6B67]/60 transition-colors"
                  />
                </div>

                {/* Sex Select */}
                <div className="sm:col-span-3 min-w-0">
                  <label
                    htmlFor="profile-sex-select"
                    className="block text-xs font-medium text-[#5B6B67] dark:text-[#9EB0AC] mb-1.5"
                  >
                    {t.profile.sexLabel}
                  </label>
                  <div className="relative">
                    <select
                      id="profile-sex-select"
                      value={userProfile.sex}
                      onChange={(e) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          sex: e.target.value,
                        }))
                      }
                      className="w-full min-h-[42px] appearance-none rounded-xl bg-white dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#2C4641] focus:border-[#1F4E4A] pl-3.5 pr-9 py-2 text-[15px] sm:text-sm text-[#1E2A28] dark:text-[#EAE6DF] cursor-pointer transition-colors"
                    >
                      {SEX_OPTIONS.map((option) => (
                        <option key={option || "none"} value={option}>
                          {option === ""
                            ? t.profile.sexSelectPlaceholder
                            : option === "Female"
                            ? t.profile.sexFemale
                            : option === "Male"
                            ? t.profile.sexMale
                            : option === "Non-binary / Other"
                            ? t.profile.sexOther
                            : t.profile.sexPreferNot}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="w-3.5 h-3.5 text-[#5B6B67] dark:text-[#9EB0AC] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                {/* Blood Type Select */}
                <div className="sm:col-span-3 min-w-0">
                  <label
                    htmlFor="profile-blood-type-select"
                    className="block text-xs font-medium text-[#5B6B67] dark:text-[#9EB0AC] mb-1.5"
                  >
                    {t.profile.bloodTypeLabel}
                  </label>
                  <div className="relative">
                    <Droplets
                      className="w-4 h-4 text-[#C8694A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      strokeWidth={1.5}
                    />
                    <select
                      id="profile-blood-type-select"
                      value={userProfile.bloodType}
                      onChange={(e) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          bloodType: e.target.value,
                        }))
                      }
                      className="w-full min-h-[42px] appearance-none rounded-xl bg-white dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#2C4641] focus:border-[#1F4E4A] pl-10 pr-9 py-2 text-[15px] sm:text-sm text-[#1E2A28] dark:text-[#EAE6DF] cursor-pointer transition-colors"
                    >
                      {BLOOD_TYPE_OPTIONS.map((option) => (
                        <option key={option || "none"} value={option}>
                          {option === ""
                            ? t.profile.bloodTypeSelectPlaceholder
                            : option === "Unknown / Not sure"
                            ? t.profile.bloodTypeUnknown
                            : option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="w-3.5 h-3.5 text-[#5B6B67] dark:text-[#9EB0AC] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Diabetes Status (Sugar), Allergies, Blood Pressure / Fluid Conditions */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-3.5 items-end">
                {/* Diabetes / Sugar Status Input */}
                <div className="sm:col-span-4 min-w-0">
                  <label
                    htmlFor="profile-sugar-input"
                    className="block text-xs font-medium text-[#5B6B67] dark:text-[#9EB0AC] mb-1.5"
                  >
                    {t.profile.sugarLabel}
                  </label>
                  <div className="relative">
                    <Activity
                      className="w-4 h-4 text-[#1F4E4A] dark:text-[#8CE0C0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      strokeWidth={1.5}
                    />
                    <input
                      id="profile-sugar-input"
                      type="text"
                      list="profile-sugar-presets"
                      value={userProfile.sugar}
                      onChange={(e) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          sugar: e.target.value,
                        }))
                      }
                      placeholder={t.profile.sugarPlaceholder}
                      maxLength={80}
                      className="w-full min-h-[42px] rounded-xl bg-white dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#2C4641] focus:border-[#1F4E4A] pl-10 pr-3.5 py-2 text-[15px] sm:text-sm text-[#1E2A28] dark:text-[#EAE6DF] placeholder:text-[#5B6B67]/60 transition-colors"
                    />
                    <datalist id="profile-sugar-presets">
                      {SUGAR_PRESET_OPTIONS.map((preset) => (
                        <option key={preset} value={preset} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Allergy Input */}
                <div className="sm:col-span-4 min-w-0">
                  <label
                    htmlFor="profile-allergy-input"
                    className="block text-xs font-medium text-[#5B6B67] dark:text-[#9EB0AC] mb-1.5"
                  >
                    {t.profile.allergyLabel}
                  </label>
                  <div className="relative">
                    <AlertCircle
                      className="w-4 h-4 text-[#C8694A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      strokeWidth={1.5}
                    />
                    <input
                      id="profile-allergy-input"
                      type="text"
                      list="profile-allergy-presets"
                      value={userProfile.allergy}
                      onChange={(e) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          allergy: e.target.value,
                        }))
                      }
                      placeholder={t.profile.allergyPlaceholder}
                      maxLength={100}
                      className="w-full min-h-[42px] rounded-xl bg-white dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#2C4641] focus:border-[#1F4E4A] pl-10 pr-3.5 py-2 text-[15px] sm:text-sm text-[#1E2A28] dark:text-[#EAE6DF] placeholder:text-[#5B6B67]/60 transition-colors"
                    />
                    <datalist id="profile-allergy-presets">
                      {ALLERGY_PRESET_OPTIONS.map((preset) => (
                        <option key={preset} value={preset} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Blood Pressure / Fluid-Related Conditions Input */}
                <div className="sm:col-span-4 min-w-0">
                  <label
                    htmlFor="profile-bp-input"
                    className="block text-xs font-medium text-[#5B6B67] dark:text-[#9EB0AC] mb-1.5"
                  >
                    {t.profile.bpLabel}
                  </label>
                  <input
                    id="profile-bp-input"
                    type="text"
                    list="profile-bp-presets"
                    value={userProfile.bloodPressure}
                    onChange={(e) =>
                      setUserProfile((prev) => ({
                        ...prev,
                        bloodPressure: e.target.value,
                      }))
                    }
                    placeholder={t.profile.bpPlaceholder}
                    maxLength={100}
                    className="w-full min-h-[42px] rounded-xl bg-white dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#2C4641] focus:border-[#1F4E4A] px-3.5 py-2 text-[15px] sm:text-sm text-[#1E2A28] dark:text-[#EAE6DF] placeholder:text-[#5B6B67]/60 transition-colors"
                  />
                  <datalist id="profile-bp-presets">
                    {BP_FLUID_PRESET_OPTIONS.map((preset) => (
                      <option key={preset} value={preset} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Row 3: Existing Conditions, Height, Weight, Other Details */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-3.5 items-end">
                {/* Existing Conditions Input */}
                <div className="sm:col-span-4 min-w-0">
                  <label
                    htmlFor="profile-conditions-input"
                    className="block text-xs font-medium text-[#5B6B67] dark:text-[#9EB0AC] mb-1.5"
                  >
                    {t.profile.conditionsLabel}
                  </label>
                  <input
                    id="profile-conditions-input"
                    type="text"
                    list="profile-conditions-presets"
                    value={userProfile.existingConditions}
                    onChange={(e) =>
                      setUserProfile((prev) => ({
                        ...prev,
                        existingConditions: e.target.value,
                      }))
                    }
                    placeholder={t.profile.conditionsPlaceholder}
                    maxLength={120}
                    className="w-full min-h-[42px] rounded-xl bg-white dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#2C4641] focus:border-[#1F4E4A] px-3.5 py-2 text-[15px] sm:text-sm text-[#1E2A28] dark:text-[#EAE6DF] placeholder:text-[#5B6B67]/60 transition-colors"
                  />
                  <datalist id="profile-conditions-presets">
                    {EXISTING_CONDITIONS_PRESET_OPTIONS.map((preset) => (
                      <option key={preset} value={preset} />
                    ))}
                  </datalist>
                </div>

                {/* Height Input */}
                <div className="sm:col-span-2 min-w-0">
                  <label
                    htmlFor="profile-height-input"
                    className="block text-xs font-medium text-[#5B6B67] dark:text-[#9EB0AC] mb-1.5"
                  >
                    {t.profile.heightLabel}
                  </label>
                  <div className="relative">
                    <Ruler
                      className="w-4 h-4 text-[#5B6B67] dark:text-[#9EB0AC] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      strokeWidth={1.5}
                    />
                    <input
                      id="profile-height-input"
                      type="text"
                      value={userProfile.height}
                      onChange={(e) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          height: e.target.value,
                        }))
                      }
                      placeholder={t.profile.heightPlaceholder}
                      maxLength={30}
                      className="w-full min-h-[42px] rounded-xl bg-white dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#2C4641] focus:border-[#1F4E4A] pl-9 pr-2.5 py-2 text-[15px] sm:text-sm text-[#1E2A28] dark:text-[#EAE6DF] placeholder:text-[#5B6B67]/60 transition-colors"
                    />
                  </div>
                </div>

                {/* Weight Input */}
                <div className="sm:col-span-2 min-w-0">
                  <label
                    htmlFor="profile-weight-input"
                    className="block text-xs font-medium text-[#5B6B67] dark:text-[#9EB0AC] mb-1.5"
                  >
                    {t.profile.weightLabel}
                  </label>
                  <div className="relative">
                    <Scale
                      className="w-4 h-4 text-[#5B6B67] dark:text-[#9EB0AC] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      strokeWidth={1.5}
                    />
                    <input
                      id="profile-weight-input"
                      type="text"
                      value={userProfile.weight}
                      onChange={(e) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          weight: e.target.value,
                        }))
                      }
                      placeholder={t.profile.weightPlaceholder}
                      maxLength={30}
                      className="w-full min-h-[42px] rounded-xl bg-white dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#2C4641] focus:border-[#1F4E4A] pl-9 pr-2.5 py-2 text-[15px] sm:text-sm text-[#1E2A28] dark:text-[#EAE6DF] placeholder:text-[#5B6B67]/60 transition-colors"
                    />
                  </div>
                </div>

                {/* Other Details Input */}
                <div className="sm:col-span-4 min-w-0">
                  <label
                    htmlFor="profile-other-input"
                    className="block text-xs font-medium text-[#5B6B67] dark:text-[#9EB0AC] mb-1.5"
                  >
                    {t.profile.otherLabel}
                  </label>
                  <div className="relative">
                    <FileText
                      className="w-4 h-4 text-[#5B6B67] dark:text-[#9EB0AC] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      strokeWidth={1.5}
                    />
                    <input
                      id="profile-other-input"
                      type="text"
                      value={userProfile.otherDetails}
                      onChange={(e) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          otherDetails: e.target.value,
                        }))
                      }
                      placeholder={t.profile.otherPlaceholder}
                      maxLength={140}
                      className="w-full min-h-[42px] rounded-xl bg-white dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#2C4641] focus:border-[#1F4E4A] pl-10 pr-3.5 py-2 text-[15px] sm:text-sm text-[#1E2A28] dark:text-[#EAE6DF] placeholder:text-[#5B6B67]/60 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                <p className="text-xs text-[#5B6B67] dark:text-[#9EB0AC] leading-relaxed">
                  {isProfileComplete ? (
                    <span className="text-[#1F4E4A] dark:text-[#8CE0C0] font-medium">
                      {t.profile.completeBanner} (
                      {activeProfileSummaryParts.join(" · ")})
                    </span>
                  ) : hasActiveUserProfile ? (
                    <span>
                      <strong className="text-[#1F4E4A] dark:text-[#8CE0C0] font-medium">
                        {t.profile.activeForReports}
                      </strong>{" "}
                      {activeProfileSummaryParts.join(" · ")}.{" "}
                      {t.profile.completeRemainingPrefix}{" "}
                      {missingProfileFields.map((f) => f.label).join(", ")}{" "}
                      {t.profile.completeRemainingSuffix}{" "}
                      <strong className="font-medium text-[#1E2A28] dark:text-[#EAE6DF]">
                        {t.nav.askSpecialist}
                      </strong>
                      .
                    </span>
                  ) : (
                    t.profile.optionalAllFieldsNote
                  )}
                </p>

                <motion.button
                  type="button"
                  onClick={scrollToSpecialistChat}
                  initial="rest"
                  whileHover={prefersReducedMotion ? "rest" : "hover"}
                  whileTap={prefersReducedMotion ? "rest" : "tap"}
                  animate="rest"
                  variants={{
                    rest: {
                      scale: 1,
                      y: 0,
                      transition: { duration: 0.35, ease: CALM_EASE },
                    },
                    hover: {
                      scale: 1.02,
                      y: -1.5,
                      transition: { duration: 0.35, ease: CALM_EASE },
                    },
                    tap: {
                      scale: 0.985,
                      y: 0,
                      transition: { duration: 0.15, ease: CALM_EASE },
                    },
                  }}
                  className="group btn-primary-teal relative z-10 w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-medium text-[16px] cursor-pointer whitespace-nowrap shrink-0 backdrop-blur-md border border-white/25 shadow-[0_8px_20px_-4px_rgba(31,78,74,0.35),inset_0_1px_1px_rgba(255,255,255,0.35)]"
                >
                  <motion.span
                    variants={{
                      rest: {
                        scale: 1,
                        rotate: 0,
                        transition: { duration: 0.4, ease: CALM_EASE },
                      },
                      hover: {
                        scale: [1, 1.18, 1.05, 1.24, 1],
                        rotate: [0, 15, -10, 20, 0],
                        transition: {
                          duration: 1.35,
                          times: [0, 0.28, 0.55, 0.78, 1],
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      },
                      tap: {
                        scale: 0.92,
                        rotate: -12,
                        transition: { duration: 0.15, ease: CALM_EASE },
                      },
                    }}
                    className="w-4 h-4 inline-flex items-center justify-center shrink-0 origin-center"
                  >
                    <Stethoscope
                      className="sparkles-icon w-4 h-4 origin-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-12 group-hover:scale-110"
                      strokeWidth={1.5}
                    />
                  </motion.span>
                  <span>
                    {isProfileComplete
                      ? t.profile.openSpecialistLink
                      : t.profile.goToSpecialistLink}
                  </span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5"
                    strokeWidth={1.5}
                  />
                </motion.button>
              </div>
            </div>

            {/* Tab Panel Content with smooth AnimatePresence crossfade & slide */}
            <AnimatePresence mode="wait" initial={false}>
              {activeTab === "upload" ? (
                <motion.div
                  key="upload-tab"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.32, ease: CALM_EASE }}
                  className="space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label
                      htmlFor="document-upload"
                      className="text-[15px] font-medium text-[#1E2A28] dark:text-[#EAE6DF]"
                    >
                      {t.workspace.uploadLabel}
                    </label>
                    <span className="text-xs text-[#5B6B67] dark:text-[#9EB0AC]">
                      {t.workspace.uploadFormats}
                    </span>
                  </div>

                  <input
                    id="document-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={(e) => handleFileSelection(e.target.files?.[0])}
                    className="sr-only"
                  />

                  <input
                    id="camera-capture-upload"
                    ref={cameraInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    capture="environment"
                    onChange={(e) => handleFileSelection(e.target.files?.[0])}
                    className="sr-only"
                  />

                  {!uploadedFile ? (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => fileInputRef.current?.click()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          fileInputRef.current?.click();
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleFileSelection(e.dataTransfer.files?.[0]);
                      }}
                      className="group border-2 border-dashed border-[#D5CCBC] dark:border-[#2C4641] hover:border-[#1F4E4A] dark:hover:border-[#8CE0C0] bg-[#FAF7F2]/75 dark:bg-[#111C1A] hover:bg-[#DCE8E2]/35 dark:hover:bg-[#1B332E]/40 rounded-[24px] p-6 sm:p-11 text-center cursor-pointer transition-all duration-300"
                    >
                      <motion.div
                        animate={
                          prefersReducedMotion
                            ? { y: 0 }
                            : { y: [0, -4, 0] }
                        }
                        transition={{
                          duration: 3.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="w-12 h-12 rounded-full bg-[#DCE8E2] dark:bg-[#1B332E] text-[#1F4E4A] dark:text-[#8CE0C0] flex items-center justify-center mx-auto mb-3.5 transition-transform duration-300 group-hover:scale-105"
                      >
                        <UploadCloud className="w-6 h-6" strokeWidth={1.5} />
                      </motion.div>
                      <p className="text-[16px] font-medium text-[#1E2A28] dark:text-[#EAE6DF]">
                        {t.workspace.uploadDropTitle}
                      </p>
                      <p className="text-xs text-[#5B6B67] dark:text-[#9EB0AC] mt-1 max-w-md mx-auto">
                        {t.workspace.uploadDropSub}
                      </p>

                      <div
                        className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="btn-primary-teal inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium cursor-pointer"
                        >
                          <Camera className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                          <span>{t.workspace.takePhotoBtn}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="btn-calm-lift inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full bg-white dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#2C4641] text-xs sm:text-sm font-medium text-[#1F4E4A] dark:text-[#8CE0C0] cursor-pointer"
                        >
                          <UploadCloud className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                          <span>{t.workspace.chooseFileBtn}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease: CALM_EASE }}
                      className="bg-[#FAF7F2] dark:bg-[#111C1A] border border-[#DCE8E2] dark:border-[#2C4641] rounded-[20px] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                        {uploadedFile.previewUrl ? (
                          <img
                            src={uploadedFile.previewUrl}
                            alt={`Preview of uploaded health document: ${uploadedFile.name}`}
                            decoding="async"
                            className="w-16 h-16 object-cover rounded-xl border border-[#E6DFD2] dark:border-[#2C4641] shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-[#DCE8E2] dark:bg-[#1B332E] text-[#1F4E4A] dark:text-[#8CE0C0] flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6" strokeWidth={1.5} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#1E2A28] dark:text-[#EAE6DF] break-all">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-[#5B6B67] dark:text-[#9EB0AC] mt-0.5 font-mono tabular-nums">
                            {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB ·{" "}
                            {t.workspace.readyToExplain}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E6DFD2] dark:border-[#263D38]">
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="sm:hidden btn-calm-lift inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 text-xs font-medium text-[#1F4E4A] dark:text-[#8CE0C0] bg-white dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#2C4641] rounded-full cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" strokeWidth={1.5} />
                          <span>{t.workspace.retakeBtn}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="btn-calm-lift min-h-[40px] px-3.5 py-2 text-xs font-medium text-[#1F4E4A] dark:text-[#8CE0C0] bg-white dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#2C4641] rounded-full cursor-pointer"
                        >
                          {t.workspace.changeFileBtn}
                        </button>
                        <button
                          type="button"
                          onClick={() => setUploadedFile(null)}
                          aria-label="Remove uploaded file"
                          className="inline-flex items-center justify-center w-10 h-10 text-[#C8694A] hover:bg-[#C8694A]/10 rounded-full transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div className="pt-1 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor="upload-notes"
                        className="block text-xs font-medium text-[#5B6B67] dark:text-[#9EB0AC] mb-1.5"
                      >
                        {t.workspace.optionalNoteLabel}
                      </label>
                      <input
                        id="upload-notes"
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={t.workspace.optionalNotePlaceholder}
                        className="w-full rounded-2xl bg-[#FAF7F2] dark:bg-[#111C1A] border border-[#E6DFD2] dark:border-[#263D38] px-4 py-2.5 text-[16px] sm:text-sm text-[#1E2A28] dark:text-[#EAE6DF] placeholder:text-[#5B6B67]/65 textarea-inner-calm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleLoadSampleReport("lab")}
                      className="btn-calm-lift inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2.5 rounded-full bg-[#DCE8E2]/70 dark:bg-[#1B332E] text-xs font-medium text-[#1F4E4A] dark:text-[#8CE0C0] cursor-pointer whitespace-nowrap"
                    >
                      <span>{t.workspace.trySampleReportBtn}</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.32, ease: CALM_EASE }}
                  className="space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-2.5">
                    <label
                      htmlFor="medical-text-input"
                      className="text-[15px] font-medium text-[#1E2A28] dark:text-[#EAE6DF]"
                    >
                      {activeTab === "lab"
                        ? t.workspace.pasteLabLabel
                        : t.workspace.pastePrescriptionLabel}
                    </label>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* Voice-to-Text Dictation Pill Button with animated soundwave */}
                      <button
                        type="button"
                        onClick={handleToggleVoiceDictation}
                        disabled={isTranscribingAudio}
                        aria-pressed={isDictating}
                        aria-label={
                          isDictating
                            ? t.workspace.stopDictation
                            : t.workspace.dictateByVoice
                        }
                        className={`btn-calm-lift inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-full border font-medium cursor-pointer ${
                          isDictating
                            ? "bg-[#C8694A]/15 border-[#C8694A] text-[#C8694A]"
                            : "bg-[#DCE8E2]/65 dark:bg-[#1B332E] border-[#1F4E4A]/15 dark:border-[#8CE0C0]/25 text-[#1F4E4A] dark:text-[#8CE0C0]"
                        }`}
                      >
                        {isDictating ? (
                          <>
                            <span
                              aria-hidden="true"
                              className="inline-flex items-center gap-0.5 h-3.5"
                            >
                              {[0, 1, 2, 3].map((barIdx) => (
                                <motion.span
                                  key={barIdx}
                                  animate={
                                    prefersReducedMotion
                                      ? { height: 8 }
                                      : { height: [4, 13, 6, 11, 4] }
                                  }
                                  transition={{
                                    duration: 0.9,
                                    repeat: Infinity,
                                    delay: barIdx * 0.14,
                                    ease: "easeInOut",
                                  }}
                                  className="w-0.5 rounded-full bg-[#C8694A]"
                                />
                              ))}
                            </span>
                            <Square
                              className="w-3 h-3 fill-current"
                              strokeWidth={1.5}
                            />
                            <span>{t.workspace.stopDictation}</span>
                          </>
                        ) : isTranscribingAudio ? (
                          <>
                            <RefreshCw
                              className="w-3.5 h-3.5 animate-spin"
                              strokeWidth={1.5}
                            />
                            <span>{t.workspace.transcribingVoice}</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-3.5 h-3.5" strokeWidth={1.5} />
                            <span>{t.workspace.dictateByVoice}</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleLoadSampleReport(
                            activeTab === "prescription" ? "prescription" : "lab"
                          )
                        }
                        className="btn-calm-lift inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-full bg-[#FAF7F2] dark:bg-[#111C1A] border border-[#E6DFD2] dark:border-[#263D38] font-medium text-[#1F4E4A] dark:text-[#8CE0C0] hover:border-[#1F4E4A] cursor-pointer"
                      >
                        <span>
                          {activeTab === "prescription"
                            ? t.workspace.trySamplePrescriptionBtn
                            : t.workspace.trySampleReportBtn}
                        </span>
                      </button>

                      {inputText.trim() && (
                        <button
                          type="button"
                          onClick={() => {
                            setInputText("");
                            setInterimTranscript("");
                            setErrorMessage(null);
                          }}
                          className="min-h-[38px] px-2.5 py-1 text-[#5B6B67] dark:text-[#9EB0AC] hover:text-[#C8694A] transition-colors cursor-pointer"
                        >
                          {t.workspace.clearText}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Big comfortable textarea with soft inner shadow */}
                  <div className="relative">
                    <textarea
                      id="medical-text-input"
                      rows={8}
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder={
                        activeTab === "lab"
                          ? t.workspace.labPlaceholder
                          : t.workspace.prescriptionPlaceholder
                      }
                      className={`w-full rounded-[20px] bg-[#FAF7F2] dark:bg-[#111C1A] border p-4 sm:p-5 pb-14 text-[16px] text-[#1E2A28] dark:text-[#EAE6DF] placeholder:text-[#5B6B67]/65 leading-[1.7] textarea-inner-calm transition-colors ${
                        isDictating
                          ? "border-[#C8694A]"
                          : "border-[#E6DFD2] dark:border-[#263D38] focus:border-[#1F4E4A]"
                      }`}
                    />

                    {/* Bottom bar inside textarea for quick voice status & mic toggle */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-3 pointer-events-none">
                      <div
                        aria-live="polite"
                        className="text-xs text-[#5B6B67] dark:text-[#9EB0AC] truncate"
                      >
                        {isDictating ? (
                          <span className="inline-flex items-center gap-2 text-[#C8694A] font-medium">
                            <span
                              aria-hidden="true"
                              className="inline-flex items-center gap-0.5 h-3"
                            >
                              {[0, 1, 2].map((b) => (
                                <motion.span
                                  key={b}
                                  animate={
                                    prefersReducedMotion
                                      ? { height: 6 }
                                      : { height: [3, 11, 4, 9, 3] }
                                  }
                                  transition={{
                                    duration: 0.85,
                                    repeat: Infinity,
                                    delay: b * 0.15,
                                    ease: "easeInOut",
                                  }}
                                  className="w-0.5 rounded-full bg-[#C8694A]"
                                />
                              ))}
                            </span>
                            <span>
                              {t.workspace.listeningIn}{" "}
                              {LANGUAGE_META_MAP[languageCode]?.nativeName ||
                                "English"}
                              …{" "}
                              {interimTranscript
                                ? `“${interimTranscript}”`
                                : t.workspace.speakClearlyHint}
                            </span>
                          </span>
                        ) : isTranscribingAudio ? (
                          <span className="text-[#1F4E4A] dark:text-[#8CE0C0] font-medium">
                            {t.workspace.transcribingStatus}
                          </span>
                        ) : (
                          <span className="text-[12px] text-[#5B6B67]/80 dark:text-[#9EB0AC]/80">
                            <span className="sm:hidden">
                              {t.workspace.mobileVoiceHint}
                            </span>
                            <span className="hidden sm:inline">
                              {t.workspace.desktopVoiceHint}
                            </span>
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleToggleVoiceDictation}
                        disabled={isTranscribingAudio}
                        title={
                          isDictating
                            ? t.workspace.stopDictation
                            : t.workspace.dictateByVoice
                        }
                        aria-label={
                          isDictating
                            ? t.workspace.stopDictation
                            : t.workspace.dictateByVoice
                        }
                        className={`pointer-events-auto inline-flex items-center justify-center w-9.5 h-9.5 sm:w-8 sm:h-8 rounded-full border transition-all cursor-pointer shrink-0 ${
                          isDictating
                            ? "bg-[#C8694A] text-white border-[#C8694A] shadow-xs"
                            : "bg-white/90 dark:bg-[#162522] text-[#1F4E4A] dark:text-[#8CE0C0] border-[#E6DFD2] dark:border-[#263D38] hover:border-[#1F4E4A]"
                        }`}
                      >
                        {isDictating ? (
                          <Square
                            className="w-3.5 h-3.5 fill-current"
                            strokeWidth={1.5}
                          />
                        ) : (
                          <Mic className="w-4 h-4" strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gentle Error Banner with Retry */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  role="alert"
                  className="p-4 rounded-2xl bg-[#D9776B]/12 border border-[#D9776B]/40 text-[#963E34] dark:text-[#F2A69D] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      className="w-5 h-5 text-[#C8694A] shrink-0 mt-0.5"
                      strokeWidth={1.5}
                    />
                    <p className="text-sm leading-relaxed">{errorMessage}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    className="btn-calm-lift self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white dark:bg-[#162522] border border-[#D9776B]/40 text-xs font-medium text-[#963E34] dark:text-[#F2A69D] shrink-0 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>{t.workspace.tryAgainBtn}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Privacy Note + Primary Action */}
            <div className="relative overflow-hidden mt-2 p-3.5 sm:px-5 sm:py-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/60 dark:bg-[#162725]/60 backdrop-blur-xl border border-white/75 dark:border-white/15 shadow-[0_8px_28px_-6px_rgba(31,78,74,0.08),inset_0_1px_1.5px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(255,255,255,0.35)] dark:shadow-[0_8px_28px_-6px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.16)] before:content-[''] before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-br before:from-white/95 before:via-white/40 before:to-white/15 dark:before:from-white/25 dark:before:via-white/10 dark:before:to-white/5 before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[mask-composite:exclude]">
              <div className="relative z-10 flex items-center gap-2 text-xs text-[#5B6B67] dark:text-[#9EB0AC] min-w-0">
                <ShieldCheck
                  className="w-4 h-4 text-[#5E9C84] shrink-0"
                  strokeWidth={1.5}
                />
                <span>{t.workspace.sessionPrivacyNote}</span>
              </div>

              <motion.button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading}
                initial="rest"
                whileHover={prefersReducedMotion || isLoading ? "rest" : "hover"}
                whileTap={prefersReducedMotion || isLoading ? "rest" : "tap"}
                animate="rest"
                variants={{
                  rest: {
                    scale: 1,
                    y: 0,
                    transition: { duration: 0.35, ease: CALM_EASE },
                  },
                  hover: {
                    scale: 1.02,
                    y: -1.5,
                    transition: { duration: 0.35, ease: CALM_EASE },
                  },
                  tap: {
                    scale: 0.985,
                    y: 0,
                    transition: { duration: 0.15, ease: CALM_EASE },
                  },
                }}
                className="group btn-primary-teal relative z-10 w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full disabled:opacity-60 font-medium text-[16px] cursor-pointer disabled:cursor-not-allowed whitespace-nowrap shrink-0 backdrop-blur-md border border-white/25 shadow-[0_8px_20px_-4px_rgba(31,78,74,0.35),inset_0_1px_1px_rgba(255,255,255,0.35)]"
              >
                <motion.span
                  variants={{
                    rest: {
                      scale: 1,
                      rotate: 0,
                      transition: { duration: 0.4, ease: CALM_EASE },
                    },
                    hover: {
                      scale: [1, 1.18, 1.05, 1.24, 1],
                      rotate: [0, 15, -10, 20, 0],
                      transition: {
                        duration: 1.35,
                        times: [0, 0.28, 0.55, 0.78, 1],
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    },
                    tap: {
                      scale: 0.92,
                      rotate: -12,
                      transition: { duration: 0.15, ease: CALM_EASE },
                    },
                  }}
                  className="Sparkles w-4 h-4 strokeWidth-1.5 inline-flex items-center justify-center shrink-0 origin-center"
                >
                  <Sparkles
                    className="sparkles-icon w-4 h-4 origin-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-12 group-hover:scale-110"
                    strokeWidth={1.5}
                  />
                </motion.span>
                <span>
                  {isLoading
                    ? t.workspace.readingCarefullyBtn
                    : t.workspace.explainInPlainWordsBtn}
                </span>
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Session History Section (Last 3 results in browser localStorage + keyword search) */}
        <motion.section
          id="session-history"
          aria-label={t.history.title}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.65, ease: CALM_EASE }}
          className="py-4 sm:py-6 px-4 sm:px-8 max-w-4xl mx-auto no-print"
        >
          <div className="clinic-card p-5 sm:p-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <Clock
                  className="w-4 h-4 text-[#1F4E4A] dark:text-[#8CE0C0] shrink-0"
                  strokeWidth={1.5}
                />
                <div className="min-w-0">
                  <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#1E2A28] dark:text-[#EAE6DF]">
                    {t.history.title}
                  </h2>
                  <p className="text-xs text-[#5B6B67] dark:text-[#9EB0AC]">
                    {t.history.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative flex-1 sm:w-64">
                  <Search
                    className="w-3.5 h-3.5 text-[#5B6B67] dark:text-[#9EB0AC] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <input
                    id="session-history-search"
                    type="search"
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    placeholder={t.history.searchPlaceholder}
                    aria-label={t.history.searchPlaceholder}
                    className="w-full rounded-full bg-[#FAF7F2] dark:bg-[#111C1A] border border-[#E6DFD2] dark:border-[#263D38] pl-9 pr-8 py-1.5 text-xs sm:text-sm text-[#1E2A28] dark:text-[#EAE6DF] placeholder:text-[#5B6B67]/65"
                  />
                  {historySearchQuery && (
                    <button
                      type="button"
                      onClick={() => setHistorySearchQuery("")}
                      aria-label="Clear search query"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#5B6B67] hover:text-[#1E2A28] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  )}
                </div>

                {sessionHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="btn-calm-lift inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] dark:bg-[#111C1A] border border-[#E6DFD2] dark:border-[#263D38] text-xs font-medium text-[#C8694A] cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>{t.history.clearHistory}</span>
                  </button>
                )}
              </div>
            </div>

            {sessionHistory.length === 0 ? (
              <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F2]/85 dark:bg-[#111C1A] border border-[#E6DFD2] dark:border-[#263D38] flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <div className="w-28 h-21 sm:w-32 sm:h-24 shrink-0 rounded-xl overflow-hidden border border-[#E6DFD2] dark:border-[#263D38] bg-[#FAF7F2] shadow-xs">
                  <img
                    src={BOTANICAL_HISTORY_IMAGE_DATA_URI}
                    alt="Minimalist hand-drawn botanical sprig illustration representing a calm reading shelf"
                    decoding="async"
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
                <div className="space-y-1.5 min-w-0">
                  <p className="font-serif text-base sm:text-lg text-[#1E2A28] dark:text-[#EAE6DF]">
                    {t.history.emptyTitle}
                  </p>
                  <p className="text-xs sm:text-sm text-[#5B6B67] dark:text-[#9EB0AC] leading-relaxed max-w-xl">
                    {t.history.emptyBody}
                  </p>
                </div>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="p-4 rounded-2xl bg-[#FAF7F2]/80 dark:bg-[#111C1A] border border-[#E6DFD2] dark:border-[#263D38] text-xs sm:text-sm text-[#5B6B67] dark:text-[#9EB0AC] flex flex-wrap items-center justify-between gap-3">
                <span>
                  {t.history.noMatchesPrefix} &ldquo;{historySearchQuery}&rdquo;.
                </span>
                <button
                  type="button"
                  onClick={() => setHistorySearchQuery("")}
                  className="text-xs font-medium text-[#1F4E4A] dark:text-[#8CE0C0] underline underline-offset-4 cursor-pointer"
                >
                  {t.history.resetFilter}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {filteredHistory.map((entry, idx) => {
                  const isSelected = activeHistoryId === entry.id;
                  const entryScore =
                    typeof entry.result.confidenceScore === "number"
                      ? entry.result.confidenceScore
                      : 96;
                  const modeLabel =
                    entry.mode === "prescription"
                      ? t.history.modePrescription
                      : entry.mode === "upload"
                      ? t.history.modeUpload
                      : t.history.modeLab;

                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => handleSelectHistoryEntry(entry)}
                      className={`btn-calm-lift text-left p-4 rounded-[20px] border cursor-pointer flex flex-col justify-between gap-3 min-w-0 ${
                        isSelected
                          ? "bg-[#DCE8E2]/65 dark:bg-[#1B332E] border-[#1F4E4A] dark:border-[#8CE0C0]"
                          : "bg-[#FAF7F2]/90 dark:bg-[#111C1A] border-[#E6DFD2] dark:border-[#263D38] hover:border-[#1F4E4A]/50"
                      }`}
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center justify-between gap-2 text-[11px] text-[#5B6B67] dark:text-[#9EB0AC]">
                          <span className="uppercase tracking-[0.1em] font-medium truncate">
                            0{idx + 1} · {modeLabel}
                          </span>
                          <span className="font-mono tabular-nums shrink-0">
                            {entry.timestamp}
                          </span>
                        </div>

                        <h3 className="font-serif text-base font-medium text-[#1E2A28] dark:text-[#EAE6DF] line-clamp-1">
                          {entry.title}
                        </h3>

                        <p className="text-xs text-[#5B6B67] dark:text-[#9EB0AC] line-clamp-2 leading-relaxed">
                          {entry.result.summary}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#E6DFD2] dark:border-[#263D38] flex items-center justify-between gap-2 text-[11px] text-[#1F4E4A] dark:text-[#8CE0C0] font-medium">
                        <span className="truncate">
                          {entry.result.items?.length || 0} {t.history.itemsLabel} ·{" "}
                          {entry.language}
                        </span>
                        <span className="font-mono tabular-nums shrink-0">
                          {t.history.scoreLabel}: {entryScore}/100
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.section>

        {/* 3. Calm Breathing Loading State (Breathing circle + 2.5s crossfading warm messages) */}
        <AnimatePresence>
          {isLoading && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: CALM_EASE }}
              aria-live="polite"
              className="py-12 px-4 sm:px-8 max-w-xl mx-auto text-center no-print"
            >
              <div className="clinic-card p-8 sm:p-11 space-y-7">
                {/* Calm Multi-Ring Breathing Circle with Floating Leaf */}
                <div
                  className="relative w-28 h-28 mx-auto flex items-center justify-center"
                  aria-hidden="true"
                >
                  <motion.div
                    animate={
                      prefersReducedMotion
                        ? { scale: 1, opacity: 0.25 }
                        : {
                            scale: [0.8, 1.45, 0.8],
                            opacity: [0.15, 0.45, 0.15],
                          }
                    }
                    transition={{
                      duration: 4.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full border border-[#1F4E4A]/25 dark:border-[#8CE0C0]/25 bg-[#DCE8E2]/45 dark:bg-[#23453F]/40"
                  />
                  <motion.div
                    animate={
                      prefersReducedMotion
                        ? { scale: 1, opacity: 0.5 }
                        : {
                            scale: [0.88, 1.24, 0.88],
                            opacity: [0.35, 0.75, 0.35],
                          }
                    }
                    transition={{
                      duration: 4.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.35,
                    }}
                    className="absolute inset-2 rounded-full bg-[#DCE8E2] dark:bg-[#23453F]"
                  />
                  <motion.div
                    animate={
                      prefersReducedMotion
                        ? { scale: 1 }
                        : {
                            scale: [0.94, 1.1, 0.94],
                            rotate: [-4, 4, -4],
                          }
                    }
                    transition={{
                      duration: 4.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative w-13 h-13 rounded-full bg-[#1F4E4A] dark:bg-[#8CE0C0] flex items-center justify-center shadow-sm text-[#FAF7F2] dark:text-[#111C1A]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-5 h-5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3.2C7.6 7.1 6.2 11.6 7.7 15.6C9 19 12 20.8 12 20.8C12 20.8 15 19 16.3 15.6C17.8 11.6 16.4 7.1 12 3.2Z" />
                      <path d="M12 20.8V9.5" />
                    </svg>
                  </motion.div>
                </div>

                {/* Crossfading warm messages every 2.5 seconds + subtle animated progress bar */}
                <div className="space-y-3 min-h-[4.8rem] flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={loadingStep}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.45, ease: CALM_EASE }}
                      className="font-serif text-xl sm:text-2xl font-normal text-[#1E2A28] dark:text-[#EAE6DF]"
                    >
                      {t.loading.messages[loadingStep] ||
                        t.loading.messages[0]}
                    </motion.p>
                  </AnimatePresence>
                  <p className="text-xs sm:text-sm text-[#5B6B67] dark:text-[#9EB0AC]">
                    {t.loading.preparingInLanguage.replace(
                      "{language}",
                      LANGUAGE_META_MAP[languageCode]?.nativeName || "English"
                    )}
                  </p>
                  <div className="w-44 h-1.5 mx-auto rounded-full bg-[#EFEAE0] dark:bg-[#162522] overflow-hidden">
                    <motion.div
                      animate={
                        prefersReducedMotion
                          ? { x: "0%" }
                          : { x: ["-100%", "100%"] }
                      }
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="h-full w-1/2 rounded-full bg-[#5E9C84]"
                    />
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* 4. Results Section */}
        {result && !isLoading && (
          <section
            ref={resultsRef}
            aria-label="Report explanation results"
            className="py-10 px-4 sm:px-8 max-w-5xl mx-auto space-y-9"
          >
            {/* High-Level ItemStatus Count Badges Summary Bar */}
            {result.items && result.items.length > 0 && (() => {
              const normalCount = result.items.filter(
                (i) => i.status === "normal"
              ).length;
              const slightlyHighCount = result.items.filter(
                (i) => i.status === "slightly_high"
              ).length;
              const slightlyLowCount = result.items.filter(
                (i) => i.status === "slightly_low"
              ).length;
              const discussSoonCount = result.items.filter(
                (i) => i.status === "discuss_soon"
              ).length;
              const attentionCount =
                slightlyHighCount + slightlyLowCount + discussSoonCount;

              const statusBadges: Array<{
                key: string;
                count: number;
                label: string;
                subLabel?: string;
                filterTarget: "all" | "normal" | "attention";
                Icon: typeof CheckCircle2;
                surfaceClass: string;
                borderClass: string;
                textClass: string;
                dotClass: string;
              }> = [
                {
                  key: "normal",
                  count: normalCount,
                  label: t.results.statusNormal,
                  subLabel: languageCode !== "en" ? "Normal" : undefined,
                  filterTarget: "normal",
                  Icon: CheckCircle2,
                  surfaceClass: "bg-[#5E9C84]/14 dark:bg-[#5E9C84]/20",
                  borderClass: "border-[#5E9C84]/35 dark:border-[#5E9C84]/45",
                  textClass: "text-[#2A634E] dark:text-[#8ED0B5]",
                  dotClass: "bg-[#5E9C84]",
                },
                {
                  key: "attention_total",
                  count: attentionCount,
                  label:
                    languageCode === "en"
                      ? "Attention Needed"
                      : t.results.filterOutsideRange,
                  subLabel:
                    languageCode !== "en" ? "Attention Needed" : undefined,
                  filterTarget: "attention",
                  Icon: AlertCircle,
                  surfaceClass:
                    attentionCount > 0
                      ? "bg-[#C8694A]/14 dark:bg-[#C8694A]/22"
                      : "bg-[#FAF7F2] dark:bg-[#111C1A]",
                  borderClass:
                    attentionCount > 0
                      ? "border-[#C8694A]/40 dark:border-[#E07E5E]/45"
                      : "border-[#E6DFD2] dark:border-[#263D38]",
                  textClass:
                    attentionCount > 0
                      ? "text-[#963E34] dark:text-[#F2A69D]"
                      : "text-[#5B6B67] dark:text-[#9EB0AC]",
                  dotClass:
                    attentionCount > 0 ? "bg-[#C8694A]" : "bg-[#5B6B67]/40",
                },
                {
                  key: "slightly_high",
                  count: slightlyHighCount,
                  label: t.results.statusSlightlyHigh,
                  filterTarget: "attention",
                  Icon: ArrowUpRight,
                  surfaceClass: "bg-[#D9A441]/15 dark:bg-[#D9A441]/20",
                  borderClass: "border-[#D9A441]/40 dark:border-[#D9A441]/45",
                  textClass: "text-[#8A5B13] dark:text-[#F0C675]",
                  dotClass: "bg-[#D9A441]",
                },
                {
                  key: "slightly_low",
                  count: slightlyLowCount,
                  label: t.results.statusSlightlyLow,
                  filterTarget: "attention",
                  Icon: ArrowDownRight,
                  surfaceClass: "bg-[#D9A441]/15 dark:bg-[#D9A441]/20",
                  borderClass: "border-[#D9A441]/40 dark:border-[#D9A441]/45",
                  textClass: "text-[#8A5B13] dark:text-[#F0C675]",
                  dotClass: "bg-[#D9A441]",
                },
                {
                  key: "discuss_soon",
                  count: discussSoonCount,
                  label: t.results.statusDiscussSoon,
                  filterTarget: "attention",
                  Icon: HelpCircle,
                  surfaceClass: "bg-[#D9776B]/15 dark:bg-[#D9776B]/20",
                  borderClass: "border-[#D9776B]/40 dark:border-[#D9776B]/45",
                  textClass: "text-[#963E34] dark:text-[#F2A69D]",
                  dotClass: "bg-[#D9776B]",
                },
              ];

              return (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: CALM_EASE }}
                  role="region"
                  aria-label="Health status overview summary"
                  className="clinic-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 print-only-border"
                >
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#1F4E4A] dark:bg-[#8CE0C0]" />
                    <span className="text-xs font-semibold uppercase tracking-[0.13em] text-[#1F4E4A] dark:text-[#8CE0C0]">
                      {t.results.atAGlance} · {result.items.length}{" "}
                      {t.history.itemsLabel}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {statusBadges.map((badge) => {
                      const BadgeIcon = badge.Icon;
                      return (
                        <button
                          key={badge.key}
                          type="button"
                          onClick={() => {
                            setItemStatusFilter(badge.filterTarget);
                            itemsBreakdownRef.current?.scrollIntoView({
                              behavior: "smooth",
                            });
                          }}
                          className={`btn-calm-lift inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${badge.surfaceClass} ${badge.borderClass} ${badge.textClass} text-xs font-medium cursor-pointer transition-opacity ${
                            badge.count === 0 ? "opacity-60" : "opacity-100"
                          }`}
                        >
                          <BadgeIcon
                            className="w-3.5 h-3.5 shrink-0"
                            strokeWidth={1.6}
                            aria-hidden="true"
                          />
                          <span className="font-mono font-semibold tabular-nums">
                            {badge.count}
                          </span>
                          <span>{badge.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })()}

            {/* Gentle Urgent Attention Banner (when urgentFlag is true) */}
            {result.urgentFlag && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: CALM_EASE }}
                role="status"
                className="p-5 sm:p-6 rounded-[24px] bg-[#D9776B]/14 border border-[#D9776B]/45 text-[#963E34] dark:text-[#F2A69D] flex items-start gap-4 print-only-border"
              >
                <AlertCircle
                  className="w-5 h-5 text-[#C8694A] shrink-0 mt-0.5"
                  strokeWidth={1.5}
                />
                <div className="space-y-1 min-w-0">
                  <h2 className="font-serif text-lg font-medium text-[#963E34] dark:text-[#F2A69D]">
                    {t.results.urgentBannerTitle}
                  </h2>
                  <p className="text-sm sm:text-base leading-relaxed">
                    {t.results.urgentBannerBody}
                  </p>
                </div>
              </motion.div>
            )}

            {/* At a Glance Summary Card in Soft Sage (#DCE8E2) + AI Result Clarity Score Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: CALM_EASE }}
                className="lg:col-span-8 clinic-sage-card p-5 sm:p-8 flex flex-col justify-between space-y-5 print-only-border min-w-0"
              >
                <div className="space-y-3 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.14em] text-[#1F4E4A] dark:text-[#8CE0C0] font-semibold">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <span>{t.results.atAGlance}</span>
                      {activeProfileSummaryParts.map((part) => (
                        <React.Fragment key={part}>
                          <span aria-hidden="true">·</span>
                          <span className="normal-case tracking-normal font-medium">
                            {part}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                    <span>
                      {t.results.languageLabel}:{" "}
                      {LANGUAGE_META_MAP[languageCode]?.nativeName || "English"}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1E2A28] dark:text-[#EAE6DF] break-words">
                    {userProfile.name.trim()
                      ? t.results.reassuranceHeaderWithName.replace(
                          "{name}",
                          userProfile.name.trim()
                        )
                      : t.results.reassuranceHeaderDefault}
                  </h2>
                  <p className="text-base sm:text-[18px] text-[#1E2A28] dark:text-[#EAE6DF] leading-[1.7] break-words">
                    {result.summary}
                  </p>
                </div>

                {/* Quick Mobile & Desktop Share + Download PDF + Jump Actions */}
                <div className="pt-3 border-t border-[#1F4E4A]/12 dark:border-[#8CE0C0]/15 flex flex-wrap items-center justify-between gap-3 no-print">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      className="btn-primary-teal inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-full text-xs sm:text-sm font-medium cursor-pointer"
                    >
                      {downloadedPdfSuccess ? (
                        <>
                          <Check className="w-4 h-4" strokeWidth={1.75} />
                          <span>PDF Downloaded</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" strokeWidth={1.5} />
                          <span>Download PDF</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleShareResults}
                      className="btn-calm-lift inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-full bg-[#FAF7F2]/90 dark:bg-[#111C1A] border border-[#1F4E4A]/15 dark:border-[#8CE0C0]/25 text-xs sm:text-sm font-medium text-[#1F4E4A] dark:text-[#8CE0C0] cursor-pointer"
                    >
                      {sharedSummarySuccess ? (
                        <>
                          <Check className="w-4 h-4 text-[#5E9C84]" strokeWidth={1.75} />
                          <span className="text-[#5E9C84]">{t.results.shareReady}</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" strokeWidth={1.5} />
                          <span>{t.results.shareWithFamily}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {result.doctorQuestions?.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        doctorChecklistRef.current?.scrollIntoView({
                          behavior: "smooth",
                        })
                      }
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#1F4E4A] dark:text-[#8CE0C0] hover:text-[#C8694A] transition-colors cursor-pointer py-1.5"
                    >
                      <span>
                        {t.results.seeDoctorQuestionsCount.replace(
                          "{count}",
                          String(result.doctorQuestions.length)
                        )}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              </motion.div>

              {/* AI Result Clarity Score out of 100 with animated Radial Ring Gauge */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08, ease: CALM_EASE }}
                aria-label="AI reading clarity and confidence score out of 100"
                className="lg:col-span-4 clinic-card p-5 sm:p-7 flex flex-col justify-between space-y-4 print-only-border min-w-0"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5B6B67] dark:text-[#9EB0AC]">
                      {t.results.clarityScoreTitle}
                    </span>
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.2, ease: CALM_EASE }}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${confidenceMeta.chipBg} ${confidenceMeta.chipBorder} ${confidenceMeta.textClass} text-xs font-medium`}
                    >
                      <ConfidenceIcon
                        className="w-3.5 h-3.5 shrink-0"
                        strokeWidth={1.5}
                      />
                      <span>{t.results.verifiedBadge}</span>
                    </motion.div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-4xl sm:text-5xl font-medium text-[#1F4E4A] dark:text-[#8CE0C0]">
                        <AnimatedValue
                          value={String(scoreValue)}
                          reducedMotion={prefersReducedMotion}
                        />
                      </span>
                      <span className="font-mono tabular-nums text-base text-[#5B6B67] dark:text-[#9EB0AC]">
                        / 100
                      </span>
                    </div>

                    {/* Radial SVG Circular Progress Gauge */}
                    <div
                      className="relative w-14 h-14 shrink-0"
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 56 56"
                        className="w-full h-full -rotate-90"
                      >
                        <circle
                          cx="28"
                          cy="28"
                          r="22"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4.5"
                          className="text-[#EFEAE0] dark:text-[#1B332E]"
                        />
                        <motion.circle
                          cx="28"
                          cy="28"
                          r="22"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4.5"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 22}
                          initial={{
                            strokeDashoffset: prefersReducedMotion
                              ? 2 * Math.PI * 22 * (1 - scoreValue / 100)
                              : 2 * Math.PI * 22,
                          }}
                          animate={{
                            strokeDashoffset:
                              2 * Math.PI * 22 * (1 - scoreValue / 100),
                          }}
                          transition={{
                            duration: 0.95,
                            delay: 0.2,
                            ease: CALM_EASE,
                          }}
                          className="text-[#5E9C84]"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-medium text-[#1F4E4A] dark:text-[#8CE0C0]">
                        {scoreValue}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="relative h-2.5 w-full bg-[#EFEAE0] dark:bg-[#111C1A] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: scoreValue / 100 }}
                        transition={{ duration: 0.75, ease: CALM_EASE }}
                        className={`h-full w-full origin-left rounded-full ${confidenceMeta.barClass}`}
                      />
                    </div>
                    <p className={`text-xs font-medium ${confidenceMeta.textClass}`}>
                      {confidenceMeta.label}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#5B6B67] dark:text-[#9EB0AC] leading-relaxed pt-2 border-t border-[#E6DFD2] dark:border-[#263D38]">
                  {result.confidenceNote || t.results.defaultConfidenceNote}
                </p>
              </motion.div>
            </div>

            {/* Responsive Grid of Item Cards (80ms stagger, spring range markers, count-up numbers, status chip pop) */}
            {result.items.length > 0 && (
              <div ref={itemsBreakdownRef} className="space-y-5 scroll-mt-24">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div className="space-y-1">
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1E2A28] dark:text-[#EAE6DF]">
                      {t.results.itemByItemTitle}
                    </h2>
                    <p className="text-xs text-[#5B6B67] dark:text-[#9EB0AC]">
                      {t.results.showingItemsCount.replace(
                        "{count}",
                        String(result.items.length)
                      )}{" "}
                      · {t.results.rangesVaryNote}
                    </p>
                  </div>

                  {/* Mobile-Friendly Horizontal Filter Strip for Quick Scanning */}
                  {result.items.length > 1 && (
                    <div
                      role="group"
                      aria-label="Filter items by status"
                      className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 no-print"
                    >
                      {[
                        {
                          id: "all" as const,
                          label: `${t.results.filterAll} (${result.items.length})`,
                        },
                        {
                          id: "attention" as const,
                          label: `${t.results.filterOutsideRange} (${
                            result.items.filter((i) => i.status !== "normal")
                              .length
                          })`,
                        },
                        {
                          id: "normal" as const,
                          label: `${t.results.filterTypical} (${
                            result.items.filter((i) => i.status === "normal")
                              .length
                          })`,
                        },
                      ].map((tab) => {
                        const active = itemStatusFilter === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setItemStatusFilter(tab.id)}
                            className={`px-3.5 py-1.5 min-h-[36px] rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer border ${
                              active
                                ? "bg-[#1F4E4A] text-[#FAF7F2] border-[#1F4E4A]"
                                : "bg-white/80 dark:bg-[#162522] text-[#5B6B67] dark:text-[#9EB0AC] border-[#E6DFD2] dark:border-[#263D38] hover:text-[#1E2A28]"
                            }`}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {result.items
                    .filter((item) => {
                      if (itemStatusFilter === "attention") {
                        return item.status !== "normal";
                      }
                      if (itemStatusFilter === "normal") {
                        return item.status === "normal";
                      }
                      return true;
                    })
                    .map((item, idx) => {
                      const meta = getStatusMeta(item.status, item.type, t);
                      const StatusIcon = meta.Icon;
                      const markerPct = computeMarkerPercentage(item);
                      const drift = getCardDriftMotion(item.name, idx);

                      return (
                        <motion.div
                          key={`${item.name}-${idx}`}
                          initial={
                            prefersReducedMotion
                              ? false
                              : {
                                  opacity: 0,
                                  x: drift.initialX,
                                  y: drift.initialY,
                                  rotate: drift.initialRotate,
                                  scale: 0.97,
                                }
                          }
                          animate={{
                            opacity: 1,
                            x: 0,
                            y: 0,
                            rotate: 0,
                            scale: 1,
                          }}
                          transition={{
                            duration: drift.entryDuration,
                            delay: drift.entryDelay,
                            ease: CALM_EASE,
                          }}
                          className="h-full min-w-0"
                        >
                          <motion.article
                            animate={
                              prefersReducedMotion
                                ? { x: 0, y: 0, rotate: 0 }
                                : {
                                    x: [0, drift.floatX, 0],
                                    y: [0, -drift.floatY, 0],
                                    rotate: [0, drift.floatRotate, 0],
                                  }
                            }
                            transition={
                              prefersReducedMotion
                                ? { duration: 0 }
                                : {
                                    duration: drift.floatDuration,
                                    delay: drift.floatDelay,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  }
                            }
                            whileHover={
                              prefersReducedMotion
                                ? undefined
                                : {
                                    y: -5,
                                    rotate: 0,
                                    scale: 1.01,
                                    transition: {
                                      duration: 0.28,
                                      ease: CALM_EASE,
                                    },
                                  }
                            }
                            className="h-full clinic-card clinic-card-hover p-6 sm:p-7 flex flex-col justify-between space-y-4 print-only-border min-w-0"
                          >
                            <div className="space-y-4 min-w-0">
                              {/* Top Row: Name in serif, Value large + Status chip with icon & text label */}
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-serif text-xl sm:text-[22px] font-normal text-[#1E2A28] dark:text-[#EAE6DF] leading-snug break-words">
                                    {item.name}
                                  </h3>
                                  {item.value && (
                                    <div className="mt-1.5 flex items-baseline gap-1.5 flex-wrap">
                                      <span className="font-serif text-2xl sm:text-3xl font-medium text-[#1F4E4A] dark:text-[#8CE0C0]">
                                        <AnimatedValue
                                          value={item.value}
                                          reducedMotion={prefersReducedMotion}
                                        />
                                      </span>
                                      {item.unit && (
                                        <span className="text-xs text-[#5B6B67] dark:text-[#9EB0AC] font-mono">
                                          {item.unit}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Accessible Status Chip: pops in with a tiny scale */}
                                <motion.div
                                  initial={
                                    prefersReducedMotion
                                      ? false
                                      : { scale: 0.88, opacity: 0 }
                                  }
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{
                                    duration: 0.4,
                                    delay: idx * 0.08 + 0.15,
                                    ease: CALM_EASE,
                                  }}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${meta.surfaceColor} ${meta.borderColor} ${meta.textColor} text-xs font-medium shrink-0`}
                                >
                                  <StatusIcon
                                    className="w-3.5 h-3.5 shrink-0"
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                  />
                                  <span>{meta.label}</span>
                                </motion.div>
                              </div>

                              {/* Lab Reference Range + Visual Range Bar with Spring Marker from Left */}
                              {item.type === "lab" && (
                                <div className="pt-2.5 pb-1.5 border-y border-[#E6DFD2] dark:border-[#263D38] space-y-2">
                                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5B6B67] dark:text-[#9EB0AC]">
                                    <span>{t.results.typicalRefRange}</span>
                                    <span className="font-mono tabular-nums font-medium text-[#1E2A28] dark:text-[#EAE6DF]">
                                      {item.referenceRange || t.results.checkLabPrintout}
                                    </span>
                                  </div>

                                  <div
                                    className="relative h-2.5 w-full bg-[#EFEAE0] dark:bg-[#111C1A] rounded-full overflow-hidden"
                                    role="img"
                                    aria-label={`Visual range indicator for ${item.name}: ${meta.label}`}
                                  >
                                    <div
                                      className="absolute top-0 bottom-0 left-[25%] right-[25%] bg-[#DCE8E2] dark:bg-[#24423B]"
                                      aria-hidden="true"
                                    />
                                    <motion.div
                                      initial={
                                        prefersReducedMotion
                                          ? { left: `${markerPct}%` }
                                          : { left: "0%" }
                                      }
                                      animate={{ left: `${markerPct}%` }}
                                      transition={{
                                        type: "spring",
                                        stiffness: 85,
                                        damping: 17,
                                        delay: idx * 0.08 + 0.12,
                                      }}
                                      className={`absolute top-0 bottom-0 w-3 rounded-full -translate-x-1/2 ${meta.barColor} shadow-xs flex items-center justify-center`}
                                      aria-hidden="true"
                                    >
                                      {!prefersReducedMotion && (
                                        <motion.span
                                          animate={{
                                            scale: [1, 1.85, 1],
                                            opacity: [0.5, 0, 0.5],
                                          }}
                                          transition={{
                                            duration: 2.8,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: idx * 0.12,
                                          }}
                                          className={`w-full h-full rounded-full ${meta.barColor}`}
                                        />
                                      )}
                                    </motion.div>
                                  </div>

                                  <div className="flex justify-between text-[11px] text-[#5B6B67] dark:text-[#9EB0AC]">
                                    <span>{t.hero.lower}</span>
                                    <span>{t.hero.typicalRange}</span>
                                    <span>{t.hero.higher}</span>
                                  </div>
                                </div>
                              )}

                              {/* Medicine Usage & Purpose */}
                              {item.type === "medicine" && (
                                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#111C1A] border border-[#E6DFD2] dark:border-[#263D38] space-y-1.5 text-xs sm:text-sm">
                                  {item.referenceRange && (
                                    <p className="text-[#1E2A28] dark:text-[#EAE6DF]">
                                      <span className="font-semibold text-[#1F4E4A] dark:text-[#8CE0C0]">
                                        {t.results.generallyUsedFor}:{" "}
                                      </span>
                                      {item.referenceRange}
                                    </p>
                                  )}
                                  {item.usage && (
                                    <p className="text-[#1E2A28] dark:text-[#EAE6DF]">
                                      <span className="font-semibold text-[#1F4E4A] dark:text-[#8CE0C0]">
                                        {t.results.howItIsWritten}:{" "}
                                      </span>
                                      {item.usage}
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* Plain Language Explanation */}
                              <p className="text-[15.5px] text-[#1E2A28] dark:text-[#DCE6E3] leading-[1.7] break-words">
                                {item.explanation}
                              </p>
                            </div>

                            {item.type === "medicine" && (
                              <p className="text-xs text-[#5B6B67] dark:text-[#9EB0AC] pt-2 border-t border-[#E6DFD2] dark:border-[#263D38]">
                                {t.results.medicineSafetyFooter}
                              </p>
                            )}
                          </motion.article>
                        </motion.div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 3 Simple, Non-Medical Lifestyle Tips with staggered entrance & hover lift */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: CALM_EASE }}
              className="clinic-card p-6 sm:p-8 space-y-5 print-only-border"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E6DFD2] dark:border-[#263D38] pb-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#C8694A]">
                    {t.results.everydayWellbeingKicker}
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1E2A28] dark:text-[#EAE6DF]">
                    {t.results.lifestyleTipsTitle}
                  </h2>
                </div>
                <span className="text-xs text-[#5B6B67] dark:text-[#9EB0AC]">
                  {t.results.gentleDailyHabitsNote}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(result.lifestyleTips && result.lifestyleTips.length > 0
                  ? result.lifestyleTips.slice(0, 3)
                  : t.results.defaultLifestyleTips
                ).map((tip, idx) => (
                  <motion.div
                    key={idx}
                    initial={
                      prefersReducedMotion ? false : { opacity: 0, y: 14 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.18 + idx * 0.09,
                      ease: CALM_EASE,
                    }}
                    whileHover={
                      prefersReducedMotion ? undefined : { y: -4 }
                    }
                    className="bg-[#FAF7F2]/90 dark:bg-[#111C1A] border border-[#E6DFD2] dark:border-[#263D38] rounded-[20px] p-5 flex flex-col justify-between space-y-3 transition-shadow hover:shadow-md min-w-0"
                  >
                    <span className="font-serif text-lg text-[#C8694A]">
                      0{idx + 1}.
                    </span>
                    <p className="text-[15px] text-[#1E2A28] dark:text-[#EAE6DF] leading-[1.65] break-words">
                      {tip}
                    </p>
                  </motion.div>
                ))}
              </div>

              <p className="text-xs text-[#5B6B67] dark:text-[#9EB0AC]">
                {t.results.lifestyleDisclaimer}
              </p>
            </motion.div>

            {/* Questions to Ask Your Doctor: Styled like a handwritten checklist on a lined paper card */}
            {result.doctorQuestions?.length > 0 && (
              <motion.div
                ref={doctorChecklistRef}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.22, ease: CALM_EASE }}
                className="paper-checklist-card relative overflow-hidden p-5 sm:p-9 space-y-6 scroll-mt-24 print-only-border"
              >
                {/* Faint notebook left margin line on desktop */}
                <div
                  aria-hidden="true"
                  className="hidden sm:block absolute top-0 bottom-0 left-12 w-px bg-[#C8694A]/20 pointer-events-none"
                />

                <div className="sm:pl-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DFD2] dark:border-[#263D38] pb-5">
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C8694A]">
                      {t.results.visitChecklistKicker}
                    </p>
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1E2A28] dark:text-[#EAE6DF]">
                      {t.results.questionsForDoctorTitle}
                    </h2>
                    <p className="text-sm text-[#5B6B67] dark:text-[#9EB0AC]">
                      {t.results.questionsSubtitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 no-print">
                    {/* Copy button morphs to a checkmark with "Copied" for 2 seconds */}
                    <button
                      type="button"
                      onClick={handleCopyQuestions}
                      className="btn-calm-lift flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2.5 rounded-full bg-[#FAF7F2] dark:bg-[#111C1A] border border-[#E6DFD2] dark:border-[#263D38] text-xs sm:text-sm font-medium text-[#1F4E4A] dark:text-[#8CE0C0] cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {copiedQuestions ? (
                          <motion.span
                            key="copied"
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="inline-flex items-center gap-1.5 text-[#5E9C84]"
                          >
                            <Check className="w-4 h-4" strokeWidth={1.75} />
                            <span>{t.results.copiedBtn}</span>
                          </motion.span>
                        ) : (
                          <motion.span
                            key="copy"
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="inline-flex items-center gap-1.5"
                          >
                            <Copy className="w-4 h-4" strokeWidth={1.5} />
                            <span>{t.results.copyQuestionsBtn}</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      className="btn-primary-teal flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {downloadedPdfSuccess ? (
                        <>
                          <Check className="w-4 h-4" strokeWidth={1.75} />
                          <span>PDF Downloaded</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" strokeWidth={1.5} />
                          <span>Download PDF</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handlePrintOrSavePdf}
                      className="btn-calm-lift flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2.5 rounded-full bg-[#FAF7F2] dark:bg-[#111C1A] border border-[#E6DFD2] dark:border-[#263D38] text-xs sm:text-sm font-medium text-[#1F4E4A] dark:text-[#8CE0C0] cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Printer className="w-4 h-4" strokeWidth={1.5} />
                      <span>{t.results.printSavePdfBtn}</span>
                    </button>
                  </div>
                </div>

                <ol className="sm:pl-8 space-y-3.5">
                  {result.doctorQuestions.map((question, qIdx) => {
                    const isChecked = Boolean(checkedQuestionIndices[qIdx]);
                    return (
                      <motion.li
                        key={qIdx}
                        initial={
                          prefersReducedMotion ? false : { opacity: 0, x: -8 }
                        }
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.24 + qIdx * 0.07,
                          ease: CALM_EASE,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => toggleDoctorQuestionCheck(qIdx)}
                          aria-pressed={isChecked}
                          className="w-full text-left p-3.5 rounded-2xl bg-[#FAF7F2]/85 dark:bg-[#111C1A]/85 hover:bg-[#DCE8E2]/45 dark:hover:bg-[#1B332E]/60 border border-[#E6DFD2] dark:border-[#263D38] flex items-start gap-3.5 text-[15.5px] text-[#1E2A28] dark:text-[#EAE6DF] leading-[1.65] transition-colors cursor-pointer"
                        >
                          {/* Hand-drawn style circle checkbox with spring pop */}
                          <motion.span
                            aria-hidden="true"
                            animate={
                              isChecked
                                ? { scale: [0.8, 1.15, 1] }
                                : { scale: 1 }
                            }
                            transition={{ duration: 0.28, ease: CALM_EASE }}
                            className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                              isChecked
                                ? "bg-[#5E9C84] border-[#5E9C84] text-white"
                                : "border-[#C8694A] bg-white/80 dark:bg-[#162522]"
                            }`}
                          >
                            {isChecked && (
                              <Check className="w-3 h-3" strokeWidth={2} />
                            )}
                          </motion.span>
                          <span
                            className={`break-words ${
                              isChecked
                                ? "line-through text-[#5B6B67] dark:text-[#9EB0AC]"
                                : ""
                            }`}
                          >
                            {question}
                          </span>
                        </button>
                      </motion.li>
                    );
                  })}
                </ol>
              </motion.div>
            )}

            {/* Persistent Disclaimer Inside Results */}
            <div className="p-5 rounded-[20px] bg-[#DCE8E2]/65 dark:bg-[#1B332E] border border-[#1F4E4A]/15 dark:border-[#8CE0C0]/20 text-xs sm:text-sm text-[#1E2A28] dark:text-[#EAE6DF] leading-relaxed space-y-1.5 print-only-border">
              <p>
                <strong className="text-[#1F4E4A] dark:text-[#8CE0C0]">
                  {t.results.importantDisclaimerLabel}
                </strong>{" "}
                {t.results.resultsDisclaimerLine1}
              </p>
              <p>{t.results.resultsDisclaimerLine2}</p>
            </div>
          </section>
        )}

        {/* 4.5. "Ask a Specialist" — Personalised Health Guide Chatbot */}
        <motion.section
          id="ask-specialist"
          ref={specialistSectionRef}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.65, ease: CALM_EASE }}
          className="py-12 sm:py-18 px-3 sm:px-8 border-t border-[#E6DFD2] dark:border-[#263D38] no-print scroll-mt-18"
        >
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 px-1">
              <div className="space-y-1.5 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C8694A] inline-flex items-center gap-2">
                  <MessageCircleHeart className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  <span>{t.chat.sectionKicker}</span>
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1E2A28] dark:text-[#EAE6DF] break-words">
                  {t.chat.sectionTitle}
                </h2>
                <p className="text-sm sm:text-base text-[#5B6B67] dark:text-[#9EB0AC] max-w-2xl leading-relaxed">
                  {t.chat.sectionSubtitle}
                </p>
              </div>
            </div>

            {!isProfileComplete ? (
              /* Kind Locked State when profile is incomplete */
              <div className="clinic-card p-6 sm:p-10 text-center space-y-6 max-w-2xl mx-auto">
                <div className="w-14 h-14 rounded-full bg-[#DCE8E2] dark:bg-[#1B332E] border border-[#1F4E4A]/15 dark:border-[#8CE0C0]/25 text-[#1F4E4A] dark:text-[#8CE0C0] flex items-center justify-center mx-auto shadow-2xs">
                  <Lock className="w-6 h-6" strokeWidth={1.5} />
                </div>

                <div className="space-y-2.5 max-w-lg mx-auto">
                  <h3 className="font-serif text-2xl sm:text-[26px] font-normal text-[#1E2A28] dark:text-[#EAE6DF] leading-snug">
                    {t.chat.lockedTitle}
                  </h3>
                  <p className="text-sm sm:text-[15.5px] text-[#5B6B67] dark:text-[#9EB0AC] leading-relaxed">
                    {t.chat.lockedBody}
                  </p>
                </div>

                {/* Remaining fields indicator */}
                <div className="p-4 rounded-[20px] bg-[#FAF7F2]/90 dark:bg-[#111C1A] border border-[#E6DFD2] dark:border-[#263D38] text-left space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-medium text-[#5B6B67] dark:text-[#9EB0AC]">
                    <span>{t.chat.profileProgressLabel}</span>
                    <span className="font-mono text-[#1F4E4A] dark:text-[#8CE0C0]">
                      {completedProfileCount} / {PROFILE_REQUIRED_FIELDS.length}{" "}
                      {t.chat.completedCountLabel}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#EFEAE0] dark:bg-[#162522] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#1F4E4A] dark:bg-[#5E9C84] transition-all duration-300"
                      style={{
                        width: `${Math.round(
                          (completedProfileCount /
                            PROFILE_REQUIRED_FIELDS.length) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-[#5B6B67] dark:text-[#9EB0AC] leading-relaxed break-words">
                    <span className="font-medium text-[#1E2A28] dark:text-[#EAE6DF]">
                      {t.chat.stillNeededLabel}{" "}
                    </span>
                    {missingProfileFields.map((f) => f.label).join(", ")}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={scrollToProfileForm}
                    className="btn-primary-teal inline-flex items-center justify-center gap-2 min-h-[46px] px-7 py-3 rounded-full text-[15px] font-medium cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                    <span>{t.chat.goToProfileBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserProfile({ ...SAMPLE_COMPLETE_PROFILE })}
                    className="btn-calm-lift inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-3 rounded-full bg-[#DCE8E2]/70 dark:bg-[#1B332E] border border-[#1F4E4A]/15 dark:border-[#8CE0C0]/25 text-xs sm:text-sm font-medium text-[#1F4E4A] dark:text-[#8CE0C0] cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#C8694A] shrink-0" strokeWidth={1.5} />
                    <span>{t.chat.fillSampleProfileBtn}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Full-Height Mobile-First Specialist Chat Screen */
              <div
                lang={languageCode}
                className="clinic-card overflow-hidden flex flex-col min-h-[620px] sm:min-h-[690px] h-[84vh] max-h-[840px] border border-[#E6DFD2] dark:border-[#2C4641]"
              >
                {/* First-Time Consent Line */}
                <div className="px-3.5 sm:px-6 py-2 bg-[#DCE8E2]/55 dark:bg-[#152824] border-b border-[#E6DFD2] dark:border-[#263D38] flex items-center justify-between gap-2 text-[11.5px] sm:text-xs text-[#1F4E4A] dark:text-[#8CE0C0]">
                  <div className="flex items-center gap-2 min-w-0">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[#5E9C84]" strokeWidth={1.75} />
                    <span className="break-words">
                      {t.chat.consentLine}
                    </span>
                  </div>
                  {hasSeenChatConsent && (
                    <span className="hidden sm:inline text-[11px] text-[#5B6B67] dark:text-[#9EB0AC] shrink-0">
                      {t.chat.sessionPrivacyActive}
                    </span>
                  )}
                </div>

                {/* Compact Profile Summary Chip at Top of Chat + Edit Profile Link */}
                <div className="px-3.5 sm:px-6 py-2.5 bg-[#FAF7F2]/90 dark:bg-[#111C1A]/90 border-b border-[#E6DFD2] dark:border-[#263D38] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-[#1E2A28] dark:text-[#EAE6DF] min-w-0">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DCE8E2]/80 dark:bg-[#1B332E] text-[#1F4E4A] dark:text-[#8CE0C0] font-medium">
                      <User className="w-3 h-3 shrink-0" strokeWidth={1.75} />
                      <span>
                        {userProfile.name.trim()} ({userProfile.age.trim()}
                        {userProfile.sex ? `, ${userProfile.sex}` : ""})
                      </span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#263D38] text-[#5B6B67] dark:text-[#9EB0AC]">
                      {t.chat.bloodChipPrefix}: <strong className="text-[#1E2A28] dark:text-[#EAE6DF]">{userProfile.bloodType.trim()}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#263D38] text-[#5B6B67] dark:text-[#9EB0AC] truncate max-w-[180px] sm:max-w-[230px]">
                      {t.chat.sugarChipPrefix}: <strong className="text-[#1E2A28] dark:text-[#EAE6DF]">{userProfile.sugar.trim()}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#263D38] text-[#5B6B67] dark:text-[#9EB0AC] truncate max-w-[180px] sm:max-w-[220px]">
                      {t.chat.conditionsChipPrefix}: <strong className="text-[#1E2A28] dark:text-[#EAE6DF]">{userProfile.existingConditions.trim()}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#263D38] text-[#5B6B67] dark:text-[#9EB0AC] truncate max-w-[170px] sm:max-w-[200px]">
                      {t.chat.allergiesChipPrefix}: <strong className="text-[#1E2A28] dark:text-[#EAE6DF]">{userProfile.allergy.trim()}</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={scrollToProfileForm}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#1F4E4A] dark:text-[#8CE0C0] hover:text-[#C8694A] underline underline-offset-4 cursor-pointer shrink-0"
                  >
                    <Edit3 className="w-3 h-3" strokeWidth={1.5} />
                    <span>{t.chat.editProfileBtn}</span>
                  </button>
                </div>

                {/* Chat Header: Chosen Specialty + Hand-Drawn Icon + Specialist Selector + Language + Quick Actions */}
                <div className="px-3.5 sm:px-6 py-3 bg-[#FAF7F2] dark:bg-[#162522] border-b border-[#E6DFD2] dark:border-[#263D38] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    {/* Specialty Header Badge with Hand-Drawn Style Icon */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-[#DCE8E2] dark:bg-[#1B332E] border border-[#1F4E4A]/15 dark:border-[#8CE0C0]/25 text-[#1F4E4A] dark:text-[#8CE0C0] flex items-center justify-center shrink-0 shadow-2xs">
                        <SpecialistHandDrawnIcon
                          specialty={selectedSpecialty}
                          className="w-5 h-5"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1E2A28] dark:text-[#EAE6DF] truncate">
                            {t.chat.specialists[selectedSpecialty]?.label || selectedSpecialty}
                          </h3>
                          <span className="inline-block w-2 h-2 rounded-full bg-[#5E9C84] shrink-0" aria-hidden="true" />
                        </div>
                        <p className="text-[11.5px] text-[#5B6B67] dark:text-[#9EB0AC] truncate">
                          {t.chat.specialists[selectedSpecialty]?.shortDesc ||
                            SPECIALIST_OPTIONS.find((s) => s.id === selectedSpecialty)?.shortDesc}
                        </p>
                      </div>
                    </div>

                    {/* Top Right Quick Actions: Language, Copy Summary, New Chat */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-between sm:justify-end">
                      {/* Searchable Language Selector synced with app language */}
                      <LanguageSelector
                        id="chat-language-select"
                        value={languageCode}
                        onChange={(code) => void handleLanguageChange(code)}
                        t={t}
                        compact
                      />

                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleCopyDoctorSummary}
                          className="btn-calm-lift inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1 rounded-full bg-white dark:bg-[#111C1A] border border-[#E6DFD2] dark:border-[#2C4641] text-xs font-medium text-[#1F4E4A] dark:text-[#8CE0C0] cursor-pointer"
                        >
                          {copiedChatSummary ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#5E9C84] shrink-0" strokeWidth={1.75} />
                              <span>{t.chat.copiedSummaryBtn}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                              <span>{t.chat.copySummaryBtn}</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleStartNewChat}
                          className="btn-calm-lift inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1 rounded-full bg-white dark:bg-[#111C1A] border border-[#E6DFD2] dark:border-[#2C4641] text-xs font-medium text-[#5B6B67] dark:text-[#9EB0AC] hover:text-[#1E2A28] dark:hover:text-[#EAE6DF] cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                          <span>{t.chat.newChatBtn}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsConfirmingClearChat((prev) => !prev)}
                          disabled={chatMessages.length === 0 || isChatLoading}
                          aria-expanded={isConfirmingClearChat}
                          aria-controls="clear-specialist-chat-confirm"
                          className="btn-calm-lift inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1 rounded-full bg-white dark:bg-[#111C1A] border border-[#E6DFD2] dark:border-[#2C4641] text-xs font-medium text-[#9B3B24] dark:text-[#F59E84] hover:bg-[#C8694A]/10 dark:hover:bg-[#C8694A]/20 disabled:opacity-45 disabled:pointer-events-none cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                          <span>{t.chat.clearChatBtn}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Beta language note inside chat header when Bhojpuri, Rajasthani, or Sanskrit is active */}
                  {LANGUAGE_META_MAP[languageCode]?.status === "beta" && (
                    <div className="rounded-xl px-3 py-2 bg-[#D99B52]/12 dark:bg-[#D99B52]/20 border border-[#D99B52]/35 text-[11.5px] sm:text-xs text-[#1E2A28] dark:text-[#EAE6DF] flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#D99B52]/25 text-[#875212] dark:text-[#F5C582] shrink-0">
                        {t.languageSelector.betaBadge}
                      </span>
                      <span className="break-words">{t.languageSelector.betaNote}</span>
                    </div>
                  )}

                  {/* Mid-conversation language switch notification */}
                  <AnimatePresence>
                    {chatLanguageChangedNotice && (
                      <motion.div
                        role="status"
                        aria-live="polite"
                        initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
                        className="rounded-xl px-3.5 py-2 bg-[#DCE8E2]/80 dark:bg-[#1B332E] border border-[#1F4E4A]/20 dark:border-[#8CE0C0]/25 text-xs text-[#1F4E4A] dark:text-[#8CE0C0] flex items-center justify-between gap-2"
                      >
                        <span className="break-words">{chatLanguageChangedNotice}</span>
                        <button
                          type="button"
                          onClick={() => setChatLanguageChangedNotice(null)}
                          className="p-0.5 rounded-full hover:bg-[#1F4E4A]/10 cursor-pointer shrink-0"
                          aria-label={t.languageSelector.close}
                        >
                          <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Confirmation Prompt inside Chat Header before deleting all specialist chat messages */}
                  <AnimatePresence>
                    {isConfirmingClearChat && (
                      <motion.div
                        id="clear-specialist-chat-confirm"
                        role="alertdialog"
                        aria-labelledby="clear-chat-confirm-title"
                        aria-describedby="clear-chat-confirm-desc"
                        initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                        transition={{ duration: 0.22, ease: CALM_EASE }}
                        className="rounded-2xl px-3.5 sm:px-4 py-3 bg-[#C8694A]/12 dark:bg-[#C8694A]/22 border border-[#C8694A]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start sm:items-center gap-2.5 text-xs sm:text-[13px] text-[#7D2B12] dark:text-[#FAD2C5] min-w-0">
                          <Trash2
                            className="w-4 h-4 text-[#C8694A] dark:text-[#F59E84] shrink-0 mt-0.5 sm:mt-0"
                            strokeWidth={1.65}
                          />
                          <div className="min-w-0">
                            <p id="clear-chat-confirm-title" className="font-semibold break-words">
                              {t.chat.clearConfirmTitle}
                            </p>
                            <p id="clear-chat-confirm-desc" className="opacity-90 mt-0.5 break-words">
                              {t.chat.clearConfirmDesc}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setIsConfirmingClearChat(false)}
                            className="btn-calm-lift inline-flex items-center justify-center min-h-[34px] px-3.5 py-1.5 rounded-full bg-[#FAF7F2] dark:bg-[#111C1A] border border-[#E6DFD2] dark:border-[#2C4641] text-xs font-medium text-[#1E2A28] dark:text-[#EAE6DF] cursor-pointer"
                          >
                            {t.chat.cancelBtn}
                          </button>
                          <button
                            type="button"
                            onClick={handleConfirmClearChat}
                            className="inline-flex items-center justify-center gap-1.5 min-h-[34px] px-4 py-1.5 rounded-full bg-[#C8694A] hover:bg-[#B2593B] text-[#FAF7F2] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 shrink-0" strokeWidth={1.65} />
                            <span>{t.chat.confirmClearBtn}</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Horizontal Scrollable Specialist Selector Pills (great on 375px mobile & desktop) */}
                  <div
                    role="tablist"
                    aria-label={t.chat.sectionTitle}
                    className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar"
                  >
                    {SPECIALIST_OPTIONS.map((spec) => {
                      const active = selectedSpecialty === spec.id;
                      const localizedSpecLabel =
                        t.chat.specialists[spec.id]?.label || spec.label;
                      return (
                        <button
                          key={spec.id}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => setSelectedSpecialty(spec.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                            active
                              ? "bg-[#1F4E4A] text-[#FAF7F2] shadow-2xs"
                              : "bg-[#FAF7F2] dark:bg-[#111C1A] text-[#5B6B67] dark:text-[#9EB0AC] border border-[#E6DFD2] dark:border-[#2C4641] hover:text-[#1E2A28] dark:hover:text-[#EAE6DF]"
                          }`}
                        >
                          <SpecialistHandDrawnIcon
                            specialty={spec.id}
                            className="w-3.5 h-3.5 shrink-0"
                          />
                          <span>{localizedSpecLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Calm but Prominent Emergency Banner when urgency === 'emergency' */}
                <AnimatePresence>
                  {hasEmergencyInChat && (
                    <motion.div
                      role="alert"
                      initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.3, ease: CALM_EASE }}
                      className="px-4 sm:px-6 py-3.5 bg-[#C8694A]/18 dark:bg-[#C8694A]/28 border-b border-[#C8694A]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start sm:items-center gap-2.5 text-[#7D2B12] dark:text-[#FAD2C5] min-w-0">
                        <AlertCircle
                          className="w-5 h-5 text-[#C8694A] dark:text-[#F59E84] shrink-0 mt-0.5 sm:mt-0"
                          strokeWidth={1.75}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold break-words">
                            {t.chat.emergencyBannerTitle}
                          </p>
                          <p className="text-xs opacity-90 break-words">
                            {t.chat.emergencyBannerBody}
                          </p>
                        </div>
                      </div>

                      <a
                        href="tel:112"
                        className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2 rounded-full bg-[#C8694A] hover:bg-[#B2593B] text-[#FAF7F2] text-xs sm:text-sm font-semibold shadow-xs transition-colors shrink-0"
                      >
                        <PhoneCall className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                        <span>{t.chat.call112Btn}</span>
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Scrollable Messages Viewport */}
                <div
                  ref={chatViewportRef}
                  role="log"
                  aria-live="polite"
                  aria-label={t.chat.sectionTitle}
                  className="flex-1 overflow-y-auto px-3.5 sm:px-6 py-5 space-y-5 bg-[#FAF7F2]/60 dark:bg-[#111C1A]/60"
                >
                  {chatMessages.length === 0 && !isChatLoading && (
                    <motion.div
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: CALM_EASE }}
                      className="rounded-[20px] p-5 sm:p-6 bg-[#DCE8E2]/55 dark:bg-[#1B332E]/65 border border-[#1F4E4A]/12 dark:border-[#8CE0C0]/20 text-center space-y-3.5 my-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#FAF7F2] dark:bg-[#111C1A] border border-[#1F4E4A]/15 dark:border-[#8CE0C0]/25 text-[#1F4E4A] dark:text-[#8CE0C0] flex items-center justify-center mx-auto">
                        <SpecialistHandDrawnIcon
                          specialty={selectedSpecialty}
                          className="w-5 h-5"
                        />
                      </div>
                      <div className="space-y-1 max-w-md mx-auto">
                        <p className="font-serif text-base sm:text-lg font-medium text-[#1E2A28] dark:text-[#EAE6DF]">
                          {t.chat.emptyClearedTitle}
                        </p>
                        <p className="text-xs sm:text-sm text-[#5B6B67] dark:text-[#9EB0AC]">
                          {t.chat.emptyClearedBody}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                        {t.chat.suggestionChips.map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => void handleSendChatMessage(chip)}
                            className="btn-calm-lift px-3.5 py-1.5 rounded-full bg-white dark:bg-[#162522] hover:bg-[#DCE8E2]/65 dark:hover:bg-[#1B332E] border border-[#E6DFD2] dark:border-[#2C4641] text-xs font-medium text-[#1F4E4A] dark:text-[#8CE0C0] transition-colors cursor-pointer"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={handleStartNewChat}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1F4E4A] dark:text-[#8CE0C0] hover:text-[#C8694A] underline underline-offset-4 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" strokeWidth={1.5} />
                          <span>{t.chat.restoreGreetingBtn}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {chatMessages.map((msg, idx) => {
                    const isBot = msg.role === "assistant";
                    const showReferralCard =
                      isBot &&
                      (msg.urgency === "soon" ||
                        msg.urgency === "urgent" ||
                        msg.urgency === "emergency");
                    const urgencyMeta = msg.urgency
                      ? getUrgencyMeta(msg.urgency, t)
                      : null;
                    const UrgencyIcon = urgencyMeta?.Icon || AlertCircle;
                    const isLatestBotMsg =
                      isBot && idx === chatMessages.length - 1;
                    const baseStaggerDelay = prefersReducedMotion
                      ? 0
                      : Math.min(idx * 0.06, 0.24);
                    const msgSpecialtyId = msg.specialty || selectedSpecialty;
                    const localizedBotSpecialty =
                      t.chat.specialists[msgSpecialtyId]?.label || msgSpecialtyId;

                    return (
                      <motion.div
                        key={msg.id}
                        initial={
                          prefersReducedMotion ? false : { opacity: 0, y: 20 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.42,
                          delay: baseStaggerDelay,
                          ease: CALM_EASE,
                        }}
                        className={`flex flex-col ${
                          isBot ? "items-start" : "items-end"
                        } space-y-2.5 min-w-0`}
                      >
                        {/* Serif Name Label for Bot */}
                        {isBot ? (
                          <div className="flex flex-wrap items-center gap-2 pl-1 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-[#DCE8E2] dark:bg-[#1B332E] text-[#1F4E4A] dark:text-[#8CE0C0] flex items-center justify-center shrink-0">
                              <SpecialistHandDrawnIcon
                                specialty={msgSpecialtyId}
                                className="w-3.5 h-3.5"
                              />
                            </span>
                            <span className="font-serif text-sm font-medium text-[#1F4E4A] dark:text-[#8CE0C0] break-words">
                              {localizedBotSpecialty} {t.chat.guideSuffix}
                            </span>
                            <span className="text-[11px] text-[#5B6B67] dark:text-[#9EB0AC]">
                              {msg.timestamp}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 pr-1 text-[11px] text-[#5B6B67] dark:text-[#9EB0AC]">
                            <span>{t.chat.youLabel}</span>
                            <span>·</span>
                            <span>{msg.timestamp}</span>
                          </div>
                        )}

                        {/* Message Bubble (20px radius, soft sage for bot, deep teal for user) */}
                        <motion.div
                          initial={
                            prefersReducedMotion ? false : { opacity: 0, y: 20 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.42,
                            delay: prefersReducedMotion
                              ? 0
                              : baseStaggerDelay + 0.05,
                            ease: CALM_EASE,
                          }}
                          className={`max-w-[92%] sm:max-w-[82%] min-w-0 rounded-[20px] px-4 sm:px-5 py-3.5 sm:py-4 text-[15px] sm:text-[15.5px] leading-[1.68] shadow-2xs ${
                            isBot
                              ? "bg-[#DCE8E2] dark:bg-[#1B332E] text-[#1E2A28] dark:text-[#EAE6DF] border border-[#1F4E4A]/12 dark:border-[#8CE0C0]/20"
                              : "bg-[#1F4E4A] text-[#FAF7F2]"
                          }`}
                        >
                          <div className="space-y-3 whitespace-pre-wrap break-words">
                            {msg.content}
                          </div>

                          {/* Routine subtle badge inside bot message when urgency === 'routine' */}
                          {isBot && msg.urgency === "routine" && !msg.isInitialGreeting && (
                            <div className="mt-3 pt-2.5 border-t border-[#1F4E4A]/12 dark:border-[#8CE0C0]/15 flex flex-wrap items-center gap-2 text-xs text-[#1F4E4A] dark:text-[#8CE0C0]">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF7F2]/80 dark:bg-[#111C1A]/80 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#5E9C84] shrink-0" strokeWidth={1.5} />
                                <span>{t.chat.routineGuidanceBadge}</span>
                              </span>
                              {msg.suggestedSpecialist && (
                                <span className="break-words">
                                  {t.chat.suggestedCheckInPrefix}: <strong>{msg.suggestedSpecialist}</strong>
                                </span>
                              )}
                            </div>
                          )}

                          {/* Disclaimer shown inside the first bot message only */}
                          {isBot && msg.isInitialGreeting && (
                            <p className="mt-3 pt-2.5 border-t border-[#1F4E4A]/15 dark:border-[#8CE0C0]/20 text-xs text-[#1F4E4A]/90 dark:text-[#9EB0AC] leading-relaxed break-words">
                              {t.chat.firstBotDisclaimer}
                            </p>
                          )}
                        </motion.div>

                        {/* "See a doctor" Referral Card when urgency is 'soon', 'urgent', or 'emergency' */}
                        {showReferralCard && urgencyMeta && (
                          <motion.div
                            initial={
                              prefersReducedMotion ? false : { opacity: 0, y: 20 }
                            }
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.42,
                              delay: prefersReducedMotion
                                ? 0
                                : baseStaggerDelay + 0.1,
                              ease: CALM_EASE,
                            }}
                            className={`w-full max-w-[92%] sm:max-w-[82%] min-w-0 rounded-[20px] p-4 sm:p-5 border ${urgencyMeta.surface} ${urgencyMeta.border} space-y-3`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${urgencyMeta.badgeBg}`}
                              >
                                <UrgencyIcon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                                <span>{urgencyMeta.label}</span>
                              </span>
                              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#5B6B67] dark:text-[#9EB0AC]">
                                {t.chat.seeADoctorLabel}
                              </span>
                            </div>

                            <div className="space-y-1 min-w-0">
                              <p className="font-serif text-lg font-medium text-[#1E2A28] dark:text-[#EAE6DF] break-words">
                                {t.chat.suggestedSpecialistPrefix}:{" "}
                                <span className={urgencyMeta.text}>
                                  {msg.suggestedSpecialist ||
                                    t.chat.specialists[selectedSpecialty]?.label ||
                                    selectedSpecialty}
                                </span>
                              </p>
                              {msg.reasonForReferral && (
                                <p className="text-xs sm:text-sm text-[#1E2A28]/90 dark:text-[#DCE6E3] leading-relaxed break-words">
                                  {msg.reasonForReferral}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={handleCopyDoctorSummary}
                                className="btn-calm-lift inline-flex items-center justify-center gap-1.5 min-h-[40px] px-4 py-2 rounded-full bg-[#FAF7F2] dark:bg-[#111C1A] border border-[#E6DFD2] dark:border-[#2C4641] text-xs font-medium text-[#1F4E4A] dark:text-[#8CE0C0] cursor-pointer"
                              >
                                {copiedChatSummary ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-[#5E9C84] shrink-0" strokeWidth={1.75} />
                                    <span>{t.chat.copiedSummaryBtn}</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                                    <span>{t.chat.copySummaryBtn}</span>
                                  </>
                                )}
                              </button>

                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  `${msg.suggestedSpecialist || selectedSpecialty} doctor near me`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary-teal inline-flex items-center justify-center gap-1.5 min-h-[40px] px-4 py-2 rounded-full text-xs font-medium"
                              >
                                <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                                <span>{t.chat.findDoctorNearMeBtn}</span>
                              </a>
                            </div>
                          </motion.div>
                        )}

                        {/* Tappable Suggestion Chips under the first message (or dynamic follow-up questions on latest message) */}
                        {isLatestBotMsg &&
                          !isChatLoading &&
                          msg.followUpQuestions &&
                          msg.followUpQuestions.length > 0 && (
                            <motion.div
                              initial={
                                prefersReducedMotion ? false : { opacity: 0, y: 20 }
                              }
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.42,
                                delay: prefersReducedMotion
                                  ? 0
                                  : baseStaggerDelay + 0.14,
                                ease: CALM_EASE,
                              }}
                              className="flex flex-wrap items-center gap-2 pt-1 max-w-[95%]"
                            >
                              {msg.followUpQuestions.map((chip) => (
                                <button
                                  key={chip}
                                  type="button"
                                  onClick={() => void handleSendChatMessage(chip)}
                                  className="btn-calm-lift text-left px-3.5 py-2 rounded-full bg-white dark:bg-[#162522] hover:bg-[#DCE8E2]/65 dark:hover:bg-[#1B332E] border border-[#E6DFD2] dark:border-[#2C4641] text-xs sm:text-[13px] font-medium text-[#1F4E4A] dark:text-[#8CE0C0] transition-colors cursor-pointer break-words"
                                >
                                  {chip}
                                </button>
                              ))}
                            </motion.div>
                          )}
                      </motion.div>
                    );
                  })}

                  {/* Typing Indicator as Three Softly Breathing Dots */}
                  {isChatLoading && (
                    <motion.div
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-start space-y-2"
                    >
                      <div className="flex items-center gap-2 pl-1">
                        <span className="font-serif text-sm font-medium text-[#1F4E4A] dark:text-[#8CE0C0]">
                          {t.chat.thinkingStatus.replace(
                            "{specialty}",
                            t.chat.specialists[selectedSpecialty]?.label || selectedSpecialty
                          )}
                        </span>
                      </div>
                      <div className="rounded-[20px] px-5 py-4 bg-[#DCE8E2] dark:bg-[#1B332E] border border-[#1F4E4A]/12 dark:border-[#8CE0C0]/20 inline-flex items-center gap-2">
                        {[0, 1, 2].map((dotIdx) => (
                          <motion.span
                            key={dotIdx}
                            animate={
                              prefersReducedMotion
                                ? { opacity: 0.7 }
                                : {
                                    scale: [1, 1.35, 1],
                                    opacity: [0.4, 1, 0.4],
                                  }
                            }
                            transition={{
                              duration: 1.4,
                              repeat: Infinity,
                              delay: dotIdx * 0.22,
                              ease: "easeInOut",
                            }}
                            className="w-2.5 h-2.5 rounded-full bg-[#1F4E4A] dark:bg-[#8CE0C0]"
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Graceful Error Banner with Retry Button */}
                  {chatError && (
                    <motion.div
                      role="alert"
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-[20px] p-4 bg-[#D99B52]/15 dark:bg-[#D99B52]/20 border border-[#D99B52]/45 text-xs sm:text-sm text-[#1E2A28] dark:text-[#EAE6DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <AlertCircle
                          className="w-4 h-4 text-[#C8694A] shrink-0 mt-0.5"
                          strokeWidth={1.5}
                        />
                        <span className="break-words">{chatError}</span>
                      </div>
                      {lastFailedUserMessage && (
                        <button
                          type="button"
                          onClick={() => void handleRetryLastChatMessage()}
                          className="btn-calm-lift inline-flex items-center justify-center gap-1.5 min-h-[36px] px-4 py-1.5 rounded-full bg-[#1F4E4A] text-[#FAF7F2] text-xs font-medium shrink-0 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                          <span>{t.chat.retryBtn}</span>
                        </button>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Chat Input Bar + Persistent Small Disclaimer Under Input Box */}
                <div className="p-3.5 sm:p-5 bg-[#FAF7F2] dark:bg-[#162522] border-t border-[#E6DFD2] dark:border-[#263D38] space-y-2.5">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      void handleSendChatMessage();
                    }}
                    className="flex items-end gap-2.5"
                  >
                    <div className="relative flex-1 min-w-0">
                      <label htmlFor="specialist-chat-input" className="sr-only">
                        {t.chat.inputPlaceholder}
                      </label>
                      <textarea
                        id="specialist-chat-input"
                        ref={chatInputRef}
                        rows={2}
                        maxLength={1000}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            void handleSendChatMessage();
                          }
                        }}
                        placeholder={t.chat.inputPlaceholder}
                        className="w-full rounded-[20px] bg-white dark:bg-[#111C1A] border border-[#E6DFD2] dark:border-[#2C4641] focus:border-[#1F4E4A] px-4 py-3 text-[15px] text-[#1E2A28] dark:text-[#EAE6DF] placeholder:text-[#5B6B67]/65 resize-none leading-relaxed transition-colors"
                      />
                      <span className="absolute bottom-2 right-3 text-[10.5px] font-mono text-[#5B6B67]/70 dark:text-[#9EB0AC]/70 pointer-events-none">
                        {chatInput.length}/1000
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isChatLoading || !chatInput.trim()}
                      aria-label={t.chat.sendBtn}
                      className="btn-primary-teal inline-flex items-center justify-center gap-2 min-h-[48px] px-5 sm:px-6 py-3 rounded-[20px] text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                    >
                      <Send className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                      <span className="hidden sm:inline">{t.chat.sendBtn}</span>
                    </button>
                  </form>

                  {/* Persistent Small Disclaimer Under the Input Box */}
                  <p className="text-[11.5px] sm:text-xs text-[#5B6B67] dark:text-[#9EB0AC] text-center leading-relaxed px-1 break-words">
                    {t.chat.persistentDisclaimer}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* 5. "How it works" as 3 steps connected by a thin self-drawing hand-drawn dashed line */}
        <motion.section
          id="how-it-works"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.65, ease: CALM_EASE }}
          className="py-18 sm:py-24 px-4 sm:px-8 border-t border-[#E6DFD2] dark:border-[#263D38] no-print"
        >
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="max-w-xl space-y-2">
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#C8694A]">
                {t.howItWorks.kicker}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1E2A28] dark:text-[#EAE6DF]">
                {t.howItWorks.title}
              </h2>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-7 items-start">
              {/* Thin hand-drawn dashed SVG connector line across desktop that draws itself in */}
              <svg
                aria-hidden="true"
                viewBox="0 0 900 70"
                fill="none"
                preserveAspectRatio="none"
                className="hidden md:block pointer-events-none absolute top-14 left-[12%] right-[12%] w-[76%] h-14 text-[#1F4E4A]/35 dark:text-[#8CE0C0]/30 -z-0"
              >
                <motion.path
                  d="M10 38 C 160 8, 290 62, 450 32 C 610 4, 740 58, 890 26"
                  stroke="currentColor"
                  strokeWidth="1.85"
                  strokeDasharray="6 7"
                  strokeLinecap="round"
                  initial={
                    prefersReducedMotion
                      ? { pathLength: 1, opacity: 1 }
                      : { pathLength: 0, opacity: 0.25 }
                  }
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 1.35, ease: CALM_EASE }}
                />
              </svg>

              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.55, delay: 0.05, ease: CALM_EASE }}
                className="relative z-10 clinic-card clinic-card-hover p-6 sm:p-7 space-y-3"
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#DCE8E2] dark:bg-[#1B332E] font-serif italic text-lg text-[#1F4E4A] dark:text-[#8CE0C0]">
                  1
                </span>
                <h3 className="font-serif text-xl font-normal text-[#1E2A28] dark:text-[#EAE6DF]">
                  {t.howItWorks.step1Title}
                </h3>
                <p className="text-sm sm:text-[15.5px] text-[#5B6B67] dark:text-[#9EB0AC] leading-relaxed">
                  {t.howItWorks.step1Desc}
                </p>
              </motion.div>

              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.55, delay: 0.18, ease: CALM_EASE }}
                className="relative z-10 clinic-card clinic-card-hover p-6 sm:p-7 space-y-3 md:mt-5"
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#DCE8E2] dark:bg-[#1B332E] font-serif italic text-lg text-[#1F4E4A] dark:text-[#8CE0C0]">
                  2
                </span>
                <h3 className="font-serif text-xl font-normal text-[#1E2A28] dark:text-[#EAE6DF]">
                  {t.howItWorks.step2Title}
                </h3>
                <p className="text-sm sm:text-[15.5px] text-[#5B6B67] dark:text-[#9EB0AC] leading-relaxed">
                  {t.howItWorks.step2Desc}
                </p>
              </motion.div>

              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.55, delay: 0.31, ease: CALM_EASE }}
                className="relative z-10 clinic-card clinic-card-hover p-6 sm:p-7 space-y-3 md:mt-2"
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#DCE8E2] dark:bg-[#1B332E] font-serif italic text-lg text-[#1F4E4A] dark:text-[#8CE0C0]">
                  3
                </span>
                <h3 className="font-serif text-xl font-normal text-[#1E2A28] dark:text-[#EAE6DF]">
                  {t.howItWorks.step3Title}
                </h3>
                <p className="text-sm sm:text-[15.5px] text-[#5B6B67] dark:text-[#9EB0AC] leading-relaxed">
                  {t.howItWorks.step3Desc}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Tidy, Spacious FAQ Accordion with smooth height animation and rotating chevron */}
        <motion.section
          id="faq"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.65, ease: CALM_EASE }}
          className="py-16 sm:py-22 px-4 sm:px-8 max-w-3xl mx-auto space-y-8 no-print"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C8694A]">
                {t.faq.kicker}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1E2A28] dark:text-[#EAE6DF]">
                {t.faq.title}
              </h2>
              <p className="text-sm sm:text-base text-[#5B6B67] dark:text-[#9EB0AC]">
                {t.faq.subtitle}
              </p>
            </div>

            {/* Real-time FAQ Search Input */}
            <div className="relative w-full sm:w-72 shrink-0">
              <label htmlFor="faq-search-input" className="sr-only">
                Search frequently asked questions
              </label>
              <Search
                className="w-4 h-4 text-[#5B6B67] dark:text-[#9EB0AC] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <input
                id="faq-search-input"
                type="search"
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                placeholder="Search questions or answers…"
                aria-label="Search frequently asked questions"
                className="w-full rounded-full bg-white/85 dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#263D38] focus:border-[#1F4E4A] pl-10 pr-9 py-2 text-xs sm:text-sm text-[#1E2A28] dark:text-[#EAE6DF] placeholder:text-[#5B6B67]/65 transition-colors"
              />
              {faqSearchQuery && (
                <button
                  type="button"
                  onClick={() => setFaqSearchQuery("")}
                  aria-label="Clear FAQ search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[#5B6B67] hover:text-[#1E2A28] dark:hover:text-[#EAE6DF] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              )}
            </div>
          </div>

          {(() => {
            const normalizedFaqQuery = faqSearchQuery.trim().toLowerCase();
            const filteredFaqItems = t.faq.items
              .map((item, originalIdx) => ({ item, originalIdx }))
              .filter(({ item }) => {
                if (!normalizedFaqQuery) return true;
                return (
                  item.question.toLowerCase().includes(normalizedFaqQuery) ||
                  item.answer.toLowerCase().includes(normalizedFaqQuery)
                );
              });

            if (filteredFaqItems.length === 0) {
              return (
                <div className="p-5 rounded-2xl bg-[#FAF7F2]/85 dark:bg-[#162522] border border-[#E6DFD2] dark:border-[#263D38] text-xs sm:text-sm text-[#5B6B67] dark:text-[#9EB0AC] flex flex-wrap items-center justify-between gap-3">
                  <span>
                    {t.history.noMatchesPrefix} &ldquo;{faqSearchQuery}&rdquo;.
                  </span>
                  <button
                    type="button"
                    onClick={() => setFaqSearchQuery("")}
                    className="text-xs font-medium text-[#1F4E4A] dark:text-[#8CE0C0] underline underline-offset-4 cursor-pointer"
                  >
                    {t.history.resetFilter}
                  </button>
                </div>
              );
            }

            return (
              <div className="divide-y divide-[#E6DFD2] dark:divide-[#263D38] border-y border-[#E6DFD2] dark:border-[#263D38]">
                {filteredFaqItems.map(({ item, originalIdx }) => {
                  const isOpen = normalizedFaqQuery
                    ? true
                    : openFaqIndex === originalIdx;
                  return (
                    <div key={item.question} className="py-5">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() =>
                          setOpenFaqIndex(
                            openFaqIndex === originalIdx ? null : originalIdx
                          )
                        }
                        className="w-full flex items-center justify-between gap-4 text-left font-serif text-lg sm:text-xl font-normal text-[#1E2A28] dark:text-[#EAE6DF] hover:text-[#1F4E4A] dark:hover:text-[#8CE0C0] transition-colors cursor-pointer"
                      >
                        <span className="break-words">{item.question}</span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.35, ease: CALM_EASE }}
                          className="shrink-0 text-[#1F4E4A] dark:text-[#8CE0C0]"
                        >
                          <ChevronDown className="w-5 h-5" strokeWidth={1.5} />
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.38, ease: CALM_EASE }}
                            className="overflow-hidden"
                          >
                            <p className="pt-3 text-sm sm:text-[16px] text-[#5B6B67] dark:text-[#9EB0AC] leading-[1.7] pr-6 break-words">
                              {item.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </motion.section>
      </main>

      {/* 6. Footer: Soft sage background (#DCE8E2), clear readable disclaimer, and "Made with care" line */}
      <footer className="border-t border-[#1F4E4A]/12 dark:border-[#263D38] bg-[#DCE8E2] dark:bg-[#152824] pt-12 pb-28 md:pb-12 px-4 sm:px-8 text-xs sm:text-sm text-[#1E2A28] dark:text-[#EAE6DF] transition-colors">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="p-5 sm:p-6 rounded-[24px] bg-[#FAF7F2]/85 dark:bg-[#111C1A]/85 border border-[#E6DFD2] dark:border-[#263D38] space-y-2 leading-relaxed">
            <p className="font-medium text-[#1F4E4A] dark:text-[#8CE0C0]">
              {t.footer.disclaimerLine1}
            </p>
            <p className="text-[#963E34] dark:text-[#F2A69D] font-medium">
              {t.footer.disclaimerLine2}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#1E2A28]/80 dark:text-[#9EB0AC]">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2">
                <motion.span
                  aria-hidden="true"
                  animate={
                    prefersReducedMotion
                      ? { rotate: 0 }
                      : { rotate: [-3, 3, -3], scale: [1, 1.04, 1] }
                  }
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-6 h-6 rounded-full bg-[#FAF7F2] dark:bg-[#1B332E] border border-[#1F4E4A]/15 dark:border-[#8CE0C0]/20 flex items-center justify-center text-[#1F4E4A] dark:text-[#8CE0C0] shadow-2xs"
                >
                  <svg
                    viewBox="0 0 28 28"
                    fill="none"
                    className="w-3.5 h-3.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      d="M14 4.8C9.2 8.8 7.8 13.6 9.4 17.7C10.7 20.9 14 22.4 14 22.4C14 22.4 17.3 20.9 18.6 17.7C20.2 13.6 18.8 8.8 14 4.8Z"
                      fill="currentColor"
                      fillOpacity="0.12"
                    />
                    <path d="M14 22.2V10.6" />
                    <circle cx="14" cy="3.3" r="1.7" fill="#C8694A" stroke="none" />
                  </svg>
                </motion.span>
                <span className="font-serif text-base font-medium text-[#1F4E4A] dark:text-[#8CE0C0]">
                  Arogya <span className="italic font-normal">Mitra</span>
                </span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{t.footer.sessionOnlyNote}</span>
            </div>
            <div>
              <span>{t.footer.madeWithCare}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Quick-Action Dock (Thumb-Zone Ergonomics) */}
      <div
        role="region"
        aria-label={t.mobileDock.explainNow}
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF7F2]/92 dark:bg-[#111C1A]/92 backdrop-blur-xl border-t border-[#E6DFD2] dark:border-[#263D38] px-3 pt-2 pb-safe shadow-[0_-8px_24px_-6px_rgba(31,78,74,0.12)] no-print"
      >
        {result && !isLoading ? (
          <div className="grid grid-cols-4 gap-1.5 max-w-md mx-auto">
            <button
              type="button"
              onClick={scrollToWorkspace}
              className="flex flex-col items-center justify-center gap-0.5 min-h-[44px] py-1 px-2 rounded-xl text-[11px] font-medium text-[#5B6B67] dark:text-[#9EB0AC] active:bg-[#DCE8E2]/60 dark:active:bg-[#1B332E] cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#1F4E4A] dark:text-[#8CE0C0]" strokeWidth={1.5} />
              <span className="truncate max-w-full">{t.mobileDock.newReport}</span>
            </button>

            <button
              type="button"
              onClick={() =>
                itemsBreakdownRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex flex-col items-center justify-center gap-0.5 min-h-[44px] py-1 px-2 rounded-xl text-[11px] font-medium text-[#5B6B67] dark:text-[#9EB0AC] active:bg-[#DCE8E2]/60 dark:active:bg-[#1B332E] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#1F4E4A] dark:text-[#8CE0C0]" strokeWidth={1.5} />
              <span className="truncate max-w-full">
                {t.mobileDock.items} ({result.items?.length || 0})
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                doctorChecklistRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex flex-col items-center justify-center gap-0.5 min-h-[44px] py-1 px-2 rounded-xl text-[11px] font-medium text-[#5B6B67] dark:text-[#9EB0AC] active:bg-[#DCE8E2]/60 dark:active:bg-[#1B332E] cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-[#C8694A]" strokeWidth={1.5} />
              <span className="truncate max-w-full">{t.mobileDock.doctorQs}</span>
            </button>

            <button
              type="button"
              onClick={handleShareResults}
              className="flex flex-col items-center justify-center gap-0.5 min-h-[44px] py-1 px-2 rounded-xl text-[11px] font-medium bg-[#1F4E4A] text-[#FAF7F2] cursor-pointer"
            >
              {sharedSummarySuccess ? (
                <>
                  <Check className="w-4 h-4" strokeWidth={1.75} />
                  <span className="truncate max-w-full">{t.mobileDock.shared}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" strokeWidth={1.5} />
                  <span className="truncate max-w-full">{t.mobileDock.share}</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 max-w-md mx-auto">
            <button
              type="button"
              onClick={handleQuickCameraCapture}
              disabled={isLoading}
              className="btn-calm-lift inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-full bg-[#DCE8E2]/85 dark:bg-[#1B332E] border border-[#1F4E4A]/15 dark:border-[#8CE0C0]/25 text-xs font-medium text-[#1F4E4A] dark:text-[#8CE0C0] shrink-0 cursor-pointer"
            >
              <Camera className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              <span>{t.mobileDock.snapPhoto}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (activeTab === "upload") setActiveTab("lab");
                scrollToWorkspace();
                handleToggleVoiceDictation();
              }}
              disabled={isLoading || isTranscribingAudio}
              className={`btn-calm-lift inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-full border text-xs font-medium shrink-0 cursor-pointer ${
                isDictating
                  ? "bg-[#C8694A] text-white border-[#C8694A]"
                  : "bg-white dark:bg-[#162522] border-[#E6DFD2] dark:border-[#263D38] text-[#1E2A28] dark:text-[#EAE6DF]"
              }`}
            >
              <Mic className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              <span>
                {isDictating ? t.mobileDock.stop : t.mobileDock.voice}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (
                  (activeTab === "upload" && uploadedFile) ||
                  (activeTab !== "upload" && inputText.trim())
                ) {
                  void handleAnalyze();
                } else {
                  scrollToWorkspace();
                }
              }}
              disabled={isLoading}
              className="btn-primary-teal flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-full text-xs font-medium cursor-pointer min-w-0"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span className="truncate">
                {isLoading
                  ? t.mobileDock.reading
                  : (activeTab === "upload" && uploadedFile) ||
                    (activeTab !== "upload" && inputText.trim())
                  ? t.mobileDock.explainNow
                  : t.mobileDock.pasteOrUpload}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Settings Modal with Dark Mode & Reading Text Size (Bottom-Sheet on Mobile) */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#1E2A28]/40 backdrop-blur-xs no-print"
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 24 }}
              transition={{ duration: 0.25, ease: CALM_EASE }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="settings-modal-title"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#FAF7F2] dark:bg-[#162522] border-t sm:border border-[#E6DFD2] dark:border-[#2C4641] rounded-t-[28px] sm:rounded-[24px] p-6 sm:p-7 pb-safe shadow-xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Subtle mobile sheet grab indicator */}
              <div
                aria-hidden="true"
                className="sm:hidden w-10 h-1 rounded-full bg-[#D5CCBC] dark:bg-[#2C4641] mx-auto -mt-1 mb-2"
              />

              <div className="flex items-center justify-between border-b border-[#E6DFD2] dark:border-[#263D38] pb-4">
                <div className="flex items-center gap-2.5">
                  <Settings
                    className="w-5 h-5 text-[#1F4E4A] dark:text-[#8CE0C0]"
                    strokeWidth={1.5}
                  />
                  <h2
                    id="settings-modal-title"
                    className="font-serif text-2xl font-normal text-[#1E2A28] dark:text-[#EAE6DF]"
                  >
                    {t.settingsModal.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  aria-label={t.languageSelector.close}
                  className="p-2 rounded-full text-[#5B6B67] dark:text-[#9EB0AC] hover:bg-[#DCE8E2]/50 dark:hover:bg-[#1B332E] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              {/* Appearance / Dark Mode Option */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#1E2A28] dark:text-[#EAE6DF]">
                  {t.settingsModal.appearanceLabel}
                </label>
                <p className="text-xs text-[#5B6B67] dark:text-[#9EB0AC]">
                  {t.settingsModal.appearanceDesc}
                </p>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setThemeMode("light")}
                    aria-pressed={themeMode === "light"}
                    className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border text-sm font-medium transition-colors cursor-pointer ${
                      themeMode === "light"
                        ? "bg-[#1F4E4A] text-[#FAF7F2] border-[#1F4E4A]"
                        : "bg-white dark:bg-[#111C1A] text-[#5B6B67] dark:text-[#9EB0AC] border-[#E6DFD2] dark:border-[#263D38]"
                    }`}
                  >
                    <Sun className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                    <span>{t.settingsModal.warmIvory}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setThemeMode("dark")}
                    aria-pressed={themeMode === "dark"}
                    className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border text-sm font-medium transition-colors cursor-pointer ${
                      themeMode === "dark"
                        ? "bg-[#1F4E4A] text-[#FAF7F2] border-[#8CE0C0]"
                        : "bg-white dark:bg-[#111C1A] text-[#5B6B67] dark:text-[#9EB0AC] border-[#E6DFD2] dark:border-[#263D38]"
                    }`}
                  >
                    <Moon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                    <span>{t.settingsModal.quietDark}</span>
                  </button>
                </div>
              </div>

              {/* Reading Text Size */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#1E2A28] dark:text-[#EAE6DF]">
                  {t.settingsModal.textSizeLabel}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTextScale("standard")}
                    aria-pressed={textScale === "standard"}
                    className={`p-3 rounded-2xl border text-sm font-medium transition-colors cursor-pointer ${
                      textScale === "standard"
                        ? "bg-[#1F4E4A] text-[#FAF7F2] border-[#1F4E4A]"
                        : "bg-white dark:bg-[#111C1A] text-[#5B6B67] dark:text-[#9EB0AC] border-[#E6DFD2] dark:border-[#263D38]"
                    }`}
                  >
                    {t.settingsModal.standardText}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextScale("comfortable")}
                    aria-pressed={textScale === "comfortable"}
                    className={`p-3 rounded-2xl border text-sm font-medium transition-colors cursor-pointer ${
                      textScale === "comfortable"
                        ? "bg-[#1F4E4A] text-[#FAF7F2] border-[#1F4E4A]"
                        : "bg-white dark:bg-[#111C1A] text-[#5B6B67] dark:text-[#9EB0AC] border-[#E6DFD2] dark:border-[#263D38]"
                    }`}
                  >
                    {t.settingsModal.largerText}
                  </button>
                </div>
              </div>

              {/* Explanation Language */}
              <div className="space-y-2">
                <label
                  htmlFor="settings-language-select"
                  className="block text-sm font-medium text-[#1E2A28] dark:text-[#EAE6DF]"
                >
                  {t.settingsModal.languageLabel}
                </label>
                <LanguageSelector
                  id="settings-language-select"
                  value={languageCode}
                  onChange={(code) => void handleLanguageChange(code)}
                  t={t}
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="btn-primary-teal w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-full text-sm font-medium cursor-pointer"
                >
                  {t.settingsModal.doneBtn}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

