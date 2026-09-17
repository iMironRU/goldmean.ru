// Ярлыки характеристик поверх фотографии часов (§6 хендоффа): механизм тёмным
// чипом, водозащита, стекло и корпус — светлыми. Иконки — те же контуры, что
// в прототипе (this.ic).
import { MECH_NAMES } from "@/lib/content/catalog";

export const ICONS = {
  mech: "M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3.6a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8z",
  quartz: "M9.4 1 3 9.2h3.6L5.8 15 12 6.9H8.5L9.4 1z",
  water: "M8 1.2s4.2 5 4.2 8a4.2 4.2 0 0 1-8.4 0c0-3 4.2-8 4.2-8z",
  glass: "M3 6l5-4.2L13 6l-5 8.2L3 6z",
  caseIc: "M8 1l6 3.5v7L8 15 2 11.5v-7L8 1z",
};

export type Tag = {
  label: string;
  title: string;
  icon: string;
  dark: boolean;
};

export function tagsFor(
  mechanism: string,
  waterResistance: string,
  glass: string,
  caseMaterial: string,
): Tag[] {
  const mechLabel =
    mechanism === "auto"
      ? "Автоподзавод"
      : mechanism === "manual"
        ? "Ручной завод"
        : "Кварц";

  const glassLabel = /апфир/i.test(glass) ? "Сапфир" : glass.replace(/ое$/, "") || "—";
  const caseLabel = /ерамик/i.test(caseMaterial)
    ? "Керамика"
    : /Сталь/i.test(caseMaterial)
      ? "Сталь"
      : caseMaterial.split(/[,·]/)[0];

  return [
    {
      label: mechLabel,
      title: `Механизм: ${MECH_NAMES[mechanism] ?? mechanism}`,
      icon: mechanism === "quartz" ? ICONS.quartz : ICONS.mech,
      dark: true,
    },
    { label: `до ${waterResistance}`, title: `Водозащита ${waterResistance}`, icon: ICONS.water, dark: false },
    { label: glassLabel, title: `Стекло: ${glass}`, icon: ICONS.glass, dark: false },
    { label: caseLabel, title: `Корпус: ${caseMaterial}`, icon: ICONS.caseIc, dark: false },
  ];
}
