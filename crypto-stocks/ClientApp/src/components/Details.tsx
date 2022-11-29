import React, { useState } from "react";

interface Props {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const Details = ({ title, children, defaultOpen = false }: Props) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <details
            open={open}
            onToggle={(e) => setOpen((e.target as any).open)}
            className="panel"
        >
            <summary className="h-14 px-4 font-bold cursor-pointer sticky top-14 panel z-10">
                {title}
            </summary>
            {children}
        </details>
    );
};

export default Details;
