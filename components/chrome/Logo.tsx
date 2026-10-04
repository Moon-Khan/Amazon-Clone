import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Amazon Clone home"
      className={`inline-flex flex-col leading-none text-white ${className ?? ""}`}
    >
      <span className="text-2xl font-bold tracking-tight">amazon</span>
      <svg
        width="68"
        height="10"
        viewBox="0 0 68 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="-mt-0.5 ml-1"
        aria-hidden="true"
      >
        <path
          d="M1 2.5C14 9 54 9 67 2.5"
          stroke="var(--az-cta-orange)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M61 0.5L67 2.5L62.5 6.5" stroke="var(--az-cta-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </Link>
  );
}
