import { lazy } from "react";

const Diagnostics = lazy(() => import("../components/diagnostics/Diagnostics"));
const DiagnosticsAddEditForm = lazy(() => import("../components/diagnostics/DiagnosticsAddEditForm"));
const DiagnosticsAddEditWizard = lazy(() => import("../components/diagnostics/DiagnosticsAddEditWizard"));

const diagnosticRoutes = [
  {
		path: "/diagnostics",
		name: "Diagnostics",
		element: Diagnostics,
		roles: ["Vet"],
		exact: true,
		isAnonymous: false,
	},
	{
		path: "/diagnostics/create",
		name: "DiagnosticsAddForm",
		element: DiagnosticsAddEditForm,
		roles: ["Vet"],
		exact: true,
		isAnonymous: false,
	},
	{
		path: "/diagnostics/edit/:id",
		name: "DiagosticEditform",
		element: DiagnosticsAddEditForm,
		roles: ["Vet"],
		exact: true,
		isAnonymous: false,
	  },
    {
      path: "/diagnostics/new",
      name: "DiagnosticAddForm",
      element: DiagnosticsAddEditWizard,
      roles: ["Vet"],
      exact: true,
      isAnonymous: false,
      },
      {
        path: "/diagnostics/editdiag/:id",
        name: "DiagnosticAddForm",
        element: DiagnosticsAddEditWizard,
        roles: ["Vet"],
        exact: true,
        isAnonymous: false,
        },
]


const allRoutes = [
  ...diagnosticRoutes,
];

export default allRoutes;
