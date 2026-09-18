import siteJson from "../../../content/site.json";
import homeJson from "../../../content/home.json";
import previewJson from "../../../content/preview.json";
import giftJson from "../../../content/gift.json";
import aboutJson from "../../../content/about.json";
import contactsJson from "../../../content/contacts.json";

export type NavItem = { href: string; label: string };

export type Site = typeof siteJson;
export type Home = typeof homeJson;
export type Preview = typeof previewJson;

export const site: Site = siteJson;
export const home: Home = homeJson;
export const preview: Preview = previewJson;

export const HOME_VARIANTS = ["a", "b", "c"] as const;
export type HomeVariant = (typeof HOME_VARIANTS)[number];

// Вариант главной по умолчанию (§3.1 хендоффа). Значение живёт в
// content/home.json, чтобы его можно было менять без правки кода.
export const HOME_VARIANT: HomeVariant = (
  HOME_VARIANTS as readonly string[]
).includes(homeJson.variantDefault)
  ? (homeJson.variantDefault as HomeVariant)
  : "a";

// ─── Подарочный сертификат ───────────────────────────────────────────────

export type Gift = typeof giftJson;
export const gift: Gift = giftJson;

// ─── О магазине ──────────────────────────────────────────────────────────

export type About = typeof aboutJson;
export const about: About = aboutJson;

// ─── Контакты ────────────────────────────────────────────────────────────

export type Contacts = typeof contactsJson;
export const contacts: Contacts = contactsJson;
