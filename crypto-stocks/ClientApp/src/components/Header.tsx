import { useAuth, useUser } from "features/auth/AuthProvider";
import { useToggleTheme } from "features/auth/ThemeProvider";
import { CgUser } from "react-icons/cg";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import { Text } from "./Text";

const Header = () => {
    const { logout } = useAuth();
    const user = useUser();
    const toggle = useToggleTheme();
    return (
        <header className="h-14 border-b border-radix-slate6 flex items-center justify-between px-4 bg-radix-slate1 sticky top-0 z-50">
            <Link to="/" className="flex items-center">
                <i className="gg-dollar"></i>
                <span className="ml-4">MetFinance</span>
            </Link>
            <div className="flex items-center gap-4">
                {user && (
                    <Text color="green" className="flex items-center gap-1">
                        <CgUser />
                        <Text>{user.userName}</Text>
                    </Text>
                )}

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
