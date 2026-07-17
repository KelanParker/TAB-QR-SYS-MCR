import { useState } from "react";
import toast from "react-hot-toast";
import { getIssuedTablet, returnTablets } from "../services/api";
import QRScannerModal from "../components/QRScannerModal";

function ReturnTablet() {
  const [showTabletScanner, setShowTabletScanner] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [notIssued, setNotIssued] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleTabletQR(code) {
    const value = code.trim().toUpperCase();

    if (!value) {
      return;
    }

    setLookingUp(true);
    setTransaction(null);
    setNotIssued(false);

    try {
      const result = await getIssuedTablet(value);

      if (!result.success) {
        setNotIssued(true);
        return;
      }

      setTransaction(result);
    } catch {
      setNotIssued(true);
    } finally {
      setLookingUp(false);
      setShowTabletScanner(false);
    }
  }

  function resetForNextScan() {
    setTransaction(null);
    setNotIssued(false);
  }

  async function handleReturn() {
    if (!transaction) return;

    setLoading(true);

    try {
      const result = await returnTablets([transaction.transactionId]);

      toast.success(result.message || "Tablet returned successfully.");

      setTransaction(null);
      setNotIssued(false);
      setShowTabletScanner(false);
    } catch {
      toast.error("Return failed.");
    } finally {
      setLoading(false);
    }
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
                  Return Tablet
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Scan a tablet QR code to look up its active loan and return it.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8 px-5 py-6 sm:px-8 sm:py-8">
            <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                    Scan Tablet
                  </h2>
                  <p className="text-sm text-slate-500">
                    Scan the tablet's QR code to load its current loan details.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTabletScanner(true)}
                  disabled={lookingUp}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {lookingUp ? "Looking up..." : "Scan Tablet QR"}
                </button>
              </div>

              {!transaction && !notIssued && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
                  <p className="text-base font-medium text-slate-900">
                    No tablet scanned yet.
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Scan a tablet's QR code to see who currently has it.
                  </p>
                </div>
              )}

              {notIssued && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-6 text-center shadow-sm">
                  <p className="text-base font-semibold text-amber-900">
                    Tablet is not currently issued.
                  </p>
                  <button
                    type="button"
                    onClick={resetForNextScan}
                    className="mt-4 inline-flex h-10 items-center justify-center rounded-xl border border-amber-300 bg-white px-4 text-sm font-semibold text-amber-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-amber-50 hover:shadow-md"
                  >
                    Scan Another
                  </button>
                </div>
              )}
            </section>

            {transaction && (
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                    Active Loan
                  </h2>
                  <p className="text-sm text-slate-500">
                    Confirm the details below before returning this tablet.
                  </p>
                </div>

                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-5 shadow-sm">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
                        Employee Name
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-950">
                        {transaction.employee.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
                        Employee Number
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-950">
                        {transaction.employee.employee_no}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
                        Tablet Name
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-950">
                        {transaction.tablet.display_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
                        Tablet Code
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-950">
                        {transaction.tablet.tablet_code}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
                        Borrow Time
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-950">
                        {transaction.borrow_time}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReturn}
                  disabled={loading}
                  className={`mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl px-6 text-sm font-semibold text-white shadow-sm transition duration-200 focus:outline-none focus:ring-4 focus:ring-rose-200 ${
                    loading
                      ? "cursor-not-allowed bg-slate-400"
                      : "bg-rose-600 hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-md"
                  }`}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Returning...
                    </span>
                  ) : (
                    "Return Tablet"
                  )}
                </button>
              </section>
            )}
          </div>
        </div>

        <QRScannerModal
          open={showTabletScanner}
          onClose={() => setShowTabletScanner(false)}
          onScan={handleTabletQR}
        />
      </div>
    </div>
  );
}

export default ReturnTablet;