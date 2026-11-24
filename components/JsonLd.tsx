import { pageSchema } from "@/lib/seo";
import type { PageKey } from "@/lib/pages";

/** schema.org structured data for one page. */
export function JsonLd({ page }: { page: PageKey }) {
  return (
    <>
      {pageSchema(page).map((block, i) => (
        <script key={i} type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block).replace(/</g, "\\u003c") }} />
      ))}
    </>
  );
}
