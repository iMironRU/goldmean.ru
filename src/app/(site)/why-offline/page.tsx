import type { Metadata } from "next";
import { PageStub } from "@/components/PageStub";

export const metadata: Metadata = {
  title: "Почему в салоне",
  description: "Почему часы и бриллиант нельзя выбрать по фотографии.",
};

export default function Page() {
  return <PageStub route="/why-offline" />;
}
