import classes from "./dialog.module.scss";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { classed } from "@tw-classed/react";
import { Children } from "react";

const DialogRoot = DialogPrimitive.Root;
const DialogClose = DialogPrimitive.Close;
const DialogOverlay = classed(DialogPrimitive.Overlay, classes.DialogOverlay);
const DialogContent = classed(DialogPrimitive.Content, classes.DialogContent);
const DialogTitle = classed(DialogPrimitive.Title, classes.DialogTitle);
const DialogDescription = classed(
    DialogPrimitive.Description,
    classes.DialogDescription
);

interface DialogProps extends React.ComponentProps<typeof DialogRoot> {
    trigger: React.ReactNode;
    children?: React.ReactNode;
}
export const Dialog = ({ trigger, children, ...props }: DialogProps) => {
    return (
        <DialogRoot {...props}>
            <DialogPrimitive.Trigger asChild>
                {Children.only(trigger)}
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
                <DialogOverlay />
                <DialogContent>{children}</DialogContent>
            </DialogPrimitive.Portal>
        </DialogRoot>
    );
};

export { DialogTitle, DialogDescription };
