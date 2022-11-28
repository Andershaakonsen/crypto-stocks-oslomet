import { classed } from "@tw-classed/react";
import React, { forwardRef } from "react";
import { CgSpinner } from "react-icons/cg";

export const MainButton = classed(
    "button",
    "flex items-center justify-center border border-transparent rounded transition-all relative",
    "disabled:!bg-radix-slate4 disabled:!text-radix-slate10 disabled:!border-radix-slate6 disabled:cursor-not-allowed",
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
                ghostSlate:
                    "hover:slate-bg-int text-radix-slate11 hover:!slate-border-int",
                green: "green-bg-int text-radix-green11 !green-border-int",
                red: "red-bg-int text-radix-red11 !red-border-int",
            },
            square: {
                true: "rounded-none",
            },
            loading: {
                true: "cursor-not-allowed",
            },
        },
        defaultVariants: {
            size: "md",
            color: "blue",
        },
    }
);

const InnerContainer = classed("span", {
    base: "flex items-center space-x-2",
    variants: {
        loading: {
            true: "invisible",
        },
    },
});

export const Button: React.FC<React.ComponentProps<typeof MainButton>> =
    forwardRef(({ loading, children, ...props }, ref) => {
        return (
            <MainButton ref={ref} {...props} loading={loading}>
                {loading && (
                    <span className="absolute-center">
                        <CgSpinner className="animate-spin" />
                    </span>
                )}
                <InnerContainer loading={loading}>{children}</InnerContainer>
            </MainButton>
        );
    });
