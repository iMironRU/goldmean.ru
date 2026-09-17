import type { Metadata } from "next";
import { PageStub } from "@/components/PageStub";

export const metadata: Metadata = {
  title: "Часовой мастер",
  description: "Портрет мастера, его работы и компетенции.",
};

export default function Page() {
  return <PageStub route="/master" />;
}
