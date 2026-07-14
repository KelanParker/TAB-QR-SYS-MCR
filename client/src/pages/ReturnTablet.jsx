import { useState } from "react";
import toast from "react-hot-toast";
import {
  getEmployee,
  getActiveTablets,
  returnTablets,
} from "../services/api";
import QRScannerModal from "../components/QRScannerModal";

function ReturnTablet() {

  const [employeeCode, setEmployeeCode] = useState("");

  const [employee, setEmployee] = useState(null);

  const [borrowedTablets, setBorrowedTablets] = useState([]);

  const [selectedTransactions, setSelectedTransactions] = useState([]);

  const [showEmployeeScanner, setShowEmployeeScanner] = useState(false);

  const [showTabletScanner, setShowTabletScanner] = useState(false);

  async function handleLookup(code) {

    if (code.length < 6) {

      setEmployee(null);
      setBorrowedTablets([]);
      return;

    }

    try {

      const employeeResult = await getEmployee(code);

      if (!employeeResult.success) {

        setEmployee(null);
        setBorrowedTablets([]);

        return;

      }

      setEmployee(employeeResult.employee);

      const tabletsResult =
        await getActiveTablets(code);

      if (tabletsResult.success) {

        setBorrowedTablets(tabletsResult.tablets);

      }

    }

    catch {

      setEmployee(null);
      setBorrowedTablets([]);

    }

  }

  function toggleTransaction(id) {

    if (selectedTransactions.includes(id)) {

      setSelectedTransactions(

        selectedTransactions.filter(

          t => t !== id

        )

      );

    }

    else {

      setSelectedTransactions([

        ...selectedTransactions,
        id

      ]);

    }

  }

  async function handleReturn() {

    if (selectedTransactions.length === 0) {

      toast.error("Select at least one tablet.");

      return;

    }

    try {

      const result =
        await returnTablets(selectedTransactions);

      toast.success(result.message);

      setEmployeeCode("");
      setEmployee(null);

      setBorrowedTablets([]);

      setSelectedTransactions([]);

      setShowEmployeeScanner(false);
setShowTabletScanner(false);

    }

    catch {

      toast.error("Return failed.");

    }

  }

  function handleEmployeeQR(code) {
  const value = code.trim().toUpperCase();

  if (!value.startsWith("EMP")) {
    toast.error("Invalid Employee QR");
    return;
  }

  setEmployeeCode(value);
  handleLookup(value);
}

function handleTabletQR(code) {
  const value = code.trim().toUpperCase();

  const tablet = borrowedTablets.find(
    (t) => t.tablet_code === value
  );

  if (!tablet) {
    toast.error("Tablet not borrowed by this employee.");
    return;
  }

  if (selectedTransactions.includes(tablet.transactionId)) {
    toast("Tablet already selected.");
    return;
}

setSelectedTransactions((prev) => [
    ...prev,
    tablet.transactionId,
]);

toast.success(`${tablet.display_name} selected`);
}



  return (

    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 text-slate-900">

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur">

          <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-6 sm:px-8 sm:py-8">

            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-sm">
              Tablet returns
            </span>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">

                  Return Tablets

                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">

                  Look up an employee, review active tablets, and return selected items in one flow.

                </p>

              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">

                  Selected

                </p>

                <p className="mt-1 text-lg font-semibold text-slate-950">

                  {selectedTransactions.length}

                </p>

              </div>

            </div>

          </div>

          <div className="space-y-8 px-5 py-6 sm:px-8 sm:py-8">

            <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">

              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <h2 className="text-lg font-semibold tracking-tight text-slate-950">

                    Employee

                  </h2>

                  <p className="text-sm text-slate-500">

                    Scan or enter the employee code to load borrowed tablets.

                  </p>

                </div>

              </div>

              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
  <input
    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
    placeholder="EMP001"
    value={employeeCode}
    onChange={(e) => {
      const code = e.target.value.toUpperCase();
      setEmployeeCode(code);
      handleLookup(code);
    }}
  />

  <button
    type="button"
    onClick={() => setShowEmployeeScanner(true)}
    className="inline-flex h-12 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-200"
  >
    Scan QR
  </button>
</div>

              {employee && (

                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 shadow-sm">

                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">

                    Employee loaded

                  </p>

                  <p className="mt-2 text-base font-semibold text-emerald-950">

                    ✅ {employee.name}

                  </p>

                  <p className="mt-1 text-sm text-emerald-700">

                    {employee.employee_no}

                  </p>

                </div>

              )}

            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <h2 className="text-lg font-semibold tracking-tight text-slate-950">

                    Borrowed Tablets

                  </h2>

                  <p className="text-sm text-slate-500">

                    Select the tablets you want to return.

                  </p>

                </div>

                <button

                  type="button"

                  onClick={() => setShowTabletScanner(true)}

                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-200"

                >

                  Scan QR

                </button>

              </div>

              {

                borrowedTablets.length === 0

                ?

                (

                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">

                    <p className="text-base font-medium text-slate-900">

                      No active tablets.

                    </p>

                    <p className="mt-2 text-sm text-slate-500">

                      Load an employee to see tablets currently assigned to them.

                    </p>

                  </div>

                )

                :

                (

                  <div className="space-y-3">

                    {

                      borrowedTablets.map(

                        tablet => (

                          <label

                            key={tablet.transactionId}

                            className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                              selectedTransactions.includes(tablet.transactionId)
                                ? "border-indigo-200 bg-indigo-50/70"
                                : "border-slate-200 bg-slate-50/70 hover:bg-white"
                            }`}

                          >

                            <div className="min-w-0">

                              <p className="truncate text-base font-semibold text-slate-950">

                                {tablet.display_name}

                              </p>

                              <p className="mt-1 text-sm text-slate-500">

                                {tablet.tablet_code}

                              </p>

                            </div>

                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white shadow-sm transition duration-200">

                              <input

                                type="checkbox"

                                checked={selectedTransactions.includes(

                                  tablet.transactionId

                                )}

                                onChange={() =>

                                  toggleTransaction(

                                    tablet.transactionId

                                  )

                                }

                                className="h-4 w-4 accent-indigo-600"

                              />

                            </span>

                          </label>

                        )

                      )

                    }

                  </div>

                )

              }

            </section>

            <button

              onClick={handleReturn}

              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-rose-600 px-6 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-rose-200"

            >

              Return Selected Tablets

            </button>

          </div>

        </div>

      </div>

      <QRScannerModal
  open={showEmployeeScanner}
  onClose={() => setShowEmployeeScanner(false)}
  onScan={handleEmployeeQR}
/
>

<QRScannerModal
  open={showTabletScanner}
  onClose={() => setShowTabletScanner(false)}
  onScan={handleTabletQR}
/
>

    </div>

  );

}

export default ReturnTablet;