import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useState, useRef } from "react";
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

  const [loading, setLoading] = useState(false);

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

  async function handleAddTablet() {

    if (!employee) {
      toast.error("Select an employee first.");
      return;
    }

    if (tabletCode.length < 6) return;

    if (selectedTablets.length >= 7) {
      toast.error("Maximum tablets selected.");
      return;
    }

    try {

      const result = await getTablet(tabletCode);

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
            ref={employeeInputRef}
            className="w-full border rounded-lg p-3"
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
              ref={tabletInputRef}
              className="flex-1 border rounded-lg p-3"
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
              onClick={handleAddTablet}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg"
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
                    className="text-red-600 hover:text-red-700 font-semibold"
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
          disabled={loading || selectedTablets.length === 0}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >

          {loading ? "Issuing..." : "Issue Tablets"}

        </button>

      </div>

    </div>

  );

}

export default IssueTablet;