import { useEffect, useState } from "react";
import TabletCard from "../components/TabletCard";
import { getDashboard } from "../services/api";

function Dashboard() {

    const [tablets, setTablets] = useState([]);

    async function loadDashboard() {

        const data = await getDashboard();

        setTablets(data.tablets);

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