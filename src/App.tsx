import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import './App.css';

function App() {
  const navigate = useNavigate();

  useAuth();

  useEffect(() => {
    const start_param = window.Telegram?.WebApp?.initDataUnsafe?.start_param;
    
    if (start_param === 'profile-support') {
      navigate('/profile?support=open');
    }
  }, [navigate]);

  return (
    <ToastProvider>
      <ResponsiveContainer>
        <AdaptiveGrid>
          {/* <TopMenu /> */}
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<ShopPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/soon" element={<SoonPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <BottomMenu />
        </AdaptiveGrid>
      </ResponsiveContainer>
    </ToastProvider>
  );
}

export default App;
