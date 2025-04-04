import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const switchVariants = cva(
  "peer inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        default:
          "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
        destructive:
          "data-[state=checked]:bg-destructive data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
      },
      size: {
        default: "h-[1.15rem] w-8",
        lg: "h-7 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const thumbVariants = cva(
  "pointer-events-none block rounded-full ring-0 transition-transform",
  {
    variants: {
      variant: {
        default:
          "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground",
        destructive:
          "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-destructive-foreground",
      },
      size: {
        default:
          "size-4 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
        lg: "size-5 data-[state=checked]:translate-x-[calc(100%-0px)] data-[state=unchecked]:translate-x-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface SwitchProps
  extends React.ComponentProps<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {}

function Switch({ className, variant, size, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(switchVariants({ variant, size, className }))}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(thumbVariants({ variant, size }))}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch, switchVariants };
