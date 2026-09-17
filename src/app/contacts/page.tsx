import type { Metadata } from "next";
import { PageStub } from "@/components/PageStub";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Адрес, режим работы и запись на консультацию.",
};

export default function Page() {
  return <PageStub route="/contacts" />;
}
