const RENDER_BACKEND_URL = "https://arogya-mitra.onrender.com";

const isLocalOrUnifiedHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.endsWith(".run.app") ||
    window.location.hostname.endsWith(".onrender.com"));

export const API_BASE = (
  import.meta.env.VITE_API_URL ||
  (isLocalOrUnifiedHost ? "" : RENDER_BACKEND_URL)
)
  .trim()
  .replace(/\/+$/, "");

export async function fetchBackendDiagnose(): Promise<{
  keyPresent: boolean;
  geminiOk: boolean;
  errorType: string | null;
}> {
  const response = await fetch(`${API_BASE}/api/diagnose`, {
    method: "GET",
    cache: "no-store",
  });
  return response.json();
}

