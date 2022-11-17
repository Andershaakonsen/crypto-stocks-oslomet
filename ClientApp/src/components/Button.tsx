import classed from "@tw-classed/react";

export const Button = classed("button", "py-2 px-4", {
    variants: {
        color: {
            primary: "bg-blue-500 text-white",
            secondary: "bg-gray-500 text-white",
        },
    },
});
