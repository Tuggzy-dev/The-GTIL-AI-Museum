import { LANGS, useLang } from "@/lib/i18n";

export function LanguageRail() {
  const { lang, setLang } = useLang();
  const activeIndex = LANGS.indexOf(lang);

  return (
    <div className="fixed top-1/2 left-8 z-50 -translate-y-1/2">
      <div className="relative flex flex-col items-center gap-1 rounded-full border border-[var(--gold-deep)]/50 bg-[oklch(0.12_0.006_60_/_70%)] px-1.5 py-2 backdrop-blur-sm">
        <span
          aria-hidden
          className="absolute left-1.5 h-9 w-9 rounded-full transition-transform duration-300 ease-out"
          style={{
            backgroundImage: "var(--gradient-gold)",
            opacity: 0.9,
            transform: `translateY(${activeIndex * 40}px)`,
            top: "0.5rem",
          }}
        />
        {LANGS.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            aria-label={l.toUpperCase()}
            aria-current={lang === l}
            className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full font-display text-[0.62rem] tracking-[0.18em] uppercase transition-colors duration-300 ${
              lang === l
                ? "text-[oklch(0.12_0.006_60)]"
                : "text-muted-foreground hover:text-[var(--gold-bright)]"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      <div
        aria-hidden
        className="mx-auto mt-3 h-10 w-px bg-gradient-to-b from-[var(--gold-deep)] to-transparent"
      />
    </div>
  );
}
