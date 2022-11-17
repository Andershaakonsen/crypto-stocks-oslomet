import { Button } from "components";
import { useStocks } from "./hooks";

const DashboardPage = () => {
    const { data, isLoading, error } = useStocks();

    return (
        <div>
            <Button />
        </div>
    );
};

export default DashboardPage;
