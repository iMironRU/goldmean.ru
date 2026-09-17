import type { Metadata } from "next";
import { PageStub } from "@/components/PageStub";

export const metadata: Metadata = {
  title: "Услуги",
  description: "Пять услуг салона со сроками и ценами.",
};

export default function Page() {
  return <PageStub route="/services" />;
}
