// src/App.jsx
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// Layout
import Navbar from "./components/layout/Navbar";

// Auth
import Login from "./pages/Login";

// Tenders
import TendersPage from "./pages/Tenders/TendersPage";
import InterestedPage from "./pages/Tenders/InterestedPage";
import ArchivePage from "./pages/Tenders/ArchivePage";
import CreateTenderPage from "./pages/Tenders/CreateTender";
import TenderDetails from "./pages/Tenders/TenderDetails";

// Workdesk
import ActiveWorkspaces from "./pages/Workdesk/ActiveWorkspaces";
import Workspaces from "./pages/Workdesk/Workspaces";

// Orders
import GEMContracts from "./pages/Orders/GEMContracts";
import WorkOrders from "./pages/Orders/WorkOrders";
import POTracking from "./pages/Orders/POTracking";
import BillingInvoices from "./pages/Orders/BillingInvoices";

// Insights
import WinningProbability from "./pages/Insights/WinningProbability";
import CompetitorAnalysis from "./pages/Insights/CompetitorAnalysis";
import CompetitorProfile from "./pages/Insights/CompetitorProfile";
import ProductSuggestions from "./pages/Insights/ProductSuggestions";
import PricingEvaluation from "./pages/Insights/PricingEvaluation";
import BOQInsights from "./pages/Insights/BOQInsights";
import HistoricalComparison from "./pages/Insights/HistoricalComparison";
import CompanyProfile from "./pages/Insights/CompanyProfile";
import CompareBidders from "./pages/Insights/CompareBidders";

// Dealers
import Distributors from "./pages/Dealers/Distributors";
import Oems from "./pages/Dealers/Oems";

import Sample from "./pages/Tenders/sample";

/* -------------------------
   AUTH + ROLE GUARD
------------------------- */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

/* -------------------------
   APP LAYOUT
------------------------- */
const AppLayout = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <main
        style={{
          padding: hideNavbar ? "0" : "1.5rem",
          background: "#f3f6fb",
          minHeight: hideNavbar
            ? "100vh"
            : "calc(100vh - 64px)",
        }}
      >
        <Routes>
          {/* -------- AUTH -------- */}
          <Route path="/login" element={<Login />} />

          {/* -------- DEFAULT REDIRECT -------- */}
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          {/* ================= ADMIN ROUTES ================= */}
          <Route
            path="/Admin/tenders"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <TendersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Admin/tenderdetails/:id"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <TenderDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Admin/interested"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <InterestedPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Admin/archive"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <ArchivePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Admin/create"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <CreateTenderPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Workdesk */}
          <Route
            path="/Admin/workdesk/active-workspaces"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <ActiveWorkspaces />
              </ProtectedRoute>
            }
          />

          {/* ================= USER ROUTES ================= */}
          <Route
            path="/User/tenders"
            element={
              <ProtectedRoute allowedRoles={["User"]}>
                <TendersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/User/tenderdetails/:id"
            element={
              <ProtectedRoute allowedRoles={["User"]}>
                <TenderDetails />
              </ProtectedRoute>
            }
          />

          {/* ================= SHARED ROUTES ================= */}
          <Route
            path="/tenders/tenderdetails/:tenderId"
            element={
              <ProtectedRoute allowedRoles={["Admin", "User"]}>
                <TenderDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workspace/:tenderId"
            element={
              <ProtectedRoute allowedRoles={["Admin", "User"]}>
                <Workspaces />
              </ProtectedRoute>
            }
          />

          {/* Orders */}
          <Route
            path="/orders/gem-contracts"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <GEMContracts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders/work-orders"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <WorkOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders/po-tracking"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <POTracking />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders/billing-invoices"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <BillingInvoices />
              </ProtectedRoute>
            }
          />

          {/* Insights */}
          <Route
            path="/insights/winning-probability"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <WinningProbability />
              </ProtectedRoute>
            }
          />

          <Route
            path="/insights/competitor-analysis"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <CompetitorAnalysis />
              </ProtectedRoute>
            }
          />

          <Route
            path="/insights/CompetitorProfile"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <CompetitorProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/insights/product-suggestions"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <ProductSuggestions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/insights/pricing-evaluation"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <PricingEvaluation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/insights/boq-insights"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <BOQInsights />
              </ProtectedRoute>
            }
          />

          <Route
            path="/insights/historical-comparison"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <HistoricalComparison />
              </ProtectedRoute>
            }
          />

          <Route
            path="/insights/Company-Profile"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <CompanyProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/insights/Compare-Bidders"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <CompareBidders />
              </ProtectedRoute>
            }
          />

          {/* Dealers */}
          <Route
            path="/dealers/distributors"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Distributors />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dealers/oems"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Oems />
              </ProtectedRoute>
            }
          />

          {/* -------- UNAUTHORIZED -------- */}
          <Route
            path="/unauthorized"
            element={
              <div style={{ padding: "2rem" }}>
                <h2>403 — Unauthorized</h2>
                <p>You do not have permission to access this page.</p>
              </div>
            }
          />

          {/* -------- 404 -------- */}
          <Route
            path="*"
            element={
              <div style={{ padding: "2rem" }}>
                <h2>404 — Page Not Found</h2>
                <p>The page you requested does not exist.</p>
              </div>
            }
          />
        </Routes>
      </main>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
