import Content from "@/content/terms";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("terms");

export default function Page() {
  return (
    <>
      <JsonLd page={"terms"} />
      <Content />
    </>
  );
}
