import { useEffect, useMemo, useState } from "react";
import { getActivityLogs } from "../services/api";

function Activity() {

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

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

    return (

        <div className="min-h-screen bg-gray-100 py-10">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-4xl font-bold mb-6">

                    Activity Log

                </h1>

                <input
                    className="w-full mb-6 border rounded-lg p-3"
                    placeholder="Search action or details..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {loading && (

                    <div className="bg-white rounded-xl shadow p-6">

                        Loading activity...

                    </div>

                )}

                {!loading && error && (

                    <div className="bg-red-100 text-red-700 rounded-xl p-6">

                        {error}

                    </div>

                )}

                {!loading && !error && filteredLogs.length === 0 && (

                    <div className="bg-white rounded-xl shadow p-6">

                        No matching activity found.

                    </div>

                )}

                {!loading && !error && filteredLogs.length > 0 && (

                    <div className="bg-white rounded-xl shadow overflow-hidden">

                        <table className="w-full">

                            <thead>

                                <tr className="border-b bg-gray-50">

                                    <th className="text-left p-4">

                                        Time

                                    </th>

                                    <th className="text-left p-4">

                                        Action

                                    </th>

                                    <th className="text-left p-4">

                                        Details

                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredLogs.map(log => (

                                    <tr
                                        key={log.id}
                                        className="border-b hover:bg-gray-50"
                                    >

                                        <td className="p-4">

                                            {new Date(log.created_at + "Z").toLocaleString("en-LK", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
})}

                                        </td>

                                        <td className="p-4">

                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeColor(log.action)}`}
                                            >

                                                {log.action}

                                            </span>

                                        </td>

                                        <td className="p-4">

                                            {log.details}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}

export default Activity;