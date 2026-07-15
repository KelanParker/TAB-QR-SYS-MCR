MCR Tablet Management System

Features

- Dashboard
- Issue Tablets
- Return Tablets
- Transaction History
- Activity Logs
- Admin Panel
- SQLite Database
- REST API

Tech Stack

Frontend
- React
- Vite
- Tailwind CSS

Backend
- Node.js
- Express

Database
- SQLite
```
TAB-QR-SYS-MCR
├─ client
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.jsx
│  │  ├─ components
│  │  │  ├─ Navbar.jsx
│  │  │  ├─ QRModal.jsx
│  │  │  ├─ QRScannerModal.jsx
│  │  │  ├─ StatCard.jsx
│  │  │  └─ TabletCard.jsx
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ Activity.jsx
│  │  │  ├─ Admin.jsx
│  │  │  ├─ Dashboard.jsx
│  │  │  ├─ History.jsx
│  │  │  ├─ IssueTablet.jsx
│  │  │  └─ ReturnTablet.jsx
│  │  └─ services
│  │     └─ api.js
│  └─ vite.config.js
├─ README.md
└─ server
   ├─ app.js
   ├─ data
   │  └─ mcr.db
   ├─ database
   │  ├─ db.js
   │  └─ init.js
   ├─ package-lock.json
   ├─ package.json
   ├─ routes
   │  ├─ activityRoutes.js
   │  ├─ dashboardRoutes.js
   │  ├─ employeeRoutes.js
   │  ├─ historyRoutes.js
   │  ├─ tabletLookupRoutes.js
   │  ├─ tabletRoutes.js
   │  └─ transactionRoutes.js
   └─ utils
      └─ activityLogger.js

```