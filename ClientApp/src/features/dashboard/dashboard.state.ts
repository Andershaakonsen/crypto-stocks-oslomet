import { proxy, useSnapshot } from "valtio";

interface DashboardState {
    selected: string;
}
export const dashboardState = proxy<DashboardState>({
    selected: "",
});

export const useDashboard = () => useSnapshot(dashboardState);
