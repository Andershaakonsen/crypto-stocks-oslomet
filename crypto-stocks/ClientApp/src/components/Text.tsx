import { classed } from "@tw-classed/react";
/**
 * All typography variants
 *
 * @example <Text as="h1" variant="title" center>Hello World</Text>
 */
export const Text = classed("span", {
    base: "",
    variants: {
        variant: {
            title: "text-4xl font-semibold",
            subtitle: "text-2xl font-medium",
            base: "text-base",
        },
        color: {
            slate: "text-radix-slate11",
            blue: "text-radix-blue11",
            green: "text-radix-green11",
            red: "text-radix-red11",
        },

        block: {
            true: "block",
        },

        center: {
            true: "text-center",
        },
    },
});
