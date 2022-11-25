import { classed } from "@tw-classed/react";
import { forwardRef, useId } from "react";

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

export const Label = classed("label", "block mb-1 text-sm font-medium", {
    variants: {
        color: {
            slate: "text-radix-slate11",
            blue: "text-radix-blue11",
            green: "text-radix-green11",
            red: "text-radix-red11",
        },
    },
    defaultVariants: {
        color: "slate",
    },
});

export interface TextFieldProps extends React.ComponentProps<typeof Input> {
    error?: string;
    label?: string;
}

/**
 * A text field component that supports error states and labels.
 *
 * @example
 * <TextField label="Name" />
 * With hook form: <TextField label="Name" {...register("name")} />
 * <TextField label="Name" error="This field is required" />
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    ({ error, color, label, ...props }, ref) => {
        const id = useId();
        return (
            <>
                {label && (
                    <Label color={error ? "red" : undefined} htmlFor={id}>
                        {error ? error : label}
                    </Label>
                )}
                <Input
                    id={id}
                    color={error ? "error" : color}
                    ref={ref}
                    {...props}
                />
            </>
        );
    }
);

export const Select = classed(
    "select",
    "block bg-transparent h-full w-full border border-transparent rounded transition-all",
    Input // Extend Input's style configuration
);
