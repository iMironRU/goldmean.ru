import type { Metadata } from "next";
import { PageStub } from "@/components/PageStub";

export const metadata: Metadata = {
  title: "О магазине",
  description: "История салона, документы, отзывы и лента Telegram.",
};

export default function Page() {
  return <PageStub route="/about" />;
}
