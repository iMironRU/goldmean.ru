import type { Metadata } from "next";
import { PageStub } from "@/components/PageStub";

export const metadata: Metadata = {
  title: "Часы",
  description: "Каталог швейцарских часов: 13 марок, фильтры по полу и механизму, сетка моделей.",
};

export default function Page() {
  return <PageStub route="/watches" />;
}
