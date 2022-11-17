import classed from "@tw-classed/react";

export const Button = classed(
    "button",
    "flex items-center justify-center border border-transparent rounded",
    {
        variants: {
            size: {
                sm: "px-2 py-1 text-sm",
                md: "px-3 py-2 text-base",
                lg: "px-4 py-3 text-lg",
                xl: "h-14 px-5",
            },
            color: {
                blue: "blue-bg-int text-radix-blue11 !blue-border-int",
                slate: "slate-bg-int text-radix-slate11 !slate-border-int",
                green: "green-bg-int text-radix-green11 !green-border-int",
            },
            square: {
                true: "rounded-none",
            },
        },
        defaultVariants: {
            size: "md",
            color: "blue",
        },
    }
);
