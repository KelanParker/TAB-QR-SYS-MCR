function TabletCard({ tablet }) {

  const isAvailable = tablet.status === "AVAILABLE";

  return (

    <div
      className={`rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
        isAvailable
          ? "bg-white border-emerald-200"
          : "bg-rose-50/70 border-rose-200"
      }`}
    >

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Tablet
          </p>

          <h2 className="mt-2 truncate text-xl font-semibold tracking-tight text-slate-950">
            {tablet.display_name}
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-500">
            {tablet.tablet_code}
          </p>

        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ring-1 ring-inset ${
            isAvailable
              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
              : "bg-rose-50 text-rose-700 ring-rose-200"
          }`}
        >
          {tablet.status}
        </span>

      </div>

      <div className="mt-5">

        {isAvailable ? (

          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-emerald-700">
            <p className="text-sm font-semibold">Ready to Issue</p>
            <p className="mt-1 text-sm text-emerald-600/90">Available for checkout right now</p>
          </div>

        ) : (

          <div className="space-y-3 rounded-2xl bg-white px-4 py-3 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Borrowed By
            </p>

            <p className="text-base font-semibold text-slate-950">
              {tablet.employee_name}
            </p>

            <p className="text-sm text-slate-500">
              {new Date(tablet.borrow_time).toLocaleString()}
            </p>

          </div>

        )}

      </div>

    </div>

  );

}

export default TabletCard;