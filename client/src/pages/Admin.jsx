import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import QRModal from "../components/QRModal";

import {
  getEmployees,
  getEmployeeQrToken,
  addEmployee,
  deleteEmployee,
  getTablets,
  addTablet,
  deleteTablet,
  verifyAdminPassword,
  exportBackup,
  importBackup,
} from "../services/api";

function Admin() {
  const [employees, setEmployees] = useState([]);
  const [employeeNo, setEmployeeNo] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  const [tablets, setTablets] = useState([]);
  const [tabletCode, setTabletCode] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [qrOpen, setQrOpen] = useState(false);
  const [qrTitle, setQrTitle] = useState("");
  const [qrValue, setQrValue] = useState("");

  const [adminAuthOpen, setAdminAuthOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);
  const [pendingAdminAction, setPendingAdminAction] = useState(null);

  const importFileInputRef = useRef(null);
  const [importConfirmOpen, setImportConfirmOpen] = useState(false);
  const [pendingImportData, setPendingImportData] = useState(null);

  async function loadEmployees() {
    const data = await getEmployees();

    if (data.success) {
      setEmployees(data.employees);
    }
  }

  async function loadTablets() {
    const data = await getTablets();

    if (data.success) {
      setTablets(data.tablets);
    }
  }

  useEffect(() => {
    loadEmployees();
    loadTablets();
  }, []);

  async function handleAddEmployee() {
    if (!employeeNo || !employeeName) {
      toast.error("Fill all fields.");
      return;
    }

    const result = await addEmployee(employeeNo.toUpperCase(), employeeName);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setEmployeeNo("");
    setEmployeeName("");
    loadEmployees();
  }

  function openAdminAuth(action) {
    setPendingAdminAction(() => action);
    setAdminPassword("");
    setAdminAuthOpen(true);
  }

  function closeAdminAuth() {
    if (adminAuthLoading) return;

    setAdminAuthOpen(false);
    setAdminPassword("");
    setPendingAdminAction(null);
  }

  async function unlockAdminAccess(event) {
    event.preventDefault();

    if (!adminPassword) {
      toast.error("Enter the admin password.");
      return;
    }

    const action = pendingAdminAction;

    setAdminAuthLoading(true);

    try {
      const result = await verifyAdminPassword(adminPassword);

      if (!result.success) {
        toast.error(result.message || "Invalid admin password.");
        return;
      }

      setAdminAuthOpen(false);
      setAdminPassword("");
      setPendingAdminAction(null);

      if (action) {
        await action();
      }
    } catch (error) {
      toast.error("Failed to verify admin password.");
    } finally {
      setAdminAuthLoading(false);
    }
  }

  async function deleteEmployeeRecord(employee) {
    const result = await deleteEmployee(employee.id);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    loadEmployees();
  }

  function handleDeleteEmployee(employee) {
    openAdminAuth(() => deleteEmployeeRecord(employee));
  }

  async function submitAddTablet(tabletCodeValue, displayNameValue) {
    const result = await addTablet(tabletCodeValue, displayNameValue);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setTabletCode("");
    setDisplayName("");
    loadTablets();
  }

  function handleAddTablet() {
    if (!tabletCode || !displayName) {
      toast.error("Fill all fields.");
      return;
    }

    const tabletCodeValue = tabletCode.toUpperCase();
    const displayNameValue = displayName;

    openAdminAuth(() => submitAddTablet(tabletCodeValue, displayNameValue));
  }

  async function deleteTabletRecord(tablet) {
    const result = await deleteTablet(tablet.id);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    loadTablets();
  }

  function handleDeleteTablet(tablet) {
    openAdminAuth(() => deleteTabletRecord(tablet));
  }

  async function downloadBackup() {
    try {
      const data = await exportBackup();

      const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
      );

      const url = URL.createObjectURL(blob);
      const date = new Date().toISOString().split("T")[0];

      const link = document.createElement("a");
      link.href = url;
      link.download = `mcr-backup-${date}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Backup exported successfully.");
    } catch (error) {
      toast.error("Failed to export backup.");
    }
  }

  function handleExportBackup() {
    openAdminAuth(() => downloadBackup());
  }

  function handleImportBackupClick() {
    importFileInputRef.current?.click();
  }

  async function handleImportFileSelected(event) {
    const file = event.target.files?.[0];

    // Reset so selecting the same file again still triggers onChange.
    event.target.value = "";

    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const hasEmployees = Array.isArray(parsed?.employees);
      const hasTablets = Array.isArray(parsed?.tablets);
      const hasTransactions = Array.isArray(parsed?.transactions);

      if (!parsed || (!hasEmployees && !hasTablets && !hasTransactions)) {
        toast.error("Invalid backup file.");
        return;
      }

      setPendingImportData(parsed);
      setImportConfirmOpen(true);
    } catch (error) {
      toast.error("Invalid backup file.");
    }
  }

  function cancelImportConfirm() {
    setImportConfirmOpen(false);
    setPendingImportData(null);
  }

  function confirmImport() {
    const data = pendingImportData;

    setImportConfirmOpen(false);
    setPendingImportData(null);

    openAdminAuth(() => performImport(data));
  }

  async function performImport(data) {
    try {
      const result = await importBackup(data);

      if (!result.success) {
        toast.error(result.message || "Failed to restore backup.");
        return;
      }

      toast.success(result.message || "Backup restored successfully.");
      loadEmployees();
      loadTablets();
    } catch (error) {
      toast.error("Failed to restore backup.");
    }
  }

  async function openQR(title, value) {
    let qrValue = value;

    try {
      if (title === "Employee QR") {
        const result = await getEmployeeQrToken(value);
        qrValue = result.token;
      }

      setQrTitle(title);
      setQrValue(qrValue);
      setQrOpen(true);
    } catch (error) {
      toast.error("Failed to generate employee QR.");
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur">
          <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-6 sm:px-8 sm:py-8">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-sm">
              Admin workspace
            </span>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  Admin Panel
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Manage employees and tablets, generate QR codes, and keep inventory current.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-200"
                >
                  Export Backup
                </button>

                <button
                  type="button"
                  onClick={handleImportBackupClick}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-200"
                >
                  Import Backup
                </button>

                <input
                  ref={importFileInputRef}
                  type="file"
                  accept="application/json,.json"
                  onChange={handleImportFileSelected}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8 px-5 py-6 sm:px-8 sm:py-8">
            <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
                    Employees
                  </h2>
                  <p className="text-sm text-slate-500">
                    Add employees, generate QR codes, and remove entries when needed.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                <input
                  className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  placeholder="Employee Code"
                  value={employeeNo}
                  onChange={(e) =>
                    setEmployeeNo(e.target.value.toUpperCase())
                  }
                />

                <input
                  className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  placeholder="Employee Name"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                />

                <button
                  type="button"
                  onClick={handleAddEmployee}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-200"
                >
                  Add Employee
                </button>
              </div>

              <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Employee No
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Name
                      </th>
                      <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        QR
                      </th>
                      <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 bg-white">
                    {employees.map((employee) => (
                      <tr key={employee.id} className="transition-colors duration-200 hover:bg-slate-50">
                        <td className="whitespace-nowrap px-5 py-5 text-sm font-semibold text-slate-950">
                          {employee.employee_no}
                        </td>

                        <td className="px-5 py-5 text-sm text-slate-700">
                          {employee.name}
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 text-center">
                          <button
                            type="button"
                            onClick={() => openQR("Employee QR", employee.employee_no)}
                            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-100"
                          >
                            QR
                          </button>
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteEmployee(employee)}
                            className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-rose-100"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
                    Tablets
                  </h2>
                  <p className="text-sm text-slate-500">
                    Add tablet inventory, generate QR codes, and manage device records.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                <input
                  className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  placeholder="Tablet Code"
                  value={tabletCode}
                  onChange={(e) =>
                    setTabletCode(e.target.value.toUpperCase())
                  }
                />

                <input
                  className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  placeholder="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />

                <button
                  type="button"
                  onClick={handleAddTablet}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-sky-600 px-6 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-sky-200"
                >
                  Add Tablet
                </button>
              </div>

              <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Tablet Code
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Display Name
                      </th>
                      <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        QR
                      </th>
                      <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 bg-white">
                    {tablets.map((tablet) => (
                      <tr key={tablet.id} className="transition-colors duration-200 hover:bg-slate-50">
                        <td className="whitespace-nowrap px-5 py-5 text-sm font-semibold text-slate-950">
                          {tablet.tablet_code}
                        </td>

                        <td className="px-5 py-5 text-sm text-slate-700">
                          {tablet.display_name}
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 text-center">
                          <button
                            type="button"
                            onClick={() => openQR("Tablet QR", tablet.tablet_code)}
                            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-100"
                          >
                            QR
                          </button>
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteTablet(tablet)}
                            className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-rose-100"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>

      <QRModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        title={qrTitle}
        value={qrValue}
      />

      {adminAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <form
            onSubmit={unlockAdminAccess}
            className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
          >
            <h2 className="mb-2 text-center text-2xl font-semibold tracking-tight text-slate-950">
              Admin Authentication
            </h2>

            <p className="mb-6 text-center text-sm text-slate-500">
              Enter the admin password to continue.
            </p>

            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              autoFocus
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              placeholder="Password"
            />

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={closeAdminAuth}
                className="flex-1 rounded-xl border border-slate-300 bg-white py-3 text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={adminAuthLoading}
                className="flex-1 rounded-xl bg-slate-950 py-3 text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
              >
                {adminAuthLoading ? "Unlocking..." : "Unlock"}
              </button>
            </div>
          </form>
        </div>
      )}

      {importConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <h2 className="mb-2 text-center text-2xl font-semibold tracking-tight text-slate-950">
              Restore Backup
            </h2>

            <p className="mb-6 text-center text-sm text-slate-500">
              This will overwrite the current database.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelImportConfirm}
                className="flex-1 rounded-xl border border-slate-300 bg-white py-3 text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmImport}
                className="flex-1 rounded-xl bg-rose-600 py-3 text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-md"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
