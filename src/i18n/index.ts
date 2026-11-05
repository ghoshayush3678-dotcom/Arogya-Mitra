// Review by a native speaker before real-world use.
import en from "./en";
import {
  LANGUAGE_META_MAP,
  SUPPORTED_LANGUAGES,
  type LanguageCode,
  type LanguageMeta,
  type ScriptGroup,
  type TranslationDictionary,
} from "./types";

export {
  en,
  LANGUAGE_META_MAP,
  SUPPORTED_LANGUAGES,
  type LanguageCode,
  type LanguageMeta,
  type ScriptGroup,
  type TranslationDictionary,
};

const dictionaryCache: Partial<Record<LanguageCode, TranslationDictionary>> = {
  en,
};

function deepMergeWithFallback<T extends Record<string, any>>(
  base: T,
  override: Partial<T> | undefined
): T {
  if (!override) return base;
  const result: Record<string, any> = { ...base };
  for (const key of Object.keys(base)) {
    const baseVal = base[key];
    const overrideVal = override[key];
    if (overrideVal === undefined || overrideVal === null || overrideVal === "") {
      result[key] = baseVal;
    } else if (Array.isArray(baseVal)) {
      result[key] =
        Array.isArray(overrideVal) && overrideVal.length > 0
          ? overrideVal
          : baseVal;
    } else if (typeof baseVal === "object" && baseVal !== null) {
      result[key] = deepMergeWithFallback(baseVal, overrideVal);
    } else {
      result[key] = overrideVal;
    }
  }
  return result as T;
}

export async function loadLanguageDictionary(
  code: LanguageCode
): Promise<TranslationDictionary> {
  if (dictionaryCache[code]) {
    return dictionaryCache[code]!;
  }

  try {
    let loadedModule: { default: TranslationDictionary };
    switch (code) {
      case "hi":
        loadedModule = await import("./hi");
        break;
      case "bn":
        loadedModule = await import("./bn");
        break;
      case "pa":
        loadedModule = await import("./pa");
        break;
      case "mr":
        loadedModule = await import("./mr");
        break;
      case "gu":
        loadedModule = await import("./gu");
        break;
      case "kn":
        loadedModule = await import("./kn");
        break;
      case "ta":
        loadedModule = await import("./ta");
        break;
      case "te":
        loadedModule = await import("./te");
        break;
      case "ml":
        loadedModule = await import("./ml");
        break;
      case "or":
        loadedModule = await import("./or");
        break;
      case "as":
        loadedModule = await import("./as");
        break;
      case "bho":
        loadedModule = await import("./bho");
        break;
      case "raj":
        loadedModule = await import("./raj");
        break;
      case "sa":
        loadedModule = await import("./sa");
        break;
      case "en":
      default:
        return en;
    }

    const merged = deepMergeWithFallback(en, loadedModule.default);
    dictionaryCache[code] = merged;
    return merged;
  } catch (err) {
    console.warn(`Failed to lazy-load dictionary for ${code}, falling back to English.`, err);
    return en;
  }
}

const loadedFontFamilies = new Set<string>();

export function ensureLanguageFontLoaded(code: LanguageCode): void {
  if (typeof document === "undefined") return;

  const meta = LANGUAGE_META_MAP[code] || LANGUAGE_META_MAP.en;
  const htmlEl = document.documentElement;

  htmlEl.lang = meta.code;
  htmlEl.setAttribute("data-script-group", meta.scriptGroup);
  htmlEl.setAttribute("data-script", meta.script);
  htmlEl.style.removeProperty("--font-active-sans");
  htmlEl.style.removeProperty("--font-active-serif");

  if (!meta.googleFontFamily) {
    return;
  }

  const familiesToLoad: string[] = [];
  if (meta.googleFontFamily && !loadedFontFamilies.has(meta.googleFontFamily)) {
    familiesToLoad.push(
      `family=${encodeURIComponent(meta.googleFontFamily)}:wght@400;500;600;700`
    );
    loadedFontFamilies.add(meta.googleFontFamily);
  }
  if (meta.googleSerifFamily && !loadedFontFamilies.has(meta.googleSerifFamily)) {
    familiesToLoad.push(
      `family=${encodeURIComponent(meta.googleSerifFamily)}:wght@400;600`
    );
    loadedFontFamilies.add(meta.googleSerifFamily);
  }

  if (familiesToLoad.length > 0) {
    const linkId = `google-font-${meta.script.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?${familiesToLoad.join("&")}&display=swap`;
      document.head.appendChild(link);
    }
  }
}


