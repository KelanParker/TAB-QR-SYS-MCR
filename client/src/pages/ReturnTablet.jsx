import { useState } from "react";
import toast from "react-hot-toast";
import {
  getEmployee,
  getActiveTablets,
  returnTablets,
} from "../services/api";

function ReturnTablet() {

  const [employeeCode, setEmployeeCode] = useState("");

  const [employee, setEmployee] = useState(null);

  const [borrowedTablets, setBorrowedTablets] = useState([]);

  const [selectedTransactions, setSelectedTransactions] = useState([]);

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

    }

    catch {

      toast.error("Return failed.");

    }

  }

  return (

    <div className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-8">

          Return Tablets

        </h1>

        <label className="block mb-2 font-semibold">

          Employee Code

        </label>

        <input

          className="w-full border rounded-lg p-3"

          placeholder="EMP001"

          value={employeeCode}

          onChange={(e) => {

            const code =
              e.target.value.toUpperCase();

            setEmployeeCode(code);

            handleLookup(code);

          }}

        />

        {employee && (

          <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-300">

            <p className="font-bold">

              ✅ {employee.name}

            </p>

            <p className="text-gray-600">

              {employee.employee_no}

            </p>

          </div>

        )}

        <div className="mt-8">

          <h2 className="text-xl font-bold mb-4">

            Borrowed Tablets

          </h2>

          {

            borrowedTablets.length === 0

            ?

            (

              <p className="text-gray-500">

                No active tablets.

              </p>

            )

            :

            (

              <div className="space-y-3">

                {

                  borrowedTablets.map(

                    tablet => (

                      <label

                        key={tablet.transactionId}

                        className="flex justify-between items-center border rounded-lg p-4 cursor-pointer"

                      >

                        <div>

                          <p className="font-semibold">

                            {tablet.display_name}

                          </p>

                          <p className="text-sm text-gray-500">

                            {tablet.tablet_code}

                          </p>

                        </div>

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

                        />

                      </label>

                    )

                  )

                }

              </div>

            )

          }

        </div>

        <button

          onClick={handleReturn}

          className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"

        >

          Return Selected Tablets

        </button>

      </div>

    </div>

  );

}

export default ReturnTablet;