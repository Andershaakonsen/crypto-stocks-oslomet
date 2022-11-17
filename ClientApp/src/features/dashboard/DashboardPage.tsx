import { Button } from "components";
import { useStocks } from "./hooks";

const DashboardPage = () => {
    const { data, isLoading, error } = useStocks();

    return (
        <div>
            <div>
                <h1 className="text-4xl font-bold">Hello, world!</h1>

                <Button size="sm">Click me</Button>

                <p className="mt-4">
                    This is a simple example of a React component.
                </p>
            </div>
        </div>
    );
};

export default DashboardPage;
