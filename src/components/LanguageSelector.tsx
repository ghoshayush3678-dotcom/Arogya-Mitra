import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { Globe, Search, Check, X, ChevronDown, Info } from "lucide-react";
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_META_MAP,
  type LanguageCode,
  type TranslationDictionary,
} from "../i18n";

interface LanguageSelectorProps {
  value: LanguageCode;
  onChange: (code: LanguageCode) => void;
  t: TranslationDictionary;
  compact?: boolean;
  align?: "left" | "right";
  showBetaBannerInline?: boolean;
  id?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
  t,
  compact = false,
  align = "right",
  showBetaBannerInline = false,
  id,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});

  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentLang = LANGUAGE_META_MAP[value] || LANGUAGE_META_MAP.en;

  const updatePosition = useCallback(() => {
    if (typeof window === "undefined") return;
    const mobile = window.innerWidth < 640;
    setIsMobileViewport(mobile);

    if (mobile || !triggerButtonRef.current) {
      setPopoverStyle({});
      return;
    }

    const rect = triggerButtonRef.current.getBoundingClientRect();
    const popoverWidth = Math.min(430, window.innerWidth - 24);
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom - 16;
    const spaceAbove = rect.top - 16;
    const openUpward = spaceBelow < 320 && spaceAbove > spaceBelow;

    let left =
      align === "left" ? rect.left : rect.right - popoverWidth;
    left = Math.max(12, Math.min(left, window.innerWidth - popoverWidth - 12));

    if (openUpward) {
      const maxH = Math.min(520, Math.max(260, spaceAbove - 8));
      setPopoverStyle({
        position: "fixed",
        left: `${left}px`,
        bottom: `${viewportHeight - rect.top + 8}px`,
        width: `${popoverWidth}px`,
        maxHeight: `${maxH}px`,
      });
    } else {
      const maxH = Math.min(520, Math.max(260, spaceBelow - 8));
      setPopoverStyle({
        position: "fixed",
        left: `${left}px`,
        top: `${rect.bottom + 8}px`,
        width: `${popoverWidth}px`,
        maxHeight: `${maxH}px`,
      });
    }
  }, [align]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    updatePosition();

    const timer = setTimeout(() => {
      if (window.innerWidth >= 640) {
        searchInputRef.current?.focus();
      }
    }, 60);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerButtonRef.current?.contains(target) ||
        dialogRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [open, updatePosition]);

  const filteredLanguages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SUPPORTED_LANGUAGES;
    return SUPPORTED_LANGUAGES.filter(
      (lang) =>
        lang.nativeName.toLowerCase().includes(q) ||
        lang.englishName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q) ||
        lang.script.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelect = (code: LanguageCode) => {
    onChange(code);
    setOpen(false);
  };

  const portalContent =
    open && typeof document !== "undefined"
      ? createPortal(
          <>
            {/* Backdrop (visible on mobile, subtle click-catcher on desktop) */}
            <div
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-none"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile Bottom Sheet & Desktop Floating Popover */}
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={t.languageSelector.selectLanguageTitle}
              style={isMobileViewport ? undefined : popoverStyle}
              className={
                isMobileViewport
                  ? "fixed inset-x-0 bottom-0 z-[101] max-h-[85vh] flex flex-col rounded-t-[24px] bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] shadow-2xl pb-safe"
                  : "z-[101] flex flex-col rounded-[20px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden"
              }
            >
              {/* Mobile drag handle */}
              <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-[var(--border-subtle)]" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between gap-2 px-4 pt-2.5 pb-2 border-b border-[var(--border-subtle)] shrink-0">
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[var(--text-primary)] truncate">
                    {t.languageSelector.selectLanguageTitle}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] truncate">
                    {t.languageSelector.allLanguages}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t.languageSelector.close}
                  className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search input */}
              <div className="px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50 shrink-0">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.languageSelector.searchPlaceholder}
                    className="w-full pl-9 pr-8 py-2 rounded-xl text-[13px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label={t.languageSelector.close}
                      className="absolute right-2.5 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Grid of language tiles */}
              <div className="p-3.5 overflow-y-auto flex-1 min-h-0">
                {filteredLanguages.length === 0 ? (
                  <div className="py-8 text-center text-[13px] text-[var(--text-muted)]">
                    {t.languageSelector.noResults}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {filteredLanguages.map((lang) => {
                      const isSelected = lang.code === value;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => handleSelect(lang.code)}
                          lang={lang.code}
                          className={`group relative flex flex-col items-start justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer min-w-0 ${
                            isSelected
                              ? "border-[var(--accent-primary)] bg-[var(--accent-soft)]/70 text-[var(--text-primary)] shadow-xs"
                              : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 hover:border-[var(--accent-primary)]/60 hover:bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                          }`}
                        >
                          <div className="w-full flex items-start justify-between gap-1 min-w-0">
                            <span className="text-[15px] font-semibold leading-snug break-words min-w-0">
                              {lang.nativeName}
                            </span>
                            {isSelected ? (
                              <Check
                                className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0 mt-0.5"
                                strokeWidth={2.25}
                              />
                            ) : lang.status === "beta" ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#FDF6EC] text-[#9A5B13] border border-[#E6C396] shrink-0">
                                {t.languageSelector.betaBadge}
                              </span>
                            ) : null}
                          </div>

                          <div className="w-full flex items-center justify-between gap-1 mt-1 min-w-0">
                            <span
                              lang="en"
                              className="text-[11px] text-[var(--text-muted)] truncate"
                            >
                              {lang.englishName}
                            </span>
                            {isSelected && lang.status === "beta" && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#FDF6EC] text-[#9A5B13] border border-[#E6C396] shrink-0">
                                {t.languageSelector.betaBadge}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Beta note footer inside selector */}
              <div className="px-4 py-2.5 border-t border-[var(--border-subtle)] bg-[#FDF6EC]/80 dark:bg-[#2A2116] shrink-0">
                <div className="flex items-start gap-2 text-[11px] text-[#7A440A] dark:text-[#F5D099] leading-relaxed">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#FDF6EC] text-[#9A5B13] border border-[#E6C396] shrink-0 mt-0.5">
                    {t.languageSelector.betaBadge}
                  </span>
                  <span>
                    <strong className="font-semibold">
                      भोजपुरी · राजस्थानी · संस्कृतम्:
                    </strong>{" "}
                    {t.languageSelector.betaNote}
                  </span>
                </div>
              </div>
            </div>
          </>,
          document.body
        )
      : null;

  return (
    <div className="relative inline-block min-w-0 max-w-full">
      <button
        id={id}
        ref={triggerButtonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${t.languageSelector.label}: ${currentLang.nativeName} (${currentLang.englishName})`}
        className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer text-[var(--text-primary)] max-w-full ${
          compact ? "px-2.5 py-1.5 text-[12px]" : "px-3.5 py-2 text-[13px]"
        }`}
      >
        <Globe
          className={`${
            compact ? "w-3.5 h-3.5" : "w-4 h-4"
          } text-[var(--accent-primary)] shrink-0`}
          strokeWidth={1.75}
        />
        <span className="font-medium truncate max-w-[96px] sm:max-w-[150px]">
          {currentLang.nativeName}
        </span>
        {!compact && currentLang.code !== "en" && (
          <span className="hidden md:inline text-[11px] text-[var(--text-muted)] shrink-0">
            ({currentLang.englishName})
          </span>
        )}
        {currentLang.status === "beta" && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FDF6EC] text-[#9A5B13] border border-[#E6C396] shrink-0">
            {t.languageSelector.betaBadge}
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-[var(--text-muted)] shrink-0 transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={1.75}
        />
      </button>

      {showBetaBannerInline && currentLang.status === "beta" && (
        <div className="mt-2 flex items-start gap-2 rounded-xl bg-[#FDF6EC] dark:bg-[#2A2116] border border-[#E6C396] dark:border-[#6E4F26] px-3 py-2 text-[12px] text-[#7A440A] dark:text-[#F5D099] leading-relaxed">
          <Info className="w-3.5 h-3.5 text-[#9A5B13] dark:text-[#F5D099] shrink-0 mt-0.5" />
          <span>{t.languageSelector.betaNote}</span>
        </div>
      )}

      {portalContent}
    </div>
  );
};

