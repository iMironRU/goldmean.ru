// Режим показа: какой вариант главной выбран, пока заказчик ходит по сайту.
//
// Параметр ?home= есть только на главной — уйдя в каталог, человек терял бы
// панель показа и путь назад к выбору. Поэтому вариант запоминается на время
// вкладки: sessionStorage, а не localStorage — закрыл вкладку, и режим показа
// не тянется в следующие визиты.
//
// Это внешнее для React хранилище, и читается оно через useSyncExternalStore:
// так значение попадает в рендер без setState в эффекте и остаётся общим для
// всех подписчиков.
const KEY = "goldmean:preview-variant";

const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function subscribePreview(cb: () => void): () => void {
  listeners.add(cb);
  // storage — на случай, если режим выключили в соседней вкладке.
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

export function getPreviewSnapshot(): string | null {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    // Приватный режим или заблокированные данные сайта — просто без панели.
    return null;
  }
}

// На сервере хранилища нет. Значение должно быть стабильной ссылкой, иначе
// React уйдёт в бесконечный рендер.
export function getPreviewServerSnapshot(): string | null {
  return null;
}

export function setPreviewVariant(v: string | null): void {
  try {
    if (v) sessionStorage.setItem(KEY, v);
    else sessionStorage.removeItem(KEY);
  } catch {
    // Записать не вышло — панель просто не переживёт переход. Не ошибка.
  }
  emit();
}
