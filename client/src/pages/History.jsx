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

        return new Date(date).toLocaleString();

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

        <div className="min-h-screen bg-gray-100 py-10">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-4xl font-bold mb-6">

                    Transaction History

                </h1>

                <input

                    className="w-full mb-6 border rounded-lg p-3"

                    placeholder="Search employee, tablet code or tablet name..."

                    value={search}

                    onChange={(e) => setSearch(e.target.value)}

                />

                {loading && (

                    <div className="bg-white rounded-xl shadow p-6">

                        Loading history...

                    </div>

                )}

                {!loading && error && (

                    <div className="bg-red-100 text-red-700 rounded-xl p-6">

                        {error}

                    </div>

                )}

                {!loading && !error && filteredHistory.length === 0 && (

                    <div className="bg-white rounded-xl shadow p-6">

                        No matching transactions found.

                    </div>

                )}

                <div className="space-y-5">

                    {filteredHistory.map((item) => (

                        <div

                            key={item.id}

                            className="bg-white rounded-xl shadow-md p-6 border border-gray-200"

                        >

                            <div className="flex justify-between items-center mb-4">

                                <div>

                                    <h2 className="text-xl font-bold">

                                        {item.display_name}

                                    </h2>

                                    <p className="text-gray-500">

                                        {item.tablet_code}

                                    </p>

                                </div>

                                {item.return_time ? (

                                    <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-semibold">

                                        RETURNED

                                    </span>

                                ) : (

                                    <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full font-semibold">

                                        ISSUED

                                    </span>

                                )}

                            </div>

                            <div className="grid md:grid-cols-3 gap-6">

                                <div>

                                    <p className="text-gray-500 text-sm">

                                        Employee

                                    </p>

                                    <p className="font-semibold">

                                        {item.employee_name}

                                    </p>

                                    <p className="text-gray-500">

                                        {item.employee_no}

                                    </p>

                                </div>

                                <div>

                                    <p className="text-gray-500 text-sm">

                                        Borrowed

                                    </p>

                                    <p>

                                        {formatDate(item.borrow_time)}

                                    </p>

                                </div>

                                <div>

                                    <p className="text-gray-500 text-sm">

                                        Returned

                                    </p>

                                    <p>

                                        {formatDate(item.return_time)}

                                    </p>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );

}

export default History;