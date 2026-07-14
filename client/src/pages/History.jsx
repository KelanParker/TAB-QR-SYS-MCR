import { useEffect, useMemo, useState } from "react";
import { getHistory } from "../services/api";

function History() {

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {

        async function loadHistory() {

            try {

                const result = await getHistory();

                setHistory(result.history);

            } catch (err) {

                setError(err.message || "Failed to load history.");

            } finally {

                setLoading(false);

            }

        }

        loadHistory();

        const interval = setInterval(loadHistory, 10000);

        return () => clearInterval(interval);

    }, []);

    function formatDate(date) {

    if (!date) return "-";

    return new Date(date + "Z").toLocaleString("en-LK", {
        timeZone: "Asia/Colombo",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });

}

    const filteredHistory = useMemo(() => {

        return history.filter(item => {

            const keyword = search.toLowerCase();

            return (

                item.employee_name.toLowerCase().includes(keyword) ||

                item.employee_no.toLowerCase().includes(keyword) ||

                item.tablet_code.toLowerCase().includes(keyword) ||

                item.display_name.toLowerCase().includes(keyword)

            );

        });

    }, [history, search]);

    return (

        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 text-slate-900">

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

                <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur">

                    <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-6 sm:px-8 sm:py-8">

                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-sm">

                            Activity log

                        </span>

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                            <div>

                                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">

                                    Transaction History

                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">

                                    Review issue and return activity with employee, tablet, and timestamp details.

                                </p>

                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">

                                    Matching records

                                </p>

                                <p className="mt-1 text-lg font-semibold text-slate-950">

                                    {filteredHistory.length}

                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">

                        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">

                            <label className="mb-2 block text-sm font-semibold text-slate-700">

                                Search history

                            </label>

                            <input

                                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"

                                placeholder="Search employee, tablet code or tablet name..."

                                value={search}

                                onChange={(e) => setSearch(e.target.value)}

                            />

                        </div>

                        {loading && (

                            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center shadow-sm">

                                <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

                                <p className="text-base font-medium text-slate-900">

                                    Loading history...

                                </p>

                                <p className="mt-1 text-sm text-slate-500">

                                    Refreshing transaction records.

                                </p>

                            </div>

                        )}

                        {!loading && error && (

                            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700 shadow-sm">

                                <p className="font-semibold">

                                    Unable to load history

                                </p>

                                <p className="mt-1 text-sm">

                                    {error}

                                </p>

                            </div>

                        )}

                        {!loading && !error && filteredHistory.length === 0 && (

                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center shadow-sm">

                                <p className="text-base font-medium text-slate-900">

                                    No matching transactions found.

                                </p>

                                <p className="mt-2 text-sm text-slate-500">

                                    Try a different employee name, employee code, tablet code, or tablet name.

                                </p>

                            </div>

                        )}

                        {!loading && !error && filteredHistory.length > 0 && (

                            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">

                                <table className="min-w-full divide-y divide-slate-200">

                                    <thead className="bg-slate-50">

                                        <tr>

                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">

                                                Tablet

                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">

                                                Employee

                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">

                                                Borrowed

                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">

                                                Returned

                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">

                                                Status

                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody className="divide-y divide-slate-200 bg-white">

                                        {filteredHistory.map((item) => (

                                            <tr key={item.id} className="transition-colors duration-200 hover:bg-slate-50">

                                                <td className="whitespace-nowrap px-5 py-5 align-top">

                                                    <p className="text-base font-semibold text-slate-950">

                                                        {item.display_name}

                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-500">

                                                        {item.tablet_code}

                                                    </p>

                                                </td>

                                                <td className="px-5 py-5 align-top">

                                                    <p className="text-sm font-semibold text-slate-950">

                                                        {item.employee_name}

                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-500">

                                                        {item.employee_no}

                                                    </p>

                                                </td>

                                                <td className="whitespace-nowrap px-5 py-5 align-top text-sm text-slate-700">

                                                    {formatDate(item.borrow_time)}

                                                </td>

                                                <td className="whitespace-nowrap px-5 py-5 align-top text-sm text-slate-700">

                                                    {formatDate(item.return_time)}

                                                </td>

                                                <td className="whitespace-nowrap px-5 py-5 align-top">

                                                    {item.return_time ? (

                                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700 ring-1 ring-inset ring-blue-200">

                                                            Returned

                                                        </span>

                                                    ) : (

                                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 ring-1 ring-inset ring-emerald-200">

                                                            Issued

                                                        </span>

                                                    )}

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );

}

export default History;