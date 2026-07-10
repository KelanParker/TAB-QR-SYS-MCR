function TabletCard({ tablet }) {

  const isAvailable = tablet.status === "AVAILABLE";

  return (

    <div
      className={`rounded-xl shadow-md p-5 border transition hover:shadow-lg ${
        isAvailable
          ? "bg-white border-green-300"
          : "bg-red-50 border-red-300"
      }`}
    >

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-xl font-bold">
            {tablet.display_name}
          </h2>

          <p className="text-gray-500">
            {tablet.tablet_code}
          </p>

        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isAvailable
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {tablet.status}
        </span>

      </div>

      <div className="mt-5">

        {isAvailable ? (

          <p className="text-green-600 font-medium">
            ✅ Ready to Issue
          </p>

        ) : (

          <>

            <p className="font-semibold text-red-700">
              Borrowed By
            </p>

            <p className="text-gray-700">
              {tablet.employee_name}
            </p>

            <p className="text-sm text-gray-500 mt-2">
              {new Date(tablet.borrow_time).toLocaleString()}
            </p>

          </>

        )}

      </div>

    </div>

  );

}

export default TabletCard;