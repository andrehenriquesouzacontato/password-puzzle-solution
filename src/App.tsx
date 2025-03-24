
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";

// Auth pages
import Login from "./pages/Login";
import RecuperarSenha from "./pages/RecuperarSenha";

// Client pages
import Dashboard from "./pages/Dashboard";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NovoCliente from "./pages/admin/NovoCliente";
import ClienteDetalhes from "./pages/admin/ClienteDetalhes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          
          {/* Client Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/novo-cliente" element={<NovoCliente />} />
          <Route path="/admin/cliente/:id" element={<ClienteDetalhes />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
