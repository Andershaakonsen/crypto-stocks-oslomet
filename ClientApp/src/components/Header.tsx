import { useAuth } from "features/auth/AuthProvider";
import { useToggleTheme } from "features/auth/ThemeProvider";
import { Button } from "./Button";

const Header = () => {
    const { logout } = useAuth();
    const toggle = useToggleTheme();
    return (
        <header className="h-14 border-b border-radix-slate6 flex items-center justify-between px-4">
            <div className="flex items-center">
                <i className="gg-dollar"></i>
                <span className="ml-4">MetFinance</span>
            </div>
            <div className="flex items-center gap-4">
                <Button onClick={() => logout()} size="sm" color="ghostSlate">
                    Logout
                </Button>

                <button
                    onClick={toggle}
                    className="bg-radix-slate3 text-radix-slate12 rounded-full px-1 py-1"
                    style={{ "--ggs": "0.7" } as any}
                >
                    <i className="gg-sun" />
                </button>
            </div>
        </header>
    );
};

export default Header;
