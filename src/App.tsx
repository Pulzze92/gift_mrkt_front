import { ResponsiveContainer } from './layout/ResponsiveContainer';
import { AdaptiveGrid } from './layout/AdaptiveGrid';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import OrderPage from './pages/OrderPage';
import SellPage from './pages/SellPage';
import SoonPage from './pages/SoonPage';
import ScrollToTop from './hooks/ScrollToTop';
import StorePage from './pages/StorePage';
import { useAuth } from './hooks/useAuth';
import TopMenu from './components/TopMenu';
import BottomMenu from './components/BottomMenu';
import './App.css';
import { ToastProvider } from './context/ToastContext';

function App() {
  useAuth();

  return (
    <ToastProvider>
      <ResponsiveContainer>
        <AdaptiveGrid>
          <TopMenu />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Navigate to="/shop" replace />} />
            <Route path="/shop" element={<StorePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/soon" element={<SoonPage />} />
          </Routes>
          <BottomMenu />
        </AdaptiveGrid>
      </ResponsiveContainer>
    </ToastProvider>
  );
}

export default App;
