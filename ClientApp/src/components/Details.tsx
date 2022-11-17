import React from "react";

interface Props {
    title: string;
    children: React.ReactNode;
}

const Details = ({ title, children }: Props) => {
    return (
        <details className="panel">
            <summary className="h-14 px-4 font-bold cursor-pointer sticky top-14 panel z-10">
                {title}
            </summary>
            {children}
        </details>
    );
};

export default Details;
