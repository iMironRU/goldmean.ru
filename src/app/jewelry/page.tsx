import type { Metadata } from "next";
import { PageStub } from "@/components/PageStub";

export const metadata: Metadata = {
  title: "Украшения с бриллиантами",
  description: "Изделия шести российских производителей, фильтры по типу и поводу.",
};

export default function Page() {
  return <PageStub route="/jewelry" />;
}
