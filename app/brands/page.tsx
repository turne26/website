import Content from "@/content/brands";
import { JsonLd } from "@/components/JsonLd";
import { PageScripts } from "@/components/PageScripts";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("brands");

export default function Page() {
  return (
    <>
      <JsonLd page={"brands"} />
      <Content />
      <PageScripts names={["forms"]} />
    </>
  );
}
