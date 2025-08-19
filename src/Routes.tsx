import { Route, Routes } from 'react-router-dom';

import Finances from './pages/Finances';
import AddFinance from './pages/AddFinance';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Finances />} />
      <Route path="/add" element={<AddFinance />} />
      <Route path="/:id" element={<AddFinance />} />
    </Routes>
  );
}

export default AppRoutes;
