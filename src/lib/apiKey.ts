declare const process:
  | {
      env?: {
        GEMINI_API_KEY?: string;
        VITE_GEMINI_API_KEY?: string;
      };
    }
  | undefined;

export function getGeminiApiKey(): string {
  const viteKey =
    typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env.VITE_GEMINI_API_KEY || ""
      : "";

  const processKey =
    typeof process !== "undefined" && process?.env
      ? process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || ""
      : "";

  return (viteKey || processKey || "").trim();
}
