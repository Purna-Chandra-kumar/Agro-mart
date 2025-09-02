
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import FarmerDashboardPage from "./pages/FarmerDashboardPage";
import BuyerDashboardPage from "./pages/BuyerDashboardPage";
import ProductDetail from "./pages/ProductDetail";
import MarketPrices from "./pages/MarketPrices";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/farmer-dashboard" element={<FarmerDashboardPage />} />
          <Route path="/buyer-dashboard" element={<BuyerDashboardPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/market-prices" element={<MarketPrices />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
