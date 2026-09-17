// eslint-config-next 16 отдаёт готовые flat-конфиги как CommonJS-массивы,
// поэтому импорт по умолчанию, без FlatCompat.
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  { ignores: ["node_modules/**", ".next/**", "out/**", "design-ref/**", "InBox/**"] },
];

export default eslintConfig;
