import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchMontages, type Collection } from "@/lib/montages";
import { useLang } from "@/lib/i18n";

type Props = {
  collection: Collection;
  variant?: "classic" | "premium";
};

export function MuseumGallery({ collection, variant = "classic" }: Props) {
  const premium = variant === "premium";
  const { t } = useLang();
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["montages", collection],
    queryFn: () => fetchMontages(collection),
  });

  const items = data ?? [];
  const total = items.length;
  const current = items[Math.min(index, Math.max(total - 1, 0))];

  useEffect(() => {
    if (index > total - 1) setIndex(0);
  }, [total, index]);

  const go = (delta: number) => {
    if (total < 2) return;
    setFading(true);
    window.setTimeout(() => {
      setIndex((i) => (i + delta + total) % total);
      setFading(false);
    }, 260);
  };

  return (
    <div className="flex w-full max-w-6xl flex-col items-center">
      <div className="flex w-full items-center justify-center gap-10">
        <ArrowButton
          direction="left"
          disabled={total < 2}
          onClick={() => go(-1)}
          premium={premium}
          label={t.prev}
        />

        <div className="flex flex-col items-center">
          <div
            className={`relative transition-all duration-300 ${
              fading ? "scale-[0.985] opacity-0" : "scale-100 opacity-100"
            }`}
          >
            <div
              className={`${
                premium ? "frame-gold-premium p-6" : "frame-gold p-4"
              } rounded-[2px]`}
            >
              <div
                className={`${
                  premium
                    ? "border-[3px] border-[color-mix(in_oklab,var(--gold-deep)_70%,black)]"
                    : "border-2 border-[color-mix(in_oklab,var(--gold-deep)_60%,black)]"
                } bg-[oklch(0.1_0.004_60)] p-2`}
              >
                <div className="flex h-[420px] w-[640px] items-center justify-center overflow-hidden bg-[oklch(0.08_0.004_60)]">
                  {isLoading ? (
                    <p className="text-sm tracking-[0.3em] text-muted-foreground uppercase">
                      {t.loading}
                    </p>
                  ) : error ? (
                    <p className="px-8 text-center text-sm text-destructive">
                      {t.roomError}
                    </p>
                  ) : current ? (
                    <img
                      src={current.url}
                      alt={current.title || t.artworkAlt}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <p className="px-10 text-center text-lg text-muted-foreground italic">
                      {t.emptyRoom}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sokkel */}
          <div className="relative mt-1 w-full">
            <div
              className="mx-auto h-3 w-[85%] rounded-[2px]"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            />
            <div
              className={`mx-auto ${premium ? "h-8" : "h-6"} w-[60%]`}
              style={{
                background:
                  "linear-gradient(to bottom, oklch(0.42 0.07 72), oklch(0.22 0.03 65))",
              }}
            />
            <div
              className="mx-auto h-2 w-[72%] rounded-[2px]"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            />
            <div
              aria-hidden
              className="mx-auto mt-2 h-10 w-[80%] rounded-[50%] blur-xl"
              style={{ background: "oklch(0 0 0 / 75%)" }}
            />
          </div>

          {/* Cartel */}
          <div
            className={`mt-6 max-w-[620px] text-center transition-opacity duration-300 ${
              fading ? "opacity-0" : "opacity-100"
            }`}
          >
            {current && (
              <>
                <h3 className="text-2xl tracking-[0.14em] text-gilded uppercase">
                  {current.title || t.untitled}
                </h3>
                <div className="mx-auto my-3 h-px w-24 bg-[var(--gold-deep)]" />
                <p className="text-lg leading-relaxed text-muted-foreground italic">
                  {current.description}
                </p>
              </>
            )}
          </div>

          {total > 0 && (
            <div className="mt-6 flex flex-col items-center gap-3">
              <p className="font-display text-sm tracking-[0.4em] text-[var(--gold)]">
                {Math.min(index + 1, total)} / {total}
              </p>
              <div className="flex gap-2">
                {items.map((item, i) => (
                  <button
                    key={item.id}
                    aria-label={`${t.artwork} ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-2 w-2 rounded-full transition-all ${
                      i === index
                        ? "scale-125 bg-[var(--gold-bright)]"
                        : "bg-[var(--gold-deep)] opacity-40 hover:opacity-80"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <ArrowButton
          direction="right"
          disabled={total < 2}
          onClick={() => go(1)}
          premium={premium}
          label={t.next}
        />
      </div>
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
  disabled,
  premium,
  label,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
  premium: boolean;
  label: string;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`group flex h-16 w-16 shrink-0 items-center justify-center rounded-full border transition-all duration-300 disabled:opacity-25 ${
        premium
          ? "border-[var(--gold)] hover:bg-[oklch(0.78_0.13_85_/_18%)]"
          : "border-[var(--gold-deep)] hover:bg-[oklch(0.78_0.13_85_/_12%)]"
      }`}
    >
      <Icon className="h-7 w-7 text-[var(--gold)] transition-transform group-hover:scale-110" />
    </button>
  );
}
