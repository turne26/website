import Content from "@/content/faq";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("faq");

export default function Page() {
  return (
    <>
      <JsonLd page={"faq"} />
      <Content />
    </>
  );
}
