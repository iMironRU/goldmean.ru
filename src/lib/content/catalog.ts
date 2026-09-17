import watchesJson from "../../../content/watches.json";
import jewelryJson from "../../../content/jewelry.json";

export type Brand = {
  slug: string;
  name: string;
  meta: string;
  text: string;
};

export type WatchModel = (typeof watchesJson.models)[number];
export type JewelItem = (typeof jewelryJson.items)[number];

export const watches = watchesJson;
export const jewelry = jewelryJson;

// ─── Часы ────────────────────────────────────────────────────────────────

export const MECH_NAMES: Record<string, string> = {
  auto: "Автоматический",
  quartz: "Кварцевый",
  manual: "Механический, ручной завод",
};

export const GENDER_CHIPS = [
  { key: "all", label: "Все" },
  { key: "m", label: "Мужские" },
  { key: "f", label: "Женские" },
];

export const MECH_CHIPS = [
  { key: "all", label: "Все" },
  { key: "auto", label: "Автомат" },
  { key: "quartz", label: "Кварц" },
  { key: "manual", label: "Ручной завод" },
];

// ─── Украшения ───────────────────────────────────────────────────────────

export const JEWEL_TYPE_CHIPS = [
  { key: "all", label: "Все" },
  { key: "ring", label: "Кольца" },
  { key: "earrings", label: "Серьги" },
  { key: "pendant", label: "Подвески" },
  { key: "bracelet", label: "Браслеты" },
];

export const OCCASION_CHIPS = [
  { key: "all", label: "Любой" },
  { key: "proposal", label: "Предложение" },
  { key: "anniversary", label: "Годовщина" },
  { key: "birth", label: "Рождение ребёнка" },
  { key: "jubilee", label: "Юбилей" },
  { key: "self", label: "Себе" },
];

// ─── Общее ───────────────────────────────────────────────────────────────

export function formatPrice(n: number): string {
  // Неразрывные пробелы в разрядах: «289 000 ₽» не должно переноситься.
  return `${n.toLocaleString("ru-RU").replace(/ |\s/g, " ")} ₽`;
}

export function brandBySlug(list: Brand[], slug: string): Brand | undefined {
  return list.find((b) => b.slug === slug);
}

export function brandByName(list: Brand[], name: string): Brand | undefined {
  return list.find((b) => b.name === name);
}

// Счётчик у плитки марки. Числительное согласуется с количеством — «1 модель»,
// «3 модели», «8 изделий». Марки без моделей в демо-каталоге показывают
// «в салоне»: они есть в салоне, но в выгрузке их пока нет.
export function countLabel(n: number, forms: [string, string, string]): string {
  if (!n) return "в салоне";
  const [one, few, many] = forms;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} ${one}`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} ${few}`;
  return `${n} ${many}`;
}

export const WATCH_FORMS: [string, string, string] = ["модель", "модели", "моделей"];
export const JEWEL_FORMS: [string, string, string] = ["изделие", "изделия", "изделий"];

// ─── Адреса карточек товара ──────────────────────────────────────────────

// Референс в адресе — в нижнем регистре: «L2.893.4.78.6» → «l2.893.4.78.6».
// Точки в сегменте безопасны, потому что trailingSlash:true закрывает адрес
// слэшем и сервер не примет сегмент за имя файла.
export function refSlug(ref: string): string {
  return ref.toLowerCase();
}

export function modelByRef(ref: string): WatchModel | undefined {
  const want = refSlug(ref);
  return watches.models.find((m) => refSlug(m.ref) === want);
}

// Характеристики карточки часов (§7 хендоффа).
export function watchSpecs(m: WatchModel): { k: string; v: string }[] {
  return [
    { k: "Механизм", v: MECH_NAMES[m.mechanism] ?? m.mechanism },
    { k: "Калибр", v: m.caliber },
    { k: "Диаметр", v: `${m.size} мм` },
    { k: "Корпус", v: m.case },
    { k: "Ремешок / браслет", v: m.strap },
    { k: "Водозащита", v: m.waterResistance },
    { k: "Стекло", v: m.glass },
    { k: "Гарантия", v: watches.detail.warranty },
  ];
}

// Характеристики карточки изделия (§7 хендоффа).
export function jewelSpecs(j: JewelItem): { k: string; v: string }[] {
  return [
    { k: "Камни", v: j.stone },
    { k: "Металл", v: j.metal },
    { k: "Вес изделия", v: j.weight },
    { k: "Производитель", v: j.brand },
    { k: "Артикул", v: j.article },
    { k: "Сертификат", v: jewelry.detail.certificate },
  ];
}

// Похожие: сначала та же марка, потом остальные — как в прототипе.
export function relatedModels(m: WatchModel, limit = 3): WatchModel[] {
  const same = watches.models.filter((x) => x.brand === m.brand && x.id !== m.id);
  const rest = watches.models.filter((x) => x.brand !== m.brand);
  return [...same, ...rest].slice(0, limit);
}

export function relatedJewels(j: JewelItem, limit = 3): JewelItem[] {
  const same = jewelry.items.filter((x) => x.brand === j.brand && x.id !== j.id);
  const rest = jewelry.items.filter((x) => x.brand !== j.brand);
  return [...same, ...rest].slice(0, limit);
}
