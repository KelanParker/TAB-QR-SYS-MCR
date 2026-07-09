import toast from "react-hot-toast";
import { useState } from "react";
import {
  getEmployee,
  getTablet,
  issueTablets,
} from "../services/api";

function IssueTablet() {
  const [employeeCode, setEmployeeCode] = useState("");
  const [employee, setEmployee] = useState(null);

  const [tabletCode, setTabletCode] = useState("");
  const [selectedTablets, setSelectedTablets] = useState([]);

  async function handleEmployeeLookup(code) {
    if (code.length < 6) {
      setEmployee(null);
      return;
    }

    try {
      const result = await getEmployee(code);

      if (result.success) {
        setEmployee(result.employee);
      } else {
        setEmployee(null);
      }
    } catch {
      setEmployee(null);
    }
  }

  async function handleAddTablet() {
    if (tabletCode.length < 6) return;

    try {
      const result = await getTablet(tabletCode);

      if (!result.success) {
        toast.error("Tablet not found.");
        return;
      }

      const exists = selectedTablets.find(
        (tablet) => tablet.tablet_code === result.tablet.tablet_code
      );

      if (exists) {
        toast.error("Tablet already selected.");
        return;
      }

      setSelectedTablets([
        ...selectedTablets,
        result.tablet,
      ]);

      setTabletCode("");
    } catch {
      toast.error("Unable to find tablet.");
    }
  }

  function removeTablet(tabletCode) {
    setSelectedTablets(
      selectedTablets.filter(
        (tablet) => tablet.tablet_code !== tabletCode
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

    try {
      const result = await issueTablets(
        employee.employee_no,
        selectedTablets.map(
          (tablet) => tablet.tablet_code
        )
      );

      toast.success(
        `Issued ${result.issuedTablets.length} tablet(s) successfully.`
      );

      setEmployee(null);
      setEmployeeCode("");

      setSelectedTablets([]);
      setTabletCode("");
    } catch {
      toast.error("Issue failed.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-8">
          Issue Tablets
        </h1>

        {/* Employee */}

        <div className="mb-8">

          <label className="block mb-2 font-semibold">
            Employee Code
          </label>

          <input
            className="w-full border rounded-lg p-3"
            placeholder="EMP001"
            value={employeeCode}
            onChange={(e) => {

              const code = e.target.value.toUpperCase();

              setEmployeeCode(code);

              handleEmployeeLookup(code);

            }}
          />

          {employee && (

            <div className="mt-3 rounded-lg border border-green-300 bg-green-50 p-3">

              <p className="font-bold">

                ✅ {employee.name}

              </p>

              <p className="text-sm text-gray-600">

                {employee.employee_no}

              </p>

            </div>

          )}

        </div>

        {/* Tablet */}

        <div className="mb-8">

          <label className="block mb-2 font-semibold">
            Tablet Code
          </label>

          <div className="flex gap-3">

            <input
              className="flex-1 border rounded-lg p-3"
              placeholder="TAB001"
              value={tabletCode}
              onChange={(e) =>
                setTabletCode(
                  e.target.value.toUpperCase()
                )
              }
            />

            <button
              onClick={handleAddTablet}
              className="bg-blue-600 text-white px-6 rounded-lg"
            >
              Add
            </button>

          </div>

        </div>

        {/* Selected Tablets */}

        <div className="mb-8">

          <h2 className="text-xl font-bold mb-3">
            Selected Tablets
          </h2>

          {selectedTablets.length === 0 ? (

            <p className="text-gray-500">
              No tablets selected.
            </p>

          ) : (

            <div className="space-y-3">

              {selectedTablets.map((tablet) => (

                <div
                  key={tablet.tablet_code}
                  className="flex justify-between items-center border rounded-lg p-3"
                >

                  <div>

                    <p className="font-semibold">

                      {tablet.display_name}

                    </p>

                    <p className="text-sm text-gray-500">

                      {tablet.tablet_code}

                    </p>

                  </div>

                  <button
                    onClick={() =>
                      removeTablet(tablet.tablet_code)
                    }
                    className="text-red-600 font-semibold"
                  >
                    Remove
                  </button>

                </div>

              ))}

            </div>

          )}

        </div>

        <button
          onClick={handleIssue}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
        >
          Issue Tablets
        </button>

      </div>

    </div>
  );
}

export default IssueTablet;