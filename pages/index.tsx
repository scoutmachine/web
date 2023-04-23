import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <h1 className="mt-16">
        coming soon -{" "}
        <Link href="/teams" legacyBehavior>
          <a>
            <span className="text-primary hover:text-white">teams?</span>
          </a>
        </Link>
      </h1>
    </div>
  );
}
