// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout
import Navbar from "./components/layout/Navbar";

// Tenders pages
import TendersPage from "./pages/Tenders/TendersPage";
import InterestedPage from "./pages/Tenders/InterestedPage";
import ArchivePage from "./pages/Tenders/ArchivePage";
import CreateTenderPage from "./pages/Tenders/CreateTender";
import TenderDetails from "./pages/Tenders/TenderDetails";

// Workdesk pages
import ActiveWorkspaces from "./pages/Workdesk/ActiveWorkspaces";
import Workspaces from "./pages/Workdesk/Workspaces";

// Orders pages
import GEMContracts from "./pages/Orders/GEMContracts";
import WorkOrders from "./pages/Orders/WorkOrders";
import POTracking from "./pages/Orders/POTracking";
import BillingInvoices from "./pages/Orders/BillingInvoices";

// Insights pages
import WinningProbability from "./pages/Insights/WinningProbability";
import CompetitorAnalysis from "./pages/Insights/CompetitorAnalysis";
import CompetitorProfile from "./pages/Insights/CompetitorProfile";
import ProductSuggestions from "./pages/Insights/ProductSuggestions";
import PricingEvaluation from "./pages/Insights/PricingEvaluation";
import BOQInsights from "./pages/Insights/BOQInsights";
import HistoricalComparison from "./pages/Insights/HistoricalComparison";
import CompanyProfile from "./pages/Insights/CompanyProfile";
import CompareBidders from "./pages/Insights/CompareBidders";


// Dealers pages
import Distributors from "./pages/Dealers/Distributors";
import Oems from "./pages/Dealers/Oems";
//import OEMs from "./pages/Dealers/OEMs";
//import PartnerPerformance from "./pages/Dealers/PartnerPerformance";
//import ProductCatalogs from "./pages/Dealers/ProductCatalogs";

/**
 * App.jsx
 * Main routing file for Meril Tenders.
 *
 * Ensure all imported files exist at the specified paths.
 * Default route: "/" -> "/tenders"
 */

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main
        style={{
          padding: "1.5rem",
          background: "#f3f6fb",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Routes>
          {/* Default */}
          <Route path="/" element={<Navigate to="/tenders" replace />} />

          {/* Tenders */}
          <Route path="/tenders" element={<TendersPage />} />
          <Route path="/tenders/tenderdetails/:id" element={<TenderDetails />} />
          <Route path="/interested" element={<InterestedPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/create" element={<CreateTenderPage />} />

          {/* Tender Workdesk */}
          <Route path="/workdesk/active-workspaces" element={<ActiveWorkspaces />} />
          <Route path="/workspace/:tenderId" element={<Workspaces />} />

          {/* Orders */}
          <Route path="/orders/gem-contracts" element={<GEMContracts />} />
          <Route path="/orders/work-orders" element={<WorkOrders />} />
          <Route path="/orders/po-tracking" element={<POTracking />} />
          <Route path="/orders/billing-invoices" element={<BillingInvoices />} />

          {/* Dealer Management */}
          <Route path="/dealers/distributors" element={<Distributors />} />
           <Route path="/dealers/oems" element={<Oems />} /> 
          {/* <Route path="/dealers/partner-performance" element={<PartnerPerformance />} /> */}
          {/* <Route path="/dealers/product-catalogs" element={<ProductCatalogs />} /> */}

          {/* Tender Insights */}
          <Route path="/insights/winning-probability" element={<WinningProbability />} />
          <Route path="/insights/competitor-analysis" element={<CompetitorAnalysis />} />
          <Route path="/insights/CompetitorProfile" element={<CompetitorProfile />}/>
          <Route path="/insights/product-suggestions" element={<ProductSuggestions />} />
          <Route path="/insights/pricing-evaluation" element={<PricingEvaluation />} />
          <Route path="/insights/boq-insights" element={<BOQInsights />} />
          <Route path="/insights/historical-comparison" element={<HistoricalComparison />} />
          <Route path="/insights/Company-Profile" element={<CompanyProfile />} />
          <Route path="/insights/Compare-Bidders" element={<CompareBidders />} />
        

          {/* 404 Fallback */}
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
    </BrowserRouter>
  );
}

export default App;
