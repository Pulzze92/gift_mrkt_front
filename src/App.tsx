import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
  useAuth();

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
