import { classed } from "@tw-classed/react";

export const Input = classed(
    "input",
    "block bg-transparent h-full w-full border border-transparent rounded transition-all",
    {
        variants: {
            size: {
                sm: "text-sm px-2 py-1",
                md: "text-base px-3 py-2",
                lg: "text-lg px-4 py-3",
            },
            color: {
                secondary:
                    "!slate-border-int focus:!border-transparent focus:ring-radix-blue8",
                blue: "!blue-border-int focus:!border-transparent focus:ring-radix-blue8 focus:text-radix-blue11",
                green: "!green-border-int focus:!border-transparent focus:ring-radix-green8 focus:text-radix-green11",
                error: "!red-border-int focus:!border-transparent focus:ring-radix-red8 !text-radix-red11",
            },
        },
        defaultVariants: {
            size: "md",
            color: "secondary",
        },
    }
);

export const Select = classed(
    "select",
    "block bg-transparent h-full w-full border border-transparent rounded transition-all",
    Input // Extend Input's style configuration
);
