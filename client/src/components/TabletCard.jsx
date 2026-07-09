function TabletCard({ tablet }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition">

      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-xl font-bold">
            {tablet.display_name}
          </h2>

          <p className="text-gray-500">
            {tablet.tablet_code}
          </p>
        </div>

        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
          Available
        </span>

      </div>

    </div>
  );
}

export default TabletCard;