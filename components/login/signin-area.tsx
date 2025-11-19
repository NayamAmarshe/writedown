import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import Link from "next/link";
import useUser from "../hooks/use-user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignInArea = () => {
  // GOOGLE SIGN IN HOOK
  const { signInWithGoogle, signInWithGithub } = useUser();
  const router = useRouter();

  return (
    <div className="flex h-1/2 w-full flex-col items-center justify-end gap-4 bg-slate-300 md:h-full md:w-1/2 dark:bg-slate-600 dark:text-slate-50">
      <div className="absolute top-0 left-5 px-4 pb-4 text-2xl font-semibold">
        <Link href="/" className="fixed top-4 z-10 flex items-center">
          writedown
        </Link>
      </div>
      <div className="bottom-0 flex h-full w-full flex-col items-center gap-4 bg-slate-50 px-10 py-16 pb-20 md:justify-center md:rounded-r-xl dark:bg-slate-900">
        <p className="mb-5 text-center text-sm font-medium">
          Login with your familiar services:
        </p>
        <Button
          className="hover:!border-slate- flex gap-2 border-2 px-10! text-slate-900! dark:text-slate-50!"
          data-testid="google-login"
          variant="outline"
          size="xl"
          onClick={async () => {
            const result = await signInWithGoogle();
            if (!result.success) {
              toast.error(result.error);
              return;
            } else {
              router.push("/dashboard");
            }
          }}
        >
          <FcGoogle className="size-6" /> Sign in with Google
        </Button>
        <Button
          className="flex gap-2 border-2 bg-slate-900! px-10! text-slate-50! hover:border-slate-600! hover:bg-slate-600! hover:text-slate-50! dark:text-slate-50! dark:hover:border-slate-300! dark:hover:bg-slate-300! dark:hover:text-slate-900!"
          size="xl"
          data-testid="github-login"
          onClick={async () => {
            const result = await signInWithGithub();
            if (!result.success) {
              toast.error(result.error);
              return;
            } else {
              router.push("/dashboard");
            }
          }}
        >
          <AiFillGithub className="size-6" /> Sign in with GitHub
        </Button>
      </div>
    </div>
  );
};

export default SignInArea;
