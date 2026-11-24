import Content from "@/content/brands";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import "./brands.css";

export const metadata = pageMetadata("brands");

export default function Page() {
  return (
    <>
      <JsonLd page={"brands"} />
      <Content />
    </>
  );
}
