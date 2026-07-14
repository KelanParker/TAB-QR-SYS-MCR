import { useEffect, useState } from "react";
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
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 text-slate-900">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
                <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur sm:p-8 lg:p-10">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                Live dashboard
                            </span>
                            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                                MCR Tablet Management System
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                                Monitor tablet availability, borrowing activity, and employee usage in real time.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-md">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Auto refresh
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-700">
                                    Updates every 10 seconds
                                </p>
                            </div>
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">
                                    System status
                                </p>
                                <p className="mt-1 text-sm font-medium text-emerald-700">
                                    Connected and tracking live data
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="mb-8">
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
                                Overview
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Current system health at a glance.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            title="Total Tablets"
                            value={stats.totalTablets}
                            bgColor="rounded-2xl border border-slate-200 bg-white/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            textColor="text-slate-900"
                        />

                        <StatCard
                            title="Available"
                            value={stats.available}
                            bgColor="rounded-2xl border border-emerald-200 bg-emerald-50/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            textColor="text-emerald-700"
                        />

                        <StatCard
                            title="Borrowed"
                            value={stats.borrowed}
                            bgColor="rounded-2xl border border-rose-200 bg-rose-50/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            textColor="text-rose-700"
                        />

                        <StatCard
                            title="Employees"
                            value={stats.employees}
                            bgColor="rounded-2xl border border-sky-200 bg-sky-50/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            textColor="text-sky-700"
                        />
                    </div>
                </section>

                <section>
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
                                Tablets
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Tablet inventory and current assignment status.
                            </p>
                        </div>

                        <div className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 shadow-sm">
                            {tablets.length} tablets
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {tablets.map((tablet) => {
                            const isAvailable = tablet.status === "AVAILABLE";

                            return (
                                <article
                                    key={tablet.id}
                                    className={`group rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                                        isAvailable
                                            ? "border-emerald-200/80"
                                            : "border-rose-200/80"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                                Tablet
                                            </p>
                                            <h3 className="mt-2 truncate text-xl font-semibold text-slate-950 sm:text-2xl">
                                                {tablet.display_name}
                                            </h3>
                                            <p className="mt-1 text-sm font-medium text-slate-500">
                                                {tablet.tablet_code}
                                            </p>
                                        </div>

                                        <span
                                            className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ring-1 ring-inset transition-colors duration-300 ${
                                                isAvailable
                                                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                                    : "bg-rose-50 text-rose-700 ring-rose-200"
                                            }`}
                                        >
                                            {tablet.status}
                                        </span>
                                    </div>

                                    <div className="mt-6 rounded-2xl bg-slate-50 p-4 transition-colors duration-300 group-hover:bg-slate-100">
                                        {isAvailable ? (
                                            <div className="flex items-center gap-3 text-emerald-700">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg">
                                                    ✓
                                                </div>
                                                <div>
                                                    <p className="font-semibold">
                                                        Ready to Issue
                                                    </p>
                                                    <p className="text-sm text-emerald-600/90">
                                                        Available for checkout right now
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                                        Borrowed by
                                                    </p>
                                                    <p className="mt-1 text-base font-semibold text-slate-950">
                                                        {tablet.employee_name}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                                        Borrowed at
                                                    </p>
                                                    <p className="mt-1 text-sm text-slate-600">
                                                        {new Date(tablet.borrow_time).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Dashboard;
