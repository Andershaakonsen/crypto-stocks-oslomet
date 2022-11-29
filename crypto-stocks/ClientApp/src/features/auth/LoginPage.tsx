import { Button } from "components";
import { useEffect, useState } from "react";
import { TextField } from "../../components/Input";
import { Text } from "components";
import { useForm } from "react-hook-form";
import { useToast } from "context/ToastContext";
import { FetchError, ofetch } from "ofetch";
import useSWRMutation from "swr/mutation";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";

interface User {
    email: string;
    password: string;
    username: string;
    confirmPassword?: string;
}

interface AuthResponse {
    data: string;
}

const LoginPage = () => {
    const navigate = useNavigate();
    const Toast = useToast();
    const { login, user } = useAuth();
    const [displayLogin, setDisplayLogin] = useState(true);
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<User>();

    const onSubmit = async (data: User) => {
        try {
            //Login method
            if (displayLogin) {
                await login(data.email, data.password);
                return;
            }

            //Register
            await ofetch("/api/Auth/register", {
                method: "POST",
                body: {
                    email: data.email,
                    password: data.password,
                    username: data.username,
                },
            });

            setDisplayLogin(true);
            Toast.success("User created, you can now login :)");
        } catch (error) {
            if (error instanceof FetchError) {
                Toast.error(error.data?.message);
                console.log(error.data);
            }
        }
    };

    useEffect(() => {
        if (user) navigate("/");
    }, [user]);

    return (
        <div className="grid place-items-center h-screen">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-[300px] flex flex-col "
            >
                <Text variant="subtitle" center>
                    {displayLogin ? "Login" : "Register"}
                </Text>
                {displayLogin ? (
                    <>
                        <TextField
                            label="Email"
                            type="email"
                            placeholder="Enter email..."
                            error={errors.email?.message}
                            {...register("email", {
                                required: "Email is required",
                            })}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            placeholder="Enter password.."
                            error={errors.password?.message}
                            {...register("password", {
                                required: "Password is required",
                            })}
                        />
                        <Button size="sm" className="mt-4">
                            Log In
                        </Button>
                    </>
                ) : (
                    <>
                        <TextField
                            label="Username"
                            placeholder="Enter username"
                            className="mb-2"
                            error={errors.username?.message}
                            {...register("username", {
                                required: "You must ender a username",
                                minLength: {
                                    value: 4,
                                    message:
                                        "Username must be at least 4 characters",
                                },
                            })}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            placeholder="Enter email"
                            className="mb-2"
                            error={errors.email?.message}
                            {...register("email", {
                                required: "You must enter an email address",
                            })}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            placeholder="Enter passord"
                            className="mb-2"
                            error={errors.password?.message}
                            {...register("password", {
                                required: "You must enter a password",
                                minLength: {
                                    value: 8,
                                    message:
                                        "Password must be at least 8 characters",
                                },
                                validate: (passwordValue) => {
                                    if (!/\d/.test(passwordValue)) {
                                        return "Password must contain at least 1 number";
                                    }
                                },
                            })}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            placeholder="Confirm Password"
                            error={errors.confirmPassword?.message}
                            {...register("confirmPassword", {
                                required: "You must confirm your password",
                                validate: (passwordValue) => {
                                    if (watch("password") !== passwordValue)
                                        return "Password does not match";
                                },
                            })}
                        />

                        <Button size="sm" className="mt-4">
                            Register
                        </Button>
                    </>
                )}
                <Text className="mt-2 text-sm " color="slate">
                    {displayLogin
                        ? "Not a user? Click"
                        : "Already a user? Click"}
                    <span
                        onClick={() => setDisplayLogin(!displayLogin)}
                        className="text-radix-blue11 hover:text-radix-blue12 cursor-pointer"
                    >
                        {" "}
                        here
                    </span>{" "}
                    {displayLogin ? "to sign up!" : "to login!"}
                </Text>
            </form>
        </div>
    );
};

export default LoginPage;
