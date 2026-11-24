import Content from "@/content/contact";
import { JsonLd } from "@/components/JsonLd";
import { PageScripts } from "@/components/PageScripts";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("contact");

export default function Page() {
  return (
    <>
      <JsonLd page={"contact"} />
      <Content />
      <PageScripts names={["forms"]} />
    </>
  );
}
