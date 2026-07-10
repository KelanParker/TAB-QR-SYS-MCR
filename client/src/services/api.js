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