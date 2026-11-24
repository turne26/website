import Content from "@/content/not-found";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("404");

export default function NotFound() {
  return (
    <>
      {/* Tells the mobile sticky bar to stay hidden on this page. */}
      <div data-no-sticky="" hidden />
      <Content />
    </>
  );
}
