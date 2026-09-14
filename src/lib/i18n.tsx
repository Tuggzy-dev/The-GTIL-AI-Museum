import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export const LANGS = ["nl", "fr", "en"] as const;
export type Lang = (typeof LANGS)[number];

const STORAGE_KEY = "museum-lang";

type Dict = {
  navHome: string;
  navShame: string;
  navPremium: string;
  navAdmin: string;
  brand: string;
  eyebrowHome: string;
  homeTitle: string;
  homeSubtitle: string;
  cta: string;
  heroAlt: string;
  roomOne: string;
  roomTwo: string;
  shameSubtitle: string;
  premiumSubtitle: string;
  loading: string;
  roomError: string;
  emptyRoom: string;
  untitled: string;
  artworkAlt: string;
  prev: string;
  next: string;
  artwork: string;
  // admin
  adminEyebrow: string;
  adminTitle: string;
  backToMuseum: string;
  fieldTitle: string;
  fieldTitlePlaceholder: string;
  fieldDescription: string;
  fieldImage: string;
  chooseFile: string;
  submit: string;
  submitting: string;
  added: string;
  needImage: string;
  needDescription: string;
  emptyList: string;
  save: string;
  remove: string;
};

const DICTS: Record<Lang, Dict> = {
  nl: {
    navHome: "Onthaal",
    navShame: "Wall of Shame",
    navPremium: "Premium",
    navAdmin: "Beheer",
    brand: "Musæum AI",
    eyebrowHome: "Vaste collectie",
    homeTitle: "Het AI-Museum",
    homeSubtitle: "Twee zalen, één blik: de Wall of Shame en de Premium-collectie.",
    cta: "Betreed de galerij",
    heroAlt: "Museumgalerij verlicht door een gouden schijnwerper",
    roomOne: "Zaal I",
    roomTwo: "Zaal II — Privékabinet",
    shameSubtitle: "De montages die de AI misschien liever voor zich had gehouden.",
    premiumSubtitle: "De uitgelezen collectie, voorbehouden aan de meesterwerken.",
    loading: "Laden…",
    roomError: "Deze zaal is tijdelijk niet toegankelijk.",
    emptyRoom: "Deze zaal wacht op haar eerste werk.",
    untitled: "Zonder titel",
    artworkAlt: "Tentoongesteld werk",
    prev: "Vorig werk",
    next: "Volgend werk",
    artwork: "Werk",
    adminEyebrow: "Achter de schermen",
    adminTitle: "Beheer",
    backToMuseum: "← Terug naar het museum",
    fieldTitle: "Titel",
    fieldTitlePlaceholder: "Zonder titel",
    fieldDescription: "Beschrijving (museumkaartje)",
    fieldImage: "Afbeelding",
    chooseFile: "Bestand kiezen",
    submit: "Toevoegen aan het museum",
    submitting: "Ophangen…",
    added: "Werk opgehangen.",
    needImage: "Kies een afbeelding.",
    needDescription: "De beschrijving is verplicht.",
    emptyList: "Nog geen werk in deze zaal.",
    save: "Opslaan",
    remove: "Verwijderen",
  },
  fr: {
    navHome: "Accueil",
    navShame: "Wall of Shame",
    navPremium: "Premium",
    navAdmin: "Régie",
    brand: "Musæum IA",
    eyebrowHome: "Collection permanente",
    homeTitle: "Le Musée de l'IA",
    homeSubtitle: "Deux salles, un regard : le Wall of Shame et la collection Premium.",
    cta: "Entrer dans la galerie",
    heroAlt: "Galerie de musée éclairée d'un projecteur doré",
    roomOne: "Salle I",
    roomTwo: "Salle II — Cabinet privé",
    shameSubtitle: "Les montages que l'IA aurait peut-être préféré garder pour elle.",
    premiumSubtitle: "La collection d'exception, réservée aux pièces maîtresses.",
    loading: "Chargement…",
    roomError: "La salle est momentanément inaccessible.",
    emptyRoom: "Cette salle attend sa première œuvre.",
    untitled: "Sans titre",
    artworkAlt: "Montage exposé",
    prev: "Œuvre précédente",
    next: "Œuvre suivante",
    artwork: "Œuvre",
    adminEyebrow: "Coulisses",
    adminTitle: "Régie",
    backToMuseum: "← Retour au musée",
    fieldTitle: "Titre",
    fieldTitlePlaceholder: "Sans titre",
    fieldDescription: "Description (cartel)",
    fieldImage: "Image",
    chooseFile: "Choisir un fichier",
    submit: "Ajouter au musée",
    submitting: "Accrochage…",
    added: "Œuvre accrochée.",
    needImage: "Choisissez une image.",
    needDescription: "La description est obligatoire.",
    emptyList: "Aucune œuvre dans cette salle.",
    save: "Enregistrer",
    remove: "Supprimer",
  },
  en: {
    navHome: "Home",
    navShame: "Wall of Shame",
    navPremium: "Premium",
    navAdmin: "Admin",
    brand: "Musæum AI",
    eyebrowHome: "Permanent collection",
    homeTitle: "The AI Museum",
    homeSubtitle: "Two rooms, one gaze: the Wall of Shame and the Premium collection.",
    cta: "Enter the gallery",
    heroAlt: "Museum gallery lit by a golden spotlight",
    roomOne: "Room I",
    roomTwo: "Room II — Private cabinet",
    shameSubtitle: "The edits the AI might have preferred to keep to itself.",
    premiumSubtitle: "The finest selection, reserved for the masterpieces.",
    loading: "Loading…",
    roomError: "This room is temporarily unavailable.",
    emptyRoom: "This room is waiting for its first piece.",
    untitled: "Untitled",
    artworkAlt: "Exhibited artwork",
    prev: "Previous artwork",
    next: "Next artwork",
    artwork: "Artwork",
    adminEyebrow: "Backstage",
    adminTitle: "Admin",
    backToMuseum: "← Back to the museum",
    fieldTitle: "Title",
    fieldTitlePlaceholder: "Untitled",
    fieldDescription: "Description (wall label)",
    fieldImage: "Image",
    chooseFile: "Choose a file",
    submit: "Add to the museum",
    submitting: "Hanging…",
    added: "Artwork hung.",
    needImage: "Please choose an image.",
    needDescription: "A description is required.",
    emptyList: "No artwork in this room yet.",
    save: "Save",
    remove: "Delete",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Dict };

const LangContext = createContext<Ctx>({
  lang: "nl",
  setLang: () => {},
  t: DICTS.nl,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("nl");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (LANGS as readonly string[]).includes(stored)) {
      setLangState(stored as Lang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang, t: DICTS[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

export function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center gap-1">
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-label={l.toUpperCase()}
          className={`font-display px-2 py-1 text-[0.65rem] tracking-[0.25em] uppercase transition-colors ${
            lang === l
              ? "text-[var(--gold-bright)]"
              : "text-muted-foreground hover:text-[var(--gold)]"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
