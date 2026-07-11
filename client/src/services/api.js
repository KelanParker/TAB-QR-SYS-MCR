const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/*
==================================
EMPLOYEE
==================================
*/

export async function getEmployee(employeeCode) {

    const response = await fetch(
        `${API_BASE_URL}/employees/${employeeCode}`
    );

    return response.json();

}


/*
==================================
TABLET
==================================
*/

export async function getTablet(tabletCode) {

    const response = await fetch(
        `${API_BASE_URL}/tablets/lookup/${tabletCode}`
    );

    return response.json();

}


/*
==================================
ISSUE TABLETS
==================================
*/

export async function issueTablets(employeeCode, tabletCodes) {

    const response = await fetch(

        `${API_BASE_URL}/transactions/issue`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                employeeCode,
                tabletCodes

            })

        }

    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(data.message);

    }

    return data;

}

/*
==================================
ACTIVE TABLETS
==================================
*/

export async function getActiveTablets(employeeCode) {

    const response = await fetch(

        `${API_BASE_URL}/transactions/active/${employeeCode}`

    );

    return response.json();

}


/*
==================================
RETURN TABLETS
==================================
*/

export async function returnTablets(transactionIds) {

    const response = await fetch(

        `${API_BASE_URL}/transactions/return`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                transactionIds

            })

        }

    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(data.message);

    }

    return data;

}

/*
==================================
DASHBOARD
==================================
*/

export async function getDashboard() {

    const response = await fetch(

        `${API_BASE_URL}/dashboard`

    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(data.message);

    }

    return data;

}

export async function getDashboardStats() {

    const response = await fetch(
        "http://localhost:5000/api/dashboard/stats"
    );

    return response.json();

}

/*
==================================
HISTORY
==================================
*/

export async function getHistory() {

    const response = await fetch(
        `${API_BASE_URL}/history`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;

}

/*
==================================
ADMIN - EMPLOYEES
==================================
*/

export async function getEmployees() {

    const response = await fetch(
        `${API_BASE_URL}/employees`
    );

    return response.json();

}

export async function addEmployee(employee_no, name) {

    const response = await fetch(

        `${API_BASE_URL}/employees`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                employee_no,
                name

            })

        }

    );

    return response.json();

}

export async function deleteEmployee(id) {

    const response = await fetch(

        `${API_BASE_URL}/employees/${id}`,

        {

            method: "DELETE"

        }

    );

    return response.json();

}


/*
==================================
ADMIN - TABLETS
==================================
*/

export async function getTablets() {

    const response = await fetch(
        `${API_BASE_URL}/tablets`
    );

    return response.json();

}

export async function addTablet(tablet_code, display_name) {

    const response = await fetch(

        `${API_BASE_URL}/tablets`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                tablet_code,
                display_name

            })

        }

    );

    return response.json();

}

export async function deleteTablet(id) {

    const response = await fetch(

        `${API_BASE_URL}/tablets/${id}`,

        {

            method: "DELETE"

        }

    );

    return response.json();

}

/*
==================================
ACTIVITY LOGS
==================================
*/

export async function getActivityLogs() {

    const response = await fetch(
        `${API_BASE_URL}/activity`
    );

    return response.json();

}