import type { Metadata } from "next";
import { PageStub } from "@/components/PageStub";

export const metadata: Metadata = {
  title: "О бриллиантах",
  description: "Образовательный блок: разбор 4C — вес, цвет, чистота, огранка.",
};

export default function Page() {
  return <PageStub route="/diamonds" />;
}
