import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import ShopPage from './pages/ShopPage';
import ProfilePage from './pages/ProfilePage';
import OrderPage from './pages/OrderPage';
import SellPage from './pages/SellPage';
import SoonPage from './pages/SoonPage';
import { ResponsiveContainer } from './layout/ResponsiveContainer';
import { AdaptiveGrid } from './layout/AdaptiveGrid';
import ScrollToTop from './hooks/ScrollToTop';
import TopMenu from './components/TopMenu';
import BottomMenu from './components/BottomMenu';
import { ToastProvider } from './context/ToastContext';
import { useAuth } from './hooks/useAuth';
import { useAppStore } from './store';
import './App.css';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetStore, fetchGifts, fetchOrders } = useAppStore();
  useAuth();
  
  useEffect(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.start_param?.startsWith('r_')) {
      navigate('/shop');
    }
  }, [navigate]);

  useEffect(() => {
    const loadData = async () => {
      resetStore();
      await Promise.all([fetchGifts(), fetchOrders()]);
    };
    loadData();
  }, [location.pathname, resetStore, fetchGifts, fetchOrders]);
  
  return (
    <ToastProvider>
      <ResponsiveContainer>
        <AdaptiveGrid>
          {/* <TopMenu /> */}
          <ScrollToTop />
          <Routes>
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/soon" element={<SoonPage />} />
            <Route path="/" element={<Navigate to="/shop" replace />} />
          </Routes>
          <BottomMenu />
        </AdaptiveGrid>
      </ResponsiveContainer>
    </ToastProvider>
  );
}

export default App;
