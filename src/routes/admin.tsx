import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2, Upload, Save } from "lucide-react";
import {
  createMontage,
  deleteMontage,
  fetchMontages,
  updateMontage,
  type Collection,
  type MontageWithUrl,
} from "@/lib/montages";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Museumbeheer — Montages beheren" },
      {
        name: "description",
        content:
          "Montages toevoegen, aanpassen of verwijderen in de zalen Wall of Shame en Premium.",
      },
      { property: "og:title", content: "Museumbeheer" },
      {
        property: "og:description",
        content: "Beheer van de collecties Wall of Shame en Premium.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { t } = useLang();
  return (
    <main className="min-h-screen bg-background px-10 py-14">
      <header className="mx-auto mb-14 flex max-w-6xl items-end justify-between border-b border-[var(--gold-deep)]/40 pb-6">
        <div>
          <p className="font-display text-[0.65rem] tracking-[0.5em] text-[var(--gold-deep)] uppercase">
            {t.adminEyebrow}
          </p>
          <h1 className="mt-2 text-4xl tracking-[0.15em] text-gilded uppercase">
            {t.adminTitle}
          </h1>
        </div>
        <Link
          to="/"
          className="font-display text-xs tracking-[0.3em] text-muted-foreground uppercase hover:text-[var(--gold)]"
        >
          {t.backToMuseum}
        </Link>
      </header>

      <div className="mx-auto grid max-w-6xl gap-16">
        <CollectionManager collection="shame" label={t.navShame} />
        <CollectionManager collection="premium" label={t.navPremium} />
      </div>
    </main>
  );
}

function CollectionManager({
  collection,
  label,
}: {
  collection: Collection;
  label: string;
}) {
  const { t } = useLang();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["montages", collection],
    queryFn: () => fetchMontages(collection),
  });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["montages", collection] });

  const add = useMutation({
    mutationFn: () => {
      if (!file) throw new Error(t.needImage);
      if (!description.trim()) throw new Error(t.needDescription);
      return createMontage({ collection, title, description, file });
    },
    onSuccess: () => {
      setTitle("");
      setDescription("");
      setFile(null);
      setMessage(t.added);
      invalidate();
    },
    onError: (e: Error) => setMessage(e.message),
  });

  const remove = useMutation({
    mutationFn: (m: MontageWithUrl) => deleteMontage(m),
    onSuccess: invalidate,
  });

  return (
    <section>
      <h2 className="mb-6 text-2xl tracking-[0.2em] text-gilded uppercase">{label}</h2>

      <div className="grid gap-10 lg:grid-cols-[380px_1fr]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setMessage(null);
            add.mutate();
          }}
          className="h-fit space-y-4 border border-[var(--gold-deep)]/40 bg-card p-6"
        >
          <Field label={t.fieldTitle}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.fieldTitlePlaceholder}
              className="w-full border border-input bg-transparent px-3 py-2 text-foreground outline-none focus:border-[var(--gold)]"
            />
          </Field>
          <Field label={t.fieldDescription}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="w-full resize-none border border-input bg-transparent px-3 py-2 text-foreground outline-none focus:border-[var(--gold)]"
            />
          </Field>
          <Field label={t.fieldImage}>
            <label className="flex cursor-pointer items-center gap-3 border border-dashed border-[var(--gold-deep)]/60 px-3 py-3 text-sm text-muted-foreground hover:border-[var(--gold)]">
              <Upload className="h-4 w-4 text-[var(--gold)]" />
              <span className="truncate">{file ? file.name : t.chooseFile}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </Field>
          <button
            type="submit"
            disabled={add.isPending}
            className="w-full py-3 font-display text-xs tracking-[0.3em] text-primary-foreground uppercase disabled:opacity-50"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          >
            {add.isPending ? t.submitting : t.submit}
          </button>
          {message && <p className="text-sm text-muted-foreground italic">{message}</p>}
        </form>

        <div className="space-y-4">
          {(data ?? []).length === 0 && (
            <p className="text-muted-foreground italic">{t.emptyList}</p>
          )}
          {(data ?? []).map((m) => (
            <MontageRow
              key={m.id}
              montage={m}
              onSaved={invalidate}
              onDelete={() => remove.mutate(m)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function MontageRow({
  montage,
  onSaved,
  onDelete,
}: {
  montage: MontageWithUrl;
  onSaved: () => void;
  onDelete: () => void;
}) {
  const { t } = useLang();
  const [title, setTitle] = useState(montage.title);
  const [description, setDescription] = useState(montage.description);

  const save = useMutation({
    mutationFn: () => updateMontage(montage.id, { title, description }),
    onSuccess: onSaved,
  });

  return (
    <div className="flex gap-5 border border-border bg-card p-4">
      <img
        src={montage.url}
        alt={montage.title || t.artworkAlt}
        loading="lazy"
        className="h-28 w-40 shrink-0 object-cover"
      />
      <div className="flex-1 space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.fieldTitle}
          className="w-full border border-input bg-transparent px-2 py-1 text-foreground outline-none focus:border-[var(--gold)]"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full resize-none border border-input bg-transparent px-2 py-1 text-sm text-foreground outline-none focus:border-[var(--gold)]"
        />
      </div>
      <div className="flex flex-col justify-center gap-2">
        <button
          onClick={() => save.mutate()}
          aria-label={t.save}
          className="flex h-9 w-9 items-center justify-center border border-[var(--gold-deep)] text-[var(--gold)] hover:bg-[oklch(0.78_0.13_85_/_12%)]"
        >
          <Save className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          aria-label={t.remove}
          className="flex h-9 w-9 items-center justify-center border border-destructive/60 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <span className="font-display text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}
