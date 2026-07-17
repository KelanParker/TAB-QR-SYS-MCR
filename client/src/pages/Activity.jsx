import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
    getActivityLogs,
    deleteActivityLog,
    clearActivityLogs,
    verifyAdminPassword,
} from "../services/api";

function Activity() {

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    const [adminAuthOpen, setAdminAuthOpen] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");
    const [adminAuthLoading, setAdminAuthLoading] = useState(false);

    async function loadLogs() {

        try {

            const data = await getActivityLogs();

            if (data.success) {

                setLogs(data.logs);

            }

        } catch (err) {

            setError(err.message || "Failed to load activity.");

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadLogs();

        const interval = setInterval(loadLogs, 10000);

        return () => clearInterval(interval);

    }, []);

    function badgeColor(action) {

        if (action.includes("ADD"))
            return "bg-green-100 text-green-700";

        if (action.includes("DELETE"))
            return "bg-red-100 text-red-700";

        if (action === "ISSUE")
            return "bg-blue-100 text-blue-700";

        if (action === "RETURN")
            return "bg-yellow-100 text-yellow-700";

        return "bg-gray-100 text-gray-700";

    }

    const filteredLogs = useMemo(() => {

        return logs.filter(log => {

            const keyword = search.toLowerCase();

            return (

                log.action.toLowerCase().includes(keyword) ||

                log.details.toLowerCase().includes(keyword)

            );

        });

    }, [logs, search]);

    function requestDelete(action) {
        setPendingAction(() => action);
        setConfirmOpen(true);
    }

    function cancelConfirm() {
        setConfirmOpen(false);
        setPendingAction(null);
    }

    function proceedToAuth() {
        setConfirmOpen(false);
        setAdminPassword("");
        setAdminAuthOpen(true);
    }

    function closeAdminAuth() {
        if (adminAuthLoading) return;

        setAdminAuthOpen(false);
        setAdminPassword("");
        setPendingAction(null);
    }

    async function unlockAndDelete(event) {
        event.preventDefault();

        if (!adminPassword) {
            toast.error("Enter the admin password.");
            return;
        }

        const action = pendingAction;

        setAdminAuthLoading(true);

        try {

            const result = await verifyAdminPassword(adminPassword);

            if (!result.success) {
                toast.error(result.message || "Invalid admin password.");
                return;
            }

            setAdminAuthOpen(false);
            setAdminPassword("");
            setPendingAction(null);

            if (action) {
                await action();
            }

        } catch (err) {
            toast.error("Failed to verify admin password.");
        } finally {
            setAdminAuthLoading(false);
        }
    }

    async function deleteLog(id) {

        try {

            const result = await deleteActivityLog(id);

            if (!result.success) {
                toast.error(result.message || "Failed to delete log.");
                return;
            }

            toast.success(result.message || "Log deleted successfully.");
            loadLogs();

        } catch (err) {
            toast.error("Failed to delete log.");
        }

    }

    function handleDeleteLog(id) {
        requestDelete(() => deleteLog(id));
    }

    async function clearAllLogs() {

        try {

            const result = await clearActivityLogs();

            if (!result.success) {
                toast.error(result.message || "Failed to clear logs.");
                return;
            }

            toast.success(result.message || "Activity logs cleared successfully.");
            loadLogs();

        } catch (err) {
            toast.error("Failed to clear logs.");
        }

    }

    function handleClearAllLogs() {
        requestDelete(() => clearAllLogs());
    }

    return (

        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 text-slate-900">

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

                <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur">

                    <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-6 sm:px-8 sm:py-8">

                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-sm">

                            Real-time log

                        </span>

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                            <div>

                                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">

                                    Activity Log

                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">

                                    Track recent system actions, filtering, issuing, and return events in one place.

                                </p>

                            </div>

                            <div className="flex flex-wrap items-center gap-3">

                                <button
                                    type="button"
                                    onClick={handleClearAllLogs}
                                    className="inline-flex h-12 items-center justify-center rounded-xl border border-rose-200 bg-white px-5 text-sm font-semibold text-rose-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-rose-100"
                                >
                                    Clear All Logs
                                </button>

                                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">

                                        Matching records

                                    </p>

                                    <p className="mt-1 text-lg font-semibold text-slate-950">

                                        {filteredLogs.length}

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">

                        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">

                            <label className="mb-2 block text-sm font-semibold text-slate-700">

                                Search activity

                            </label>

                            <input
                                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                                placeholder="Search action or details..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                        </div>

                        {loading && (

                            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center shadow-sm">

                                <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

                                <p className="text-base font-medium text-slate-900">

                                    Loading activity...

                                </p>

                                <p className="mt-1 text-sm text-slate-500">

                                    Refreshing the latest system actions.

                                </p>

                            </div>

                        )}

                        {!loading && error && (

                            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700 shadow-sm">

                                <p className="font-semibold">

                                    Unable to load activity

                                </p>

                                <p className="mt-1 text-sm">

                                    {error}

                                </p>

                            </div>

                        )}

                        {!loading && !error && filteredLogs.length === 0 && (

                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center shadow-sm">

                                <p className="text-base font-medium text-slate-900">

                                    No matching activity found.

                                </p>

                                <p className="mt-2 text-sm text-slate-500">

                                    Try a different action name or search term.

                                </p>

                            </div>

                        )}

                        {!loading && !error && filteredLogs.length > 0 && (

                            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">

                                <table className="min-w-full divide-y divide-slate-200">

                                    <thead className="bg-slate-50">

                                        <tr>

                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">

                                                Time

                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">

                                                Action

                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">

                                                Details

                                            </th>

                                            <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">

                                                Action

                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody className="divide-y divide-slate-200 bg-white">

                                        {filteredLogs.map(log => {
                                            const action = log.action.toUpperCase();
                                            const isAdd = action.includes("ADD");
                                            const isDelete = action.includes("DELETE");
                                            const isIssue = action === "ISSUE";
                                            const isReturn = action === "RETURN";

                                            return (

                                                <tr
                                                    key={log.id}
                                                    className="transition-colors duration-200 hover:bg-slate-50"
                                                >

                                                    <td className="whitespace-nowrap px-5 py-5 align-top">

                                                        <p className="text-sm font-medium text-slate-500">

                                                            {new Date(log.created_at + "Z").toLocaleDateString("en-LK", {
                                                                timeZone: "Asia/Colombo",
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "2-digit"
                                                            })}

                                                        </p>

                                                        <p className="mt-1 text-base font-semibold text-slate-950">

                                                            {new Date(log.created_at + "Z").toLocaleTimeString("en-LK", {
                                                                timeZone: "Asia/Colombo",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                second: "2-digit",
                                                                hour12: true
                                                            })}

                                                        </p>

                                                    </td>

                                                    <td className="px-5 py-5 align-top">

                                                        <span
                                                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ring-1 ring-inset ${badgeColor(log.action)} ${
                                                                isAdd || isDelete || isIssue || isReturn ? "" : ""
                                                            }`}
                                                        >

                                                            <span aria-hidden="true">
                                                                {isAdd ? "+" : isDelete ? "−" : isIssue ? "↗" : isReturn ? "↩" : "•"}
                                                            </span>

                                                            {log.action}

                                                        </span>

                                                    </td>

                                                    <td className="px-5 py-5 align-top">

                                                        <p className="max-w-3xl text-sm leading-6 text-slate-700">

                                                            {log.details}

                                                        </p>

                                                    </td>

                                                    <td className="whitespace-nowrap px-5 py-5 align-top text-center">

                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteLog(log.id)}
                                                            className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-rose-100"
                                                        >
                                                            Delete
                                                        </button>

                                                    </td>

                                                </tr>

                                            );
                                        })}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </div>

            {confirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
                        <h2 className="mb-2 text-center text-2xl font-semibold tracking-tight text-slate-950">
                            Confirm Deletion
                        </h2>

                        <p className="mb-6 text-center text-sm text-slate-500">
                            This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={cancelConfirm}
                                className="flex-1 rounded-xl border border-slate-300 bg-white py-3 text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={proceedToAuth}
                                className="flex-1 rounded-xl bg-rose-600 py-3 text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-md"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {adminAuthOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
                    <form
                        onSubmit={unlockAndDelete}
                        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
                    >
                        <h2 className="mb-2 text-center text-2xl font-semibold tracking-tight text-slate-950">
                            Admin Authentication
                        </h2>

                        <p className="mb-6 text-center text-sm text-slate-500">
                            Enter the admin password to continue.
                        </p>

                        <input
                            type="password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            autoFocus
                            className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                            placeholder="Password"
                        />

                        <div className="mt-8 flex gap-3">
                            <button
                                type="button"
                                onClick={closeAdminAuth}
                                className="flex-1 rounded-xl border border-slate-300 bg-white py-3 text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={adminAuthLoading}
                                className="flex-1 rounded-xl bg-slate-950 py-3 text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {adminAuthLoading ? "Unlocking..." : "Unlock"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </div>

    );

}

export default Activity;
