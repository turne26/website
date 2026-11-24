import Content from "@/content/premium";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("premium");

export default function Page() {
  return (
    <>
      <JsonLd page={"premium"} />
      <Content />
    </>
  );
}
