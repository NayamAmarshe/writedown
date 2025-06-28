import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary/5 border-primary text-primary hover:bg-primary/10 border-2 shadow-xs",
        blue: "border-2 border-blue-500 bg-blue-50 text-blue-500 shadow-xs hover:bg-blue-500/10 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900",
        green:
          "border-2 border-green-500 bg-green-50 text-green-500 shadow-xs hover:bg-green-100 dark:border-green-400 dark:bg-green-950 dark:text-green-400 dark:hover:bg-green-900",
        red: "border-2 border-red-500 bg-red-50 text-red-500 shadow-xs hover:bg-red-100 dark:border-red-400 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900",
        destructive:
          "bg-destructive/5 border-destructive text-destructive hover:bg-destructive/10 focus-visible:ring-destructive/20 dark:hover:bg-destructive/20 border-2 shadow-xs",
        outline:
          "border-2 border-slate-900 bg-slate-50 text-slate-900 shadow-xs hover:bg-slate-200 dark:border-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-700",
        secondary:
          "bg-secondary/5 text-secondary-foreground hover:bg-secondary/80 shadow-xs",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 rounded-full px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-full px-6 has-[>svg]:px-4",
        xl: "h-12 rounded-full px-8 has-[>svg]:px-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
