import Content from "@/content/giveaways";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("giveaways");

export default function Page() {
  return (
    <>
      <JsonLd page={"giveaways"} />
      <Content />
    </>
  );
}
