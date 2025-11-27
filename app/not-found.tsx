import Navbar from "../components/home/navbar-new";
import HeadTags from "../components/common/head-tags";
import { Button } from "../components/ui/button";
import Link from "next/link";
import { HomeIcon } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <HeadTags
        title="Not Found - writedown"
        description="The page you are looking for does not exist. Please check the URL and try again."
        ogImage="https://writedown.app/og-image.png"
        ogUrl="https://writedown.app"
      />

      <Navbar />
      <main className="max-w-screen relative flex min-h-screen flex-row items-center justify-center bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50">
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-2xl font-medium">
              Oops, couldn&apos;t find that page!
            </h1>
            <p className="max-w-96 text-center text-slate-500 dark:text-slate-400">
              The page you are looking for might have been removed or the link
              is broken.
            </p>
          </div>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <HomeIcon className="size-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </main>
    </>
  );
}
