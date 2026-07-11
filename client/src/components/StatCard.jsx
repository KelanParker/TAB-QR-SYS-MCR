function StatCard({ title, value, bgColor, textColor }) {

    return (

        <div className={`rounded-xl shadow p-6 ${bgColor}`}>

            <p className={`text-sm font-medium ${textColor}`}>

                {title}

            </p>

            <h2 className={`text-4xl font-bold mt-3 ${textColor}`}>

                {value}

            </h2>

        </div>

    );

}

export default StatCard;