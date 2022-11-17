import classed from "@tw-classed/react";
import useSWR from "swr";

const Button = classed("button", "py-2 px-4 bg-blue-500 text-white rounded-md");

const HomePage = () => {
    const { data, isLoading, error } = useSWR("/api/Stocks");

    return (
        <div>
            <h1 className="text-4xl font-bold">Hello, world!</h1>

            <Button>Click me</Button>

            <p className="mt-4">
                This is a simple example of a React component.
            </p>
        </div>
    );
};

export default HomePage;
