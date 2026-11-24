import Content from "@/content/privacy";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("privacy");

export default function Page() {
  return (
    <>
      <JsonLd page={"privacy"} />
      <Content />
    </>
  );
}
