import Content from "@/content/join";
import { JsonLd } from "@/components/JsonLd";
import { PageScripts } from "@/components/PageScripts";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("join");

export default function Page() {
  return (
    <>
      <JsonLd page={"join"} />
      <Content />
      <PageScripts names={["join"]} />
    </>
  );
}
