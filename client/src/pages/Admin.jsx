import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import QRModal from "../components/QRModal";

import {
  getEmployees,
  addEmployee,
  deleteEmployee,
  getTablets,
  addTablet,
  deleteTablet,
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

  async function handleDeleteEmployee(employee) {
    const confirm = await Swal.fire({
      title: "Delete Employee?",
      text: employee.name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    });

    if (!confirm.isConfirmed) return;

    const result = await deleteEmployee(employee.id);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    loadEmployees();
  }

  async function handleAddTablet() {
    if (!tabletCode || !displayName) {
      toast.error("Fill all fields.");
      return;
    }

    const result = await addTablet(tabletCode.toUpperCase(), displayName);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setTabletCode("");
    setDisplayName("");
    loadTablets();
  }

  async function handleDeleteTablet(tablet) {
    const confirm = await Swal.fire({
      title: "Delete Tablet?",
      text: tablet.display_name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    });

    if (!confirm.isConfirmed) return;

    const result = await deleteTablet(tablet.id);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    loadTablets();
  }

  function openQR(title, value) {
    setQrTitle(title);
    setQrValue(value);
    setQrOpen(true);
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
                            onClick={() =>
                              openQR("Employee QR", employee.employee_no)
                            }
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
    </div>
  );
}

export default Admin;
