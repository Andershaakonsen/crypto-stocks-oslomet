import React from "react";

type Props = {
    children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
    return <div>{children}</div>;
};

export default AuthProvider;
