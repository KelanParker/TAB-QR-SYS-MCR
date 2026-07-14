function StatCard({ title, value, bgColor, textColor }) {

    return (

        <div className={`rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${bgColor}`}>

            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${textColor}`}>

                {title}

            </p>

            <h2 className={`mt-3 text-4xl font-semibold tracking-tight ${textColor}`}>

                {value}

            </h2>

        </div>

    );

}

export default StatCard;