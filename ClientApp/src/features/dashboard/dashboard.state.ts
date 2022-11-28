import { proxy, subscribe, useSnapshot } from "valtio";

interface DashboardState {
    selected: string;
}
export const dashboardState = proxy<DashboardState>({
    selected: "",
});

export const useDashboard = () => useSnapshot(dashboardState);

subscribe(dashboardState, () => {
    localStorage.setItem("selected", dashboardState.selected);
});

const persistedSelect = localStorage.getItem("selected");
persistedSelect && (dashboardState.selected = persistedSelect);
