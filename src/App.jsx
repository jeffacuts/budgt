import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider, useData } from './data';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Overzicht from './pages/Overzicht';
import Inkomsten from './pages/Inkomsten';
import Uitgaven from './pages/Uitgaven';
import Schulden from './pages/Schulden';
import Contacten from './pages/Contacten';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useData();
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/overzicht" element={<Overzicht />} />
                    <Route path="/inkomsten" element={<Inkomsten />} />
                    <Route path="/uitgaven" element={<Uitgaven />} />
                    <Route path="/schulden" element={<Schulden />} />
                    <Route path="/contacten" element={<Contacten />} />
                    <Route path="*" element={<Navigate to="/overzicht" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
