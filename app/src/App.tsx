import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { Home } from '@/pages/Home';
import { Catalog } from '@/pages/Catalog';
import { ProductDetail } from '@/pages/ProductDetail';
import { Contact } from '@/pages/Contact';
import { Login } from '@/pages/Login';
import { Admin } from '@/pages/Admin';
import { CartProvider } from '@/hooks/useCart';
import { AuthProvider } from '@/hooks/useAuth';
import { useAuth } from '@/hooks/useAuth';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Layout with Header and Footer
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes with Layout */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />
            <Route
              path="/catalogo"
              element={
                <MainLayout>
                  <Catalog />
                </MainLayout>
              }
            />
            <Route
              path="/producto/:id"
              element={
                <MainLayout>
                  <ProductDetail />
                </MainLayout>
              }
            />
            <Route
              path="/contacto"
              element={
                <MainLayout>
                  <Contact />
                </MainLayout>
              }
            />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Admin Route */}
            <Route
              path="/admin"
              element={
                <MainLayout>
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                </MainLayout>
              }
            />

            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        
        {/* Toast Notifications */}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155',
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
