import Content from "@/content/how-it-works";
import { JsonLd } from "@/components/JsonLd";
import { PageScripts } from "@/components/PageScripts";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("how-it-works");

export default function Page() {
  return (
    <>
      <JsonLd page={"how-it-works"} />
      <Content />
      <PageScripts names={["explainer", "hiw"]} />
    </>
  );
}
