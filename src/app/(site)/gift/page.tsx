import type { Metadata } from "next";
import { PageStub } from "@/components/PageStub";

export const metadata: Metadata = {
  title: "Подарочный сертификат",
  description: "Конструктор сертификата, доставка, корпоративная заявка и правила.",
};

export default function Page() {
  return <PageStub route="/gift" />;
}
