import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import AppRoutes from './Routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
