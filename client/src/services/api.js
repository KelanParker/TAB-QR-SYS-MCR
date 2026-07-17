const API_BASE_URL = import.meta.env.VITE_API_URL || "https://tab-qr-backend.onrender.com/api";

/*
==================================
EMPLOYEE
==================================
*/

export async function getEmployee(employeeCode) {

    const requestUrl = `${API_BASE_URL}/employees/${employeeCode}`;

    const response = await fetch(requestUrl);

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
GET ISSUED TABLET
==================================
*/

export async function getIssuedTablet(tabletCode) {

    const response = await fetch(

        `${API_BASE_URL}/transactions/tablet/${tabletCode}`

    );

    return response.json();

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
        `${API_BASE_URL}/dashboard/stats`
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

export async function deleteHistoryRecord(id) {

    const response = await fetch(
        `${API_BASE_URL}/history/${id}`,
        {
            method: "DELETE"
        }
    );

    return response.json();

}

export async function clearHistory() {

    const response = await fetch(
        `${API_BASE_URL}/history`,
        {
            method: "DELETE"
        }
    );

    return response.json();

}

/*
==================================
ADMIN - EMPLOYEES
==================================
*/

export async function getEmployees() {

    const requestUrl = `${API_BASE_URL}/employees`;

    const response = await fetch(requestUrl);

    return response.json();

}

export async function addEmployee(employee_no, name) {

    const requestUrl = `${API_BASE_URL}/employees`;

    const response = await fetch(

        requestUrl,

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

    const requestUrl = `${API_BASE_URL}/employees/${id}`;

    const response = await fetch(

        requestUrl,

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

export async function verifyAdminPassword(password) {

    const response = await fetch(
        `${API_BASE_URL}/admin/verify`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password
            })
        }
    );

    return response.json();

}

/*
==================================
ADMIN - EXPORT BACKUP
==================================
*/

export async function exportBackup() {

    const response = await fetch(
        `${API_BASE_URL}/admin/export`
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(data.message);

    }

    return data;

}

export async function importBackup(backupData) {

    const response = await fetch(
        `${API_BASE_URL}/admin/import`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(backupData)
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
ACTIVITY LOGS
==================================
*/

export async function getActivityLogs() {

    const response = await fetch(
        `${API_BASE_URL}/activity`
    );

    return response.json();

}

export async function deleteActivityLog(id) {

    const response = await fetch(
        `${API_BASE_URL}/activity/${id}`,
        {
            method: "DELETE"
        }
    );

    return response.json();

}

export async function clearActivityLogs() {

    const response = await fetch(
        `${API_BASE_URL}/activity`,
        {
            method: "DELETE"
        }
    );

    return response.json();

}

export async function getEmployeeQrToken(employeeNo) {

    const requestUrl = `${API_BASE_URL}/employees/${employeeNo}/qr-token`;

    const response = await fetch(requestUrl);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;

}

export async function verifyEmployeeQrToken(token) {

    const requestUrl = `${API_BASE_URL}/employees/verify-qr`;

    const response = await fetch(
        requestUrl,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;

}