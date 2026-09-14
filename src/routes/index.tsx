import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { GoldParticles } from "@/components/GoldParticles";
import { MuseumGallery } from "@/components/MuseumGallery";
import { useLang } from "@/lib/i18n";
import hall from "@/assets/hall.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Het AI-Museum — Wall of Shame & Premium" },
      {
        name: "description",
        content:
          "Een virtueel museum in zwart en goud gewijd aan AI-montages: de zaal Wall of Shame en de Premium-collectie.",
      },
      { property: "og:title", content: "Het AI-Museum — Galerie van AI-montages" },
      {
        property: "og:description",
        content:
          "Een meeslepende museumervaring: gouden lijsten, museumkaartjes en twee collecties AI-montages.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const SECTION_IDS = ["home", "shame", "premium"] as const;

function Home() {
  const { t } = useLang();
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.55 },
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const sections = [
    { id: "home", label: t.navHome },
    { id: "shame", label: t.navShame },
    { id: "premium", label: t.navPremium },
  ];

  return (
    <main className="h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth bg-background">
      <nav className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-10 py-6 mix-blend-difference">
        <span className="font-display text-sm tracking-[0.45em] text-[var(--gold)] uppercase">
          {t.brand}
        </span>
        <div className="flex items-center gap-8">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`font-display text-xs tracking-[0.3em] uppercase transition-colors ${
                active === s.id
                  ? "text-[var(--gold-bright)]"
                  : "text-muted-foreground hover:text-[var(--gold)]"
              }`}
            >
              {s.label}
            </a>
          ))}
          <Link
            to="/admin"
            className="font-display text-xs tracking-[0.3em] text-muted-foreground uppercase transition-colors hover:text-[var(--gold)]"
          >
            {t.navAdmin}
          </Link>
        </div>
      </nav>

      {/* 1 — Home */}
      <section
        id="home"
        className="relative flex h-screen snap-start items-center justify-center overflow-hidden"
      >
        <img
          src={hall}
          alt={t.heroAlt}
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,oklch(0.09_0.004_60)_85%)]" />
        <div className="spotlight absolute inset-0" />
        <GoldParticles />

        <div className="animate-rise relative z-10 max-w-3xl px-8 text-center">
          <p className="font-display text-xs tracking-[0.6em] text-[var(--gold-deep)] uppercase">
            {t.eyebrowHome}
          </p>
          <h1 className="mt-8 text-6xl leading-[1.1] tracking-[0.08em] text-gilded uppercase">
            {t.homeTitle}
          </h1>
          <div className="animate-shimmer mx-auto mt-8 h-px w-40 bg-[var(--gold)]" />
          <p className="mt-8 text-xl leading-relaxed text-muted-foreground italic">
            {t.homeSubtitle}
          </p>
          <a
            href="#shame"
            className="mt-14 inline-flex flex-col items-center gap-3 text-[var(--gold)] transition-transform hover:translate-y-1"
          >
            <span className="font-display text-xs tracking-[0.4em] uppercase">{t.cta}</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </a>
        </div>
      </section>

      {/* 2 — Wall of Shame */}
      <GallerySection
        id="shame"
        eyebrow={t.roomOne}
        title={t.navShame}
        subtitle={t.shameSubtitle}
        collection="shame"
        variant="classic"
      />

      {/* 3 — Premium */}
      <GallerySection
        id="premium"
        eyebrow={t.roomTwo}
        title={t.navPremium}
        subtitle={t.premiumSubtitle}
        collection="premium"
        variant="premium"
      />
    </main>
  );
}

function GallerySection({
  id,
  eyebrow,
  title,
  subtitle,
  collection,
  variant,
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  collection: "shame" | "premium";
  variant: "classic" | "premium";
}) {
  const premium = variant === "premium";
  return (
    <section
      id={id}
      className="relative flex h-screen snap-start flex-col items-center justify-center overflow-hidden"
      style={{
        background: premium
          ? "radial-gradient(ellipse 70% 60% at 50% 30%, oklch(0.22 0.035 72) 0%, oklch(0.1 0.006 60) 70%)"
          : "radial-gradient(ellipse 70% 60% at 50% 30%, oklch(0.18 0.012 60) 0%, oklch(0.09 0.004 60) 72%)",
      }}
    >
      <div className="spotlight absolute inset-0" />
      <div className="museum-floor absolute inset-x-0 bottom-0 h-[28%]" />
      {premium && <GoldParticles count={16} />}

      <div className="relative z-10 mb-8 text-center">
        <p className="font-display text-[0.65rem] tracking-[0.6em] text-[var(--gold-deep)] uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-4xl tracking-[0.2em] text-gilded uppercase">{title}</h2>
        <p className="mt-2 text-base text-muted-foreground italic">{subtitle}</p>
      </div>

      <div className="relative z-10 flex justify-center">
        <MuseumGallery collection={collection} variant={variant} />
      </div>
    </section>
  );
}
