import { ResponsiveContainer } from './layout/ResponsiveContainer';
import { AdaptiveGrid } from './layout/AdaptiveGrid';
import { Routes, Route } from 'react-router-dom';
import ProfilePage from './pages/StorePage/ProfilePage';
import OrderPage from './pages/StorePage/OrderPage';
import SellPage from './pages/StorePage/SellPage';
import SoonPage from './pages/StorePage/SoonPage';
import ScrollToTop from './hooks/ScrollToTop';
import './App.css';

import StorePage from './pages/StorePage/StorePage';

function App() {
  return (
    <ResponsiveContainer>
      <AdaptiveGrid>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<StorePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/soon" element={<SoonPage />} />
        </Routes>
      </AdaptiveGrid>
    </ResponsiveContainer>
  );
}

export default App;
