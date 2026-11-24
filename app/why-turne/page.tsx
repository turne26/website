import Content from "@/content/why-turne";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("why-turne");

export default function Page() {
  return (
    <>
      <JsonLd page={"why-turne"} />
      <Content />
    </>
  );
}
