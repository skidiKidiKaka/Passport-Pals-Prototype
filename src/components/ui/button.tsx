import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-card active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft",
        outline:
          "border-2 border-border bg-background hover:bg-muted hover:border-primary/50 active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-soft active:scale-[0.98]",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Custom Passport Pals variants
        hero: "bg-gradient-hero text-primary-foreground shadow-glow hover:shadow-elevated hover:scale-[1.02] active:scale-[0.98] font-bold",
        teal: "bg-gradient-teal text-secondary-foreground shadow-soft hover:shadow-card hover:scale-[1.02] active:scale-[0.98]",
        accent: "bg-accent text-accent-foreground shadow-soft hover:bg-accent/90 hover:shadow-card active:scale-[0.98]",
        swipe: "rounded-full shadow-card hover:shadow-elevated hover:scale-110 active:scale-95 transition-bounce",
        "swipe-like": "rounded-full bg-primary text-primary-foreground shadow-card hover:shadow-glow hover:scale-110 active:scale-95 transition-bounce",
        "swipe-dislike": "rounded-full bg-muted text-muted-foreground shadow-card hover:bg-destructive hover:text-destructive-foreground hover:scale-110 active:scale-95 transition-bounce",
        "swipe-super": "rounded-full bg-accent text-accent-foreground shadow-card hover:shadow-elevated hover:scale-110 active:scale-95 transition-bounce",
        chip: "rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary font-medium",
        "chip-active": "rounded-full bg-primary/15 text-primary font-medium border border-primary/30",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-4",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
        "icon-lg": "h-14 w-14",
        "icon-xl": "h-16 w-16",
        chip: "h-8 px-4 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
