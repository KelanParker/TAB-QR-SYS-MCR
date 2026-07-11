import { useEffect, useState } from "react";
import TabletCard from "../components/TabletCard";
import StatCard from "../components/StatCard";
import {
    getDashboard,
    getDashboardStats
} from "../services/api";

function Dashboard() {
    const [tablets, setTablets] = useState([]);
    const [stats, setStats] = useState({
        totalTablets: 0,
        available: 0,
        borrowed: 0,
        employees: 0
    });

    async function loadDashboard() {
        try {
            const [dashboardData, statsData] = await Promise.all([
                getDashboard(),
                getDashboardStats()
            ]);
            setTablets(dashboardData.tablets);
            if (statsData.success) {
                setStats(statsData.stats);
            }
        } catch (error) {
            console.error("Failed to load dashboard:", error);
        }
    }

    useEffect(() => {
        loadDashboard();
        const interval = setInterval(loadDashboard, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto p-8">
                <h1 className="text-4xl font-bold mb-2">
                    MCR Tablet Management System
                </h1>
                <p className="text-gray-500 mb-8">
                    Live Tablet Status
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <StatCard
                        title="Total Tablets"
                        value={stats.totalTablets}
                        bgColor="bg-white"
                        textColor="text-gray-800"
                    />

                    <StatCard
                        title="Available"
                        value={stats.available}
                        bgColor="bg-green-50 border border-green-200"
                        textColor="text-green-700"
                    />

                    <StatCard
                        title="Borrowed"
                        value={stats.borrowed}
                        bgColor="bg-red-50 border border-red-200"
                        textColor="text-red-700"
                    />

                    <StatCard
                        title="Employees"
                        value={stats.employees}
                        bgColor="bg-blue-50 border border-blue-200"
                        textColor="text-blue-700"
                    />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tablets.map((tablet) => (
                        <TabletCard
                            key={tablet.id}
                            tablet={tablet}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
