import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import {
    getEmployees,
    addEmployee,
    deleteEmployee,
    getTablets,
    addTablet,
    deleteTablet
} from "../services/api";
function Admin() {

    const [employees, setEmployees] = useState([]);

    const [employeeNo, setEmployeeNo] = useState("");
    const [employeeName, setEmployeeName] = useState("");

    const [tablets, setTablets] = useState([]);

const [tabletCode, setTabletCode] = useState("");
const [displayName, setDisplayName] = useState("");

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

        const result = await addEmployee(
            employeeNo.toUpperCase(),
            employeeName
        );

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

            confirmButtonColor: "#dc2626"

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

    const result = await addTablet(

        tabletCode.toUpperCase(),

        displayName

    );

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

        confirmButtonColor: "#dc2626"

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

    return (

        <div className="min-h-screen bg-gray-100 py-10">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-4xl font-bold mb-8">

                    Admin Panel

                </h1>

                {/* Employee Section */}

                <div className="bg-white rounded-xl shadow p-6 mb-8">

                    <h2 className="text-2xl font-bold mb-6">

                        Employees

                    </h2>

                    <div className="grid md:grid-cols-3 gap-4 mb-6">

                        <input

                            className="border rounded-lg p-3"

                            placeholder="Employee Code"

                            value={employeeNo}

                            onChange={(e) =>

                                setEmployeeNo(

                                    e.target.value.toUpperCase()

                                )

                            }

                        />

                        <input

                            className="border rounded-lg p-3"

                            placeholder="Employee Name"

                            value={employeeName}

                            onChange={(e) =>

                                setEmployeeName(e.target.value)

                            }

                        />

                        <button

                            onClick={handleAddEmployee}

                            className="bg-green-600 hover:bg-green-700 text-white rounded-lg"

                        >

                            Add Employee

                        </button>

                    </div>

                    <table className="w-full">

                        <thead>

                            <tr className="border-b">

                                <th className="text-left py-3">

                                    Employee No

                                </th>

                                <th className="text-left">

                                    Name

                                </th>

                                <th>

                                    Action

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {employees.map(employee => (

                                <tr
                                    key={employee.id}
                                    className="border-b"
                                >

                                    <td className="py-4">

                                        {employee.employee_no}

                                    </td>

                                    <td>

                                        {employee.name}

                                    </td>

                                    <td className="text-center">

                                        <button

                                            onClick={() =>
                                                handleDeleteEmployee(employee)
                                            }

                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"

                                        >

                                            Delete

                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                <div className="bg-white rounded-xl shadow p-6">

    <h2 className="text-2xl font-bold mb-6">

        Tablets

    </h2>

    <div className="grid md:grid-cols-3 gap-4 mb-6">

        <input

            className="border rounded-lg p-3"

            placeholder="Tablet Code"

            value={tabletCode}

            onChange={(e)=>

                setTabletCode(

                    e.target.value.toUpperCase()

                )

            }

        />

        <input

            className="border rounded-lg p-3"

            placeholder="Display Name"

            value={displayName}

            onChange={(e)=>

                setDisplayName(

                    e.target.value

                )

            }

        />

        <button

            onClick={handleAddTablet}

            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"

        >

            Add Tablet

        </button>

    </div>

    <table className="w-full">

        <thead>

            <tr className="border-b">

                <th className="text-left py-3">

                    Tablet Code

                </th>

                <th className="text-left">

                    Display Name

                </th>

                <th>

                    Action

                </th>

            </tr>

        </thead>

        <tbody>

            {tablets.map(tablet=>(

                <tr
                    key={tablet.id}
                    className="border-b"
                >

                    <td className="py-4">

                        {tablet.tablet_code}

                    </td>

                    <td>

                        {tablet.display_name}

                    </td>

                    <td className="text-center">

                        <button

                            onClick={()=>

                                handleDeleteTablet(tablet)

                            }

                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"

                        >

                            Delete

                        </button>

                    </td>

                </tr>

            ))}

        </tbody>

    </table>

</div>

            </div>

        </div>

        

    );

}

export default Admin;