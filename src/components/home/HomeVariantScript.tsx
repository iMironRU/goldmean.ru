import { HOME_VARIANT, HOME_VARIANTS } from "@/lib/content/site";

// Вариант главной выбирается ДО первой отрисовки, инлайн-скриптом в <head>.
//
// Почему не useSearchParams: при статическом экспорте сервер не знает query,
// и клиентское переключение дало бы вспышку варианта по умолчанию — заказчик
// на показе увидел бы «а» и только потом «b». Здесь же атрибут data-home
// проставляется синхронно, до отрисовки, а нужный вариант выбирает CSS
// (см. globals.css, секция «Переключение вариантов главной»).
//
// В продакшне значение по умолчанию берётся из content/home.json, а ?home=
// остаётся инструментом показа — как и записано в §3.1 хендоффа.
const SCRIPT = `(function(){
  var allowed=${JSON.stringify(HOME_VARIANTS)};
  var v=${JSON.stringify(HOME_VARIANT)};
  try{
    var q=new URLSearchParams(location.search).get('home');
    if(q&&allowed.indexOf(q)>-1)v=q;
  }catch(e){}
  document.documentElement.setAttribute('data-home',v);
})();`;

export function HomeVariantScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}

export default HomeVariantScript;
