import { useState } from 'react';
import { ResponsiveContainer } from './layout/ResponsiveContainer';
import { AdaptiveGrid } from './layout/AdaptiveGrid';
import './App.css';

import StorePage from './pages/StorePage/StorePage';

function App() {
  return (
    <ResponsiveContainer>
      <AdaptiveGrid>
        <StorePage />
      </AdaptiveGrid>
    </ResponsiveContainer>
  );
}

export default App;
