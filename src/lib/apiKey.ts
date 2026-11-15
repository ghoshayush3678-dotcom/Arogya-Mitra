declare const process: {
  env?: {
    GEMINI_API_KEY?: string;
  };
};

export function getGeminiApiKey(): string {
  const viteKey =
    typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env.VITE_GEMINI_API_KEY
      : "";
  if (typeof viteKey === "string" && viteKey.trim()) {
    return viteKey.trim();
  }

  try {
    const processKey = process?.env?.GEMINI_API_KEY;
    if (typeof processKey === "string" && processKey.trim()) {
      return processKey.trim();
    }
  } catch {
    // Ignore when process is not defined in browser without define replacement
  }

  return "";
}
