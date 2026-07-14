import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useState, useRef } from "react";
import {
  getEmployee,
  getTablet,
  issueTablets,
} from "../services/api";
import QRScannerModal from "../components/QRScannerModal";

function IssueTablet() {
  const [employeeCode, setEmployeeCode] = useState("");
  const [employee, setEmployee] = useState(null);

  const [tabletCode, setTabletCode] = useState("");
  const [selectedTablets, setSelectedTablets] = useState([]);

  const [loading, setLoading] = useState(false);

  const [employeeScannerOpen, setEmployeeScannerOpen] = useState(false);
  const [tabletScannerOpen, setTabletScannerOpen] = useState(false);

  const employeeInputRef = useRef(null);
  const tabletInputRef = useRef(null);

  async function handleEmployeeLookup(code) {
    if (code.length < 6) {
      setEmployee(null);
      return;
    }

    try {
      const result = await getEmployee(code);

      if (result.success) {
        setEmployee(result.employee);

        setTimeout(() => {
          tabletInputRef.current?.focus();
        }, 100);
      } else {
        setEmployee(null);
      }
    } catch {
      setEmployee(null);
    }
  }

  async function handleAddTablet(scannedCode = null) {
    const code = scannedCode || tabletCode;

    if (!employee) {
      toast.error("Select an employee first.");
      return;
    }

    if (code.length < 6) return;

    if (selectedTablets.length >= 7) {
      toast.error("Maximum tablets selected.");
      return;
    }

    try {
      const result = await getTablet(code);

      if (!result.success) {
        toast.error("Tablet not found.");
        return;
      }

      const exists = selectedTablets.some(
        tablet =>
          tablet.tablet_code === result.tablet.tablet_code
      );

      if (exists) {
        toast.error("Tablet already selected.");
        setTabletCode("");
        return;
      }

      setSelectedTablets([
        ...selectedTablets,
        result.tablet,
      ]);

      setTabletCode("");

      setTimeout(() => {
        tabletInputRef.current?.focus();
      }, 100);
    } catch {
      toast.error("Unable to find tablet.");
    }
  }

  function removeTablet(tabletCode) {
    setSelectedTablets(
      selectedTablets.filter(
        tablet => tablet.tablet_code !== tabletCode
      )
    );
  }

  async function handleIssue() {
    if (!employee) {
      toast.error("Select an employee.");
      return;
    }

    if (selectedTablets.length === 0) {
      toast.error("Select at least one tablet.");
      return;
    }

    const result = await Swal.fire({
      title: "Issue Tablets?",
      html: `
        <div style="text-align:left">
          <strong>Employee</strong>
          <br>
          ${employee.name}
          <br><br>
          <strong>Tablets</strong>
          <ul style="margin-top:8px">
            ${selectedTablets
              .map(
                tablet =>
                  `<li>${tablet.display_name}</li>`
              )
              .join("")}
          </ul>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Issue",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a"
    });

    if (!result.isConfirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await issueTablets(
        employee.employee_no,
        selectedTablets.map(
          tablet => tablet.tablet_code
        )
      );

      toast.success(
        `Issued ${response.issuedTablets.length} tablet(s) successfully.`
      );

      setEmployee(null);
      setEmployeeCode("");
      setSelectedTablets([]);
      setTabletCode("");
      employeeInputRef.current?.focus();
    }
    catch (error) {
      toast.error(
        error?.message || "Issue failed."
      );
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur">
          <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-6 sm:px-8 sm:py-8">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-sm">
              Tablet issuance
            </span>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Issue Tablets
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Enter an employee code, scan QR codes, and build a tablet set before issuing.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Selected
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {selectedTablets.length} / 7
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
                    Lookup by employee code or scan a QR code.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                <input
                  ref={employeeInputRef}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  placeholder="EMP001"
                  value={employeeCode}
                  onChange={(e) => {
                    const code = e.target.value.toUpperCase();
                    setEmployeeCode(code);
                    handleEmployeeLookup(code);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleEmployeeLookup(employeeCode);
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={() => setEmployeeScannerOpen(true)}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-200"
                >
                  Scan QR
                </button>
              </div>

              {employee ? (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                    Employee found
                  </p>
                  <p className="mt-2 text-base font-semibold text-emerald-950">
                    ✅ {employee.name}
                  </p>
                  <p className="mt-1 text-sm text-emerald-700">
                    {employee.employee_no}
                  </p>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-500">
                  Search for an employee to begin issuing tablets.
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                    Tablet
                  </h2>
                  <p className="text-sm text-slate-500">
                    Add tablets manually or scan QR codes.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
                <input
                  ref={tabletInputRef}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  placeholder="TAB001"
                  value={tabletCode}
                  onChange={(e) =>
                    setTabletCode(
                      e.target.value.toUpperCase()
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddTablet();
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={() => setTabletScannerOpen(true)}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-200"
                >
                  Scan QR
                </button>

                <button
                  type="button"
                  onClick={handleAddTablet}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-200"
                >
                  Add
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                    Selected Tablets
                  </h2>
                  <p className="text-sm text-slate-500">
                    Review the tablets that will be issued together.
                  </p>
                </div>

                <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {selectedTablets.length} selected
                </span>
              </div>

              {selectedTablets.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
                  <p className="text-base font-medium text-slate-900">
                    No tablets selected.
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Add one or more tablets to prepare an issuance.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedTablets.map((tablet) => (
                    <div
                      key={tablet.tablet_code}
                      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition duration-200 hover:border-slate-300 hover:bg-white sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-slate-950">
                          {tablet.display_name}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {tablet.tablet_code}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeTablet(tablet.tablet_code)}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-rose-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <button
              onClick={handleIssue}
              disabled={loading || selectedTablets.length === 0}
              className={`inline-flex h-12 w-full items-center justify-center rounded-xl px-6 text-sm font-semibold text-white shadow-sm transition duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-200 ${
                loading
                  ? "cursor-not-allowed bg-slate-400"
                  : "bg-emerald-600 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md"
              } ${selectedTablets.length === 0 && !loading ? "opacity-70" : ""}`}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Issuing...
                </span>
              ) : (
                "Issue Tablets"
              )}
            </button>
          </div>
        </div>

        <QRScannerModal
          open={employeeScannerOpen}
          onClose={() => setEmployeeScannerOpen(false)}
          onScan={(value) => {
            const code = value.toUpperCase();
            setEmployeeCode(code);
            handleEmployeeLookup(code);
          }}
        />

        <QRScannerModal
          open={tabletScannerOpen}
          onClose={() => setTabletScannerOpen(false)}
          onScan={(value) => {
            const code = value.trim().toUpperCase();
            setTabletCode(code);
            handleAddTablet(code);
          }}
        />
      </div>
    </div>
  );
}

export default IssueTablet;