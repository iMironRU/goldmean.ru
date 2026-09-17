import hintsJson from "../../../content/spec-hints.json";

// Подсказки «?» у характеристик в карточке товара. Это то, что предлагал
// автор контент-пакета: «каждый пункт можно использовать как всплывающую
// подсказку „?" рядом с характеристикой в карточке».
//
// Тексты лежат в content/spec-hints.json и почти все взяты из справочника
// дословно. Два (`Корпус`, `Ремешок / браслет`) собраны нами из его таблиц —
// у них стоит `draft: true`, и их должен вычитать автор текстов.
export type SpecHint = {
  text: string;
  /** Раздел справочника с подробностями. */
  href: string;
  source?: string;
  draft?: boolean;
};

const HINTS = hintsJson as Record<string, SpecHint | string>;

export function specHint(key: string): SpecHint | undefined {
  const v = HINTS[key];
  // Ключи, начинающиеся с подчёркивания, — комментарии в json.
  return v && typeof v === "object" ? v : undefined;
}
