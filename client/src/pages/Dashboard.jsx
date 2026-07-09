import { useEffect, useState } from "react";
import TabletCard from "../components/TabletCard";

function Dashboard() {

    const [tablets, setTablets] = useState([]);

    useEffect(() => {

        fetch("http://localhost:5000/api/tablets")
            .then(res => res.json())
            .then(data => setTablets(data));

    }, []);

    return (

        <div className="min-h-screen bg-gray-100">

            <div className="max-w-6xl mx-auto p-8">

                <h1 className="text-4xl font-bold mb-8">
                    MCR Tablet Management System
                </h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                    {tablets.map(tablet => (

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