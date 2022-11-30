import "notyf/notyf.min.css";
import { Notyf } from "notyf";
import { createContext, useContext } from "react";

const ToastContext = createContext(
    new Notyf({
        position: { x: "center", y: "bottom" },
        duration: 2000,
    })
);

export const useToast = () => useContext(ToastContext);
