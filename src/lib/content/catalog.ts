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
