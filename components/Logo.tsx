/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

/** The Turne logo (mark + wordmark), linking home. */
export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="Turne home">
      <img className="logo__mark" src="/assets/img/logo-mark.png" width={157} height={120} alt="" />
      <img className="logo__word" src="/assets/img/logo-word.png" width={392} height={66} alt="" />
    </Link>
  );
}
