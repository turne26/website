import Content from "@/content/home";
import { JsonLd } from "@/components/JsonLd";
import { PageScripts } from "@/components/PageScripts";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("home");

export default function Page() {
  return (
    <>
      <JsonLd page={"home"} />
      <Content />
      <PageScripts names={["carousel"]} />
    </>
  );
}
